const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;
const app = express();
const MessageSalon = db.messageSalon;
const User = db.users;
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

// app.get("/:universalURL", (req, res) => {
//   res.send("404 URL NOT FOUND");
// });


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
    loggedUser = data.user.username;
    var serviceMessage = {
      message: loggedUser + ' c\'est deconnecté',
      type: 'logout'
    };
    //recupérer le salon de l'utilisateu dans le socket 
    socket.broadcast.in(socket.rooms).emit('SERVICE_MESSAGE', serviceMessage);
    //--------------Recuperation du nombre utilisateurs connectés------------------
    let existingRoom = countUser.find(salon => salon.name === socket.salons);
    if(existingRoom){
      var index = existingRoom.users.indexOf(data.user.username);
      if (index > -1) {
        existingRoom.users.splice(index, 1);
      }
    }
    io.in(socket.salons).emit('COUNT_USER', { countUser })
    //--------------Leave un salon------------------
    socket.leave(socket.salons);
    console.log('disconnect user : ' + data.user.username)
    setTimeout(() => socket.disconnect(true), 5000);
  })
  
    socket.on('COUNT_USER_INIT',()=>{
      console.log(countUser)
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