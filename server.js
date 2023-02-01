const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;
const app = express();
const MessageSalon = db.messageSalon;
const User = db.users;
const Salon = db.salon;
var bcrypt = require("bcryptjs");

// const SSEClient = require('./app/SSE/SSEClient');
const SSEManager = require('./app/SSE/SSEManager');

var corsOptions = {
  // origin: "http://localhost:8080/",
  AccessControlAllowOrigin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
  res.sendFile(__dirname + "/index.html");
});

require("./app/routes/auth.routes")(app);
require("./app/routes/userAcces.routes")(app);
require("./app/routes/admin/user.routes")(app);
require("./app/routes/admin/role.routes")(app);
require("./app/routes/admin/salon.routes")(app);
require("./app/routes/salon.routes")(app);
require("./app/routes/privateChat.routes")(app);
require("./app/routes/usersList.routes")(app);
// app.get("/:universalURL", (req, res) => {
//   res.send("404 URL NOT FOUND");
// });

const sseManager = new SSEManager();
app.set('sseManager', sseManager);

app.get('/reduction_jour',async(req,res)=>{
  const sseManager = req.app.get('sseManager');
 
  /* Notre route étant publique nous n'avons pas l'identité de l'utilisateur,
     nous générons donc un identifiant aléatoirement
   */
  const id = Math.random().toString(36).substring(7);
 
  /* On ouvre la connexion avec notre client */
  sseManager.open(id, res);
  /* On envoie le nombre de clients connectés à l'ensemble des clients */
  sseManager.broadcast({
    id: Date.now(),
    type: 'message_reduction',
    data: 'Une reduction de 50% sur les produits de la journée'
  });

  req.on('close', () => {
    /* En cas de deconnexion on supprime le client de notre manager */
        sseManager.delete(id);
      });
})

app.get('/nous_contacter',async(req,res)=>{
  const sseManager = req.app.get('sseManager');
 
  /* Notre route étant publique nous n'avons pas l'identité de l'utilisateur,
     nous générons donc un identifiant aléatoirement
   */
  const id = Math.random().toString(36).substring(7);
 
  /* On ouvre la connexion avec notre client */
  sseManager.open(id, res);
  /* On envoie le nombre de clients connectés à l'ensemble des clients */
  sseManager.broadcast({
    id: Date.now(),
    type: 'message_contact',
    data: 'N\'hésitez pas à nous contacter pour plus d\'informations'
  });

  req.on('close', () => {
    /* En cas de deconnexion on supprime le client de notre manager */
        sseManager.delete(id);
      });
})

app.get('/maintenance',async(req,res)=>{
  const sseManager = req.app.get('sseManager');
 
  /* Notre route étant publique nous n'avons pas l'identité de l'utilisateur,
     nous générons donc un identifiant aléatoirement
   */
  const id = Math.random().toString(36).substring(7);
 
  /* On ouvre la connexion avec notre client */
  sseManager.open(id, res);
  /* On envoie le nombre de clients connectés à l'ensemble des clients */
  sseManager.broadcast({
    id: Date.now(),
    type: 'message_maintenance',
    data: 'Le site sera bientot en maintenance !'
  });

  req.on('close', () => {
    /* En cas de deconnexion on supprime le client de notre manager */
        sseManager.delete(id);
      });
})

// set port, listen for requests
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

var countUser = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  //-----------------Gestion connexion ------------------
  socket.on("JOIN", (data) => {
    //--------------Join un salon------------------
    socket.join(data.salon.name);
    socket.salons = data.salon.name;
    //--------------Service message connecté ------------------
    loggedUser = data.user.username;
    var serviceMessage = {
      message: loggedUser + ' s\'est connecté',
      type: 'login'
    };
    socket.broadcast
      .in(data.salon.name)
      .emit("SERVICE_MESSAGE", serviceMessage);
    //--------------Recuperation des messages du salon------------------
    MessageSalon.findAll({
      where: {
        salonId: data.salon.id,
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "ASC"]],
    })
      .then((messages) => {
        io.in(data.salon.name).emit("INIT_MESSAGES", messages);
      })
      .catch((err) => {
        console.log(err);
      });
    //--------------Recuperation du nombre utilisateurs connectés------------------
    let existingRoom = countUser.find(
      (salon) => salon.name === data.salon.name
    );
    if (existingRoom) {
      existingRoom.users.push(data.user.username);
    } else {
      countUser.push({ name: data.salon.name, users: [data.user.username] });
    }
    io.in(socket.salons).emit("COUNT_USER", { countUser });
  });

  //-----------------Typing------------------
  socket.on("TYPING", (data) => {
    io.in(data.salon.name).emit("TYPING", data);
  });

  //-----------------Gestion de déconnexion------------------
  socket.on("LEAVE", (data) => {
    loggedUser = data.user.username;
    var serviceMessage = {
      message: loggedUser + " c'est deconnecté",
      type: "logout",
    };
    socket.broadcast.in(socket.salons).emit("SERVICE_MESSAGE", serviceMessage);

    //--------------Recuperation du nombre utilisateurs connectés------------------
    let existingRoom = countUser.find((salon) => salon.name === data.salon);
    if (existingRoom) {
      var index = existingRoom.users.indexOf(data.user.username);
      if (index > -1) {
        existingRoom.users.splice(index, 1);
      }
    }
    io.in(socket.salons).emit("COUNT_USER", { countUser });
    //--------------Leave un salon------------------
    socket.leave(socket.salons);
  });

  //-----------------Envoi de message------------------
  socket.on("SEND_MESSAGE", (data) => {
    MessageSalon.create({
      content: data.message,
      salonId: data.salon.id,
      statut: true,
      userId: data.user.id,
    })
      .then(() => {
        io.in(data.salon.name).emit("MESSAGE", data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //------------------Deconnexion------------------
  socket.on("DISCONNECT_USER", (data) => {
    if (data.salon) {
      loggedUser = data.user.username;
      var serviceMessage = {
        message: loggedUser + " c'est deconnecté",
        type: "logout",
      };
      //recupérer le salon de l'utilisateu dans le socket
      socket.in(data.salon.name).emit("SERVICE_MESSAGE", serviceMessage);
      //--------------Recuperation du nombre  connectés------------------
      let existingRoom = countUser.find(
        (salon) => salon.name === socket.salons
      );
      if (existingRoom) {
        var index = existingRoom.users.indexOf(data.user.username);
        if (index > -1) {
          existingRoom.users.splice(index, 1);
        }
      }
      io.in(data.salon.name).emit("COUNT_USER", { countUser });
      io.emit("COUNT_USER_INIT", { countUser });
      //--------------Leave un salon------------------
      socket.leave(data.salon.name);
    }
    setTimeout(() => socket.disconnect(true), 5000);
  });

  //------------------Initialisation du nombre d'utilisateurs connectés------------------
  socket.on("COUNT_USER_INIT", () => {
    io.emit("COUNT_USER_INIT", { countUser });
  });

  socket.on("private-message", async (data) => {
    const user = await User(data.token);
    const username = user ? user.username : "anonymous";
    const message = {
      content: data.content,
    };
    const messageResponse = await messageService.create(message);
    io.to(username + ":" + data.receiver).emit(
      "new-private-message",
      messageResponse
    );
    io.to(data.receiver + ":" + username).emit(
      "new-private-message",
      messageResponse
    );
  });
    //------------------Chatbot------------------
    let appointments = []; // Storing appointments
    let msgDebutWorkflow = 'Bonjour, je suis votre assistant personnel. Comment puis-je vous aider ?';
    let msgRedemarrageWorkflow = 'Avez-vous encore besoin d\'aide sur un autre sujet ?';

    function checkAvailability(currentDate, offset = 0) {
      let availability = [{ value : "01-02-2023", title : "01-02-2023" }, { value : "02-02-2023", title : "02-02-2023" }, { value : "03-02-2023", title : "03-02-2023" }, { value : "04-02-2023", title : "04-02-2023" }, { value : "05-02-2023", title : "05-02-2023" }];
      // let date = new Date(currentDate);
      // date.setDate(date.getDate() + offset);
      // for (let i = 0; i < 7; i++) {
      //     let day = date.getDay();
      //     if (day !== 0 && day !== 6) {
      //         let dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      //         if (!appointments[dateString]) {
      //             availability.push(dateString);
      //         }
      //     }
      //     date.setDate(date.getDate() + 1);
      // }
      return availability;
    }

    socket.on('help_request', data => {
        // Ask for help type
        socket.emit('help_type', { message: msgDebutWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
    });
    socket.on('vehicle_maintenance', data => {
        // Ask for vehicle year
        socket.emit('vehicle_year_question', { message: 'Quelle est l\'année de votre véhicule ?', toEmit: 'vehicle_year' });

    });

    socket.on('vehicle_year', data => {
        // Ask for last maintenance date
        socket.emit('last_maintenance_question', { message: 'De quand date le dernier entretien de votre moto ?', toEmit: 'last_maintenance' });

        socket.on('last_maintenance', data => {
            let lastMaintenance = new Date(data);
            let currentDate = new Date();
            let oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            if (lastMaintenance < oneYearAgo) {
                // Check availability for current week
                let currentWeekAvailability = checkAvailability(currentDate);
                if (currentWeekAvailability.length > 0) {
                    // Offer available dates for current week
                    socket.emit('current_week_availability', { message: 'Voici les dates disponibles cette semaine :', availability: currentWeekAvailability, toEmit: 'selected_date' });
                    socket.on('selected_date', data => {
                        // Save selected date on server
                        appointments[data] = { user: socket.id };
                        socket.emit('appointment_confirmed', { message: 'Votre rendez-vous du ' + data + ' a bien été confirmé.' });
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    });
                } else {
                    // Check availability for next week
                    let nextWeekAvailability = checkAvailability(currentDate, 7);
                    if (nextWeekAvailability.length > 0) {
                        // Offer available dates for next week
                        socket.emit('next_week_availability', { message: 'Il n\'y a plus de dates disponibles cette semaine. Voici ce que je peux vous proposer pour la semaine prochaine :', availability: nextWeekAvailability, toEmit: 'selected_date' });
                        socket.on('selected_date', data => {
                            // Save selected date on server
                            appointments[data] = { user: socket.id };
                            socket.emit('appointment_confirmed', { message: 'Votre rendez-vous du ' + data + ' a bien été confirmé.' });
                            // Restart workflow
                            socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                        });
                    } else {
                        socket.emit('no_availability', { message: 'Désolé, Nous n\'avons pas de dates disponibles pour le moment.' });
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    }
                }
            } else {
                // Ask for kilometers driven since last maintenance
                socket.emit('km_driven_question', { message: 'Combien de kilomètres avez-vous parcouru depuis la dernière maintenance ?', toEmit: 'km_driven' });
                
                socket.on('km_driven', data => {
                    if (data >= 10000) {
                        // Check availability for current week
                        let currentWeekAvailability = checkAvailability(currentDate);
                        if (currentWeekAvailability.length > 0) {
                            // Offer available dates for current week
                            socket.emit('current_week_availability', { message: 'Voici les dates disponibles cette semaine :', availability: currentWeekAvailability, toEmit: 'selected_date' });
                            socket.on('selected_date', data => {
                                // Save selected date on server
                                appointments[data] = { user: socket.id };
                                socket.emit('appointment_confirmed', { message: 'Votre rendez-vous du ' + data + ' a bien été confirmé.' });
                                // Restart workflow
                                socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                            });
                        } else {
                            // Check availability for next week
                            let nextWeekAvailability = checkAvailability(currentDate, 7);
                            if (nextWeekAvailability.length > 0) {
                                // Offer available dates for next week
                                socket.emit('next_week_availability', { message: 'Il n\'y a plus de dates disponibles cette semaine. Voici ce que je peux vous proposer pour la semaine prochaine :', availability: nextWeekAvailability, toEmit: 'selected_date' });
                                socket.on('selected_date', data => {
                                    // Save selected date on server
                                    appointments[data] = { user: socket.id };
                                    socket.emit('appointment_confirmed', { message: 'Votre rendez-vous du ' + data + ' a bien été confirmé.' });
                                    // Restart workflow
                                    socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                                });
                            } else {
                                socket.emit('no_availability', { message: 'Désolé, Nous n\'avons pas de dates disponibles pour le moment.' });
                                // Restart workflow
                                socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                            }
                        }
                    } else {
                        // Ask if user wants to schedule a maintenance
                        socket.emit('schedule_maintenance_question', { message: 'Voulez-vous réviser votre véhicule ?', buttons: [{ "value" : "1", "title" : "Oui" }, { "value" : "0", "title" : "Non" }], toEmit: 'schedule_maintenance' });
                        socket.on('schedule_maintenance', data => {
                            if (data) {
                                // Check availability for current week
                                let currentWeekAvailability = checkAvailability(currentDate);
                                if (currentWeekAvailability.length > 0) {
                                    // Offer available dates for current week
                                    socket.emit('current_week_availability', { message: 'Voici les dates disponibles cette semaine :', availability: currentWeekAvailability, toEmit: 'selected_date' });
                                    socket.on('selected_date', data => {
                                        // Save selected date on server
                                        appointments[data] = { user: socket.id };
                                        socket.emit('appointment_confirmed', { message: 'Votre rendez-vous du ' + data + ' a bien été confirmé.' });
                                        // Restart workflow
                                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                                    });
                                } else {
                                    // Check availability for next week
                                    let nextWeekAvailability = checkAvailability(currentDate, 7);
                                    if (nextWeekAvailability.length > 0) {
                                        // Offer available dates for next week
                                        socket.emit('next_week_availability', { message: 'Il n\'y a plus de dates disponibles cette semaine. Voici ce que je peux vous proposer pour la semaine prochaine :', availability: nextWeekAvailability, toEmit: 'selected_date' });
                                        socket.on('selected_date', data => {
                                            // Save selected date on server
                                            appointments[data] = { user: socket.id };
                                            socket.emit('appointment_confirmed', { message: 'Votre rendez-vous du ' + data + ' a bien été confirmé.' });
                                            // Restart workflow
                                            socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                                        });
                                    } else {
                                        socket.emit('no_availability', { message: 'Désolé, Nous n\'avons pas de dates disponibles pour le moment.' });
                                        // Restart workflow
                                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                                    }
                                }
                            } else {
                                // Restart workflow
                                socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                            }
                        });
                    }
                });
            }
        });
    });
        
    socket.on('vehicle_info', data => {
        // Ask for usage type
        socket.emit('usage_type_question', { message: 'Quel type d\'usage avez-vous ?', buttons: [{ "value" : "road", "title" : "Route" }, { "value" : "off-road", "title" : "Hors piste" }, { "value" : "performance", "title" : "Course" } ], toEmit: 'usage_type' });
        socket.on('usage_type', data => {
            let date = new Date();
            let currentDate = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? "0".concat(date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate();
            if (data === 'road') {
                // Offer road test drive
                let currentWeekAvailability = checkAvailability(currentDate);
                if (currentWeekAvailability.length > 0) {
                    // Offer available dates for current week
                    socket.emit('current_week_availability', { message: 'Voici les dates disponibles cette semaine :', availability: currentWeekAvailability, toEmit: 'selected_date' });
                    socket.on('selected_date', data => {
                        // Save selected date on server
                        appointments[data] = { user: socket.id, type: 'road' };
                        socket.emit('appointment_confirmed', { message: 'Votre rendez-vous du ' + data + ' a bien été confirmé.'});
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    });
                } else {
                    // Check availability for next week
                    let nextWeekAvailability = checkAvailability(currentDate, 7);
                    if (nextWeekAvailability.length > 0) {
                        // Offer available dates for next week
                        socket.emit('next_week_availability', { message: 'Il n\'y a plus de dates disponibles cette semaine. Voici ce que je peux vous proposer pour la semaine prochaine :', availability: nextWeekAvailability, toEmit: 'selected_date' });
                        socket.on('selected_date', data => {
                            // Save selected date on server
                            appointments[data] = { user: socket.id, type: 'road' };
                            socket.emit('appointment_confirmed', { message: 'Votre rendez-vous de test de conduite pour le ' + data + ' a bien été confirmé' });
                            // Restart workflow
                            socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                        });
                    } else {
                        socket.emit('no_availability', { message: 'Désolé, Nous n\'avons pas de dates disponibles pour le moment.' });
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    }
                }
            } else if (data === 'off-road') {
                // Offer off-road test drive
                let currentWeekAvailability = checkAvailability(currentDate);
                if (currentWeekAvailability.length > 0) {
                    // Offer available dates for current week
                    socket.emit('current_week_availability', { message: 'Voici les dates disponibles cette semaine : ', availability: currentWeekAvailability, toEmit: 'selected_date' });
                    socket.on('selected_date', data => {
                        // Save selected date on server
                        appointments[data] = { user: socket.id, type: 'off-road' };
                        socket.emit('appointment_confirmed', { message: 'Votre rendez-vous de test de conduite pour le ' + data + ' a bien été confirmé' });
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    });
                } else {
                    // Check availability for next week
                    let nextWeekAvailability = checkAvailability(currentDate, 7);
                    if (nextWeekAvailability.length > 0) {
                        // Offer available dates for next week
                        socket.emit('next_week_availability', { message: 'Il n\'y a plus de dates disponibles cette semaine. Voici ce que je peux vous proposer pour la semaine prochaine : ', availability: nextWeekAvailability, toEmit: 'selected_date' });
                        socket.on('selected_date', data => {
                            // Save selected date on server
                            appointments[data] = { user: socket.id, type: 'off-road' };
                            socket.emit('appointment_confirmed', { message: 'Votre rendez-vous de test de conduite pour le ' + data + ' a bien été confirmé' });
                            // Restart workflow
                            socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                        });
                    } else {
                        socket.emit('no_availability', { message: 'Désolé, Nous n\'avons pas de dates disponibles pour le moment.' });
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    }
                }
            } else if (data === 'performance') {
                // Offer performance test drive
                let currentWeekAvailability = checkAvailability(currentDate);
                if (currentWeekAvailability.length > 0) {
                    // Offer available dates for current week
                    socket.emit('current_week_availability', { message: 'Voici les dates disponibles cette semaine', availability: currentWeekAvailability, toEmit: 'selected_date' });
                    socket.on('selected_date', data => {
                        // Save selected date on server
                        appointments[data] = { user: socket.id, type: 'performance' };
                        socket.emit('appointment_confirmed', { message: 'Votre rendez-vous de test de conduite pour le ' + data + ' a bien été confirmé' });
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    });
                } else {
                    // Check availability for next week
                    let nextWeekAvailability = checkAvailability(currentDate, 7);
                    if (nextWeekAvailability.length > 0) {
                        // Offer available dates for next week
                        socket.emit('next_week_availability', { message: 'Il n\'y a plus de dates disponibles cette semaine. Voici ce que je peux vous proposer pour la semaine prochaine :', availability: nextWeekAvailability, toEmit: 'selected_date' });

                        socket.on('selected_date', data => {
                            // Save selected date on server
                            appointments[data] = { user: socket.id, type: 'performance' };
                            socket.emit('appointment_confirmed', { message: 'Votre rendez-vous de test de conduite pour le ' + data + ' a bien été confirmé' });
                            // Restart workflow
                            socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                        });
                    } else {
                        socket.emit('no_availability', { message: 'Désolé, Nous n\'avons pas de dates disponibles pour le moment.' });
                        // Restart workflow
                        socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
                    }
                }
            }
        });
    });
        
    socket.on('contact_info', data => {
        
        let message = 'Voulez-vous nous contacter par mail ou par téléphone ?';
        // Ask for contact info type
        socket.emit('contact_info_type_question', { message: message, buttons: [{ "value" : "email", "title" : "Par mail" }, { "value" : "phone", "title" : "Par téléphone" }], toEmit: 'contact_info_type' });
        socket.on('contact_info_type', data => {
            if (data === 'email') {
                // Send contact email
                socket.emit('contact_email', { message: 'Pour nous contacter par mail, veuillez vous adresser à motochat@examen.com' });
            } else if (data === 'phone') {
                // Send contact phone number
                socket.emit('contact_phone', { message: 'Pour nous contacter par téléphone, veuillez vous appeler le 01.23.45.67.89' });
            }
            // Restart workflow
            socket.emit('help_request_restart', { message: msgRedemarrageWorkflow, buttons: [{ "value" : "vehicle_maintenance", "title" : "Maintenance" }, { "value" : "vehicle_info", "title" : "Infos sur un véhicule" }, { "value" : "contact_info", "title" : "Infos de contact" }, { "value" : "disconnect_chatbot", "title" : "Déconnexion" }] });
        });
    });

    socket.on('disconnect_chatbot', () => {
        socket.emit('disconnected_chatbot', { message: '' });
    });
});




function initial() {
  Role.create({
    id: 1,
    name: "user",
  });
  Role.create({
    id: 2,
    name: "admin",
  });

  User.create({
    id: 1,
    username: "User",
    email: "user@email.com",
    password: bcrypt.hashSync("user", 8),
    roleId: 1,
  }).then(user => {
      user.setRoles([1])
  }).catch(err => {
    console.log(err)
});

  User.create({
    id:2,
    username: "Admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("admin", 8),
    roleId: 1,
  }).then(user => {
      user.setRoles([1])
      user.setRoles([2])
  }).catch(err => {
      console.log(err)
  })

  Salon.create({
    id: 1,
    name: "Les meilleurs moto 2022 !",
    size:20,
    statut: true,
    userId:2,
  });

  Salon.create({
    id: 2,
    name: "Les pires motos de tous les temps",
    size:5,
    statut: true,
    userId:2,
  });

  Salon.create({
    id: 3,
    name: "Combat de moto virtuel, a vos claviers !",
    size:2,
    statut: true,
    userId:2,
  });

  MessageSalon.create({
    id: 1,
    statut: true,
    content: "Salut les gars, je suis nouveau ici !",
    userId:1,
    createdAt: new Date('2023-02-01 17:27:58.72+00'),
    salonId:1,
  });

  MessageSalon.create({
    id: 2,
    statut: true,
    content: "Salut, bienvenue !",
    createdAt: new Date('2023-02-01 17:27:59.72+00'),
        userId:2,
    salonId:1,
  });

  MessageSalon.create({
    id: 3,
    statut: true,
    content: "Comment vous allez ?",
    createdAt: new Date('2023-02-01 17:28:00.72+00'),
        userId:1,
    salonId:1,
  });

  MessageSalon.create({
    id: 4,
    statut: true,
    content: "Bien et toi ?",
    createdAt: new Date('2023-02-01 17:28:58.72+00'),
        userId:2,
    salonId:1,
  });

    

}
