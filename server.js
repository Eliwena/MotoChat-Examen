const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;
const app = express();
const MessageSalon = db.messageSalon;
const User = db.users;
// const SSEClient = require('./app/SSE/SSEClient');
const SSEManager = require('./app/SSE/SSEManager');

var corsOptions = {
  // origin: "http://localhost:8080/",
  AccessControlAllowOrigin: '*'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({ alter: true }).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
  res.sendFile(__dirname + '/index.html');
});

require('./app/routes/auth.routes')(app);
require("./app/routes/userAcces.routes")(app);
require("./app/routes/admin/user.routes")(app);
require("./app/routes/admin/role.routes")(app);
require("./app/routes/admin/salon.routes")(app);
require("./app/routes/salon.routes")(app);
require("./app/routes/privateChat.routes")(app);
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
    methods: ["GET", "POST"]
  }
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
      message: loggedUser + ' c\'est connecté',
      type: 'login'
    };
    socket.broadcast.in(data.salon.name).emit('SERVICE_MESSAGE', serviceMessage);
    //--------------Recuperation des messages du salon------------------
    MessageSalon.findAll({
      where: {
        salonId: data.salon.id
      },
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ],
      order: [
        ['createdAt', 'ASC'],
      ]
    }).then((messages) => {
      io.in(data.salon.name).emit('INIT_MESSAGES', messages)
    }).catch(err => {
      console.log(err)
    }
    );
    //--------------Recuperation du nombre utilisateurs connectés------------------
    let existingRoom = countUser.find(salon => salon.name === data.salon.name);
    if (existingRoom) {
      existingRoom.users.push(data.user.username);
    } else {
      countUser.push({ name: data.salon.name, users: [data.user.username] });
    }   
    io.in(socket.salons).emit('COUNT_USER', { countUser })
  })

  //-----------------Typing------------------
  socket.on('TYPING', (data) => {
    io.in(data.salon.name).emit('TYPING', data)
  })

  //-----------------Gestion de déconnexion------------------
  socket.on("LEAVE", (data) => {
    loggedUser = data.user.username;
    var serviceMessage = {
      message: loggedUser + ' c\'est deconnecté',
      type: 'logout'
    };
    socket.broadcast.in(socket.salons).emit('SERVICE_MESSAGE', serviceMessage);

    //--------------Recuperation du nombre utilisateurs connectés------------------
    let existingRoom = countUser.find(salon => salon.name === data.salon);
    if(existingRoom){
      var index = existingRoom.users.indexOf(data.user.username);
      if (index > -1) {
        existingRoom.users.splice(index, 1);
      }
    }
    io.in(socket.salons).emit('COUNT_USER', { countUser })
    //--------------Leave un salon------------------
    socket.leave(socket.salons);
  })

  //-----------------Envoi de message------------------
  socket.on('SEND_MESSAGE', (data) => {
    MessageSalon.create({
      content: data.message,
      salonId: data.salon.id,
      statut: true,
      userId: data.user.id,
    }).then(() => {
      io.in(data.salon.name).emit('MESSAGE', data)
    }).catch(err => {
      console.log(err)
    });
  });

  //------------------Deconnexion------------------
  socket.on('DISCONNECT_USER', (data) => {
    if(data.salon){
    loggedUser = data.user.username;
    var serviceMessage = {
      message: loggedUser + ' c\'est deconnecté',
      type: 'logout'
    };
    //recupérer le salon de l'utilisateu dans le socket 
    socket.in(data.salon.name).emit('SERVICE_MESSAGE', serviceMessage);
    //--------------Recuperation du nombre utilisateurs connectés------------------
    let existingRoom = countUser.find(salon => salon.name === socket.salons);
    if(existingRoom){
      var index = existingRoom.users.indexOf(data.user.username);
      if (index > -1) {
        existingRoom.users.splice(index, 1);
      }
    }
    io.in(data.salon.name).emit('COUNT_USER', { countUser })
    io.emit('COUNT_USER_INIT', { countUser })
    //--------------Leave un salon------------------
    socket.leave(data.salon.name);
  }
    console.log('disconnect user : ' + data.user.username)
    setTimeout(() => socket.disconnect(true), 5000);
  })

  //------------------Initialisation du nombre d'utilisateurs connectés------------------
    socket.on('COUNT_USER_INIT',()=>{
      io.emit('COUNT_USER_INIT', { countUser })
    })

});





function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  Role.create({
    id: 2,
    name: "admin"
  });
}