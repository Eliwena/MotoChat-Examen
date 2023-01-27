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

io.on("connection", (socket) => {
  console.log("New client connected");
  // var loggedUser;
  // console.log('log:'+loggedUser)

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // if (loggedUser !== undefined) {
    //   console.log('user disconnected : ' + loggedUser.username);
    //   var serviceMessage = {
    //     text: 'User "' + loggedUser.username + '" disconnected',
    //     type: 'logout'
    //   };
    //   socket.broadcast.emit('service-message', serviceMessage);
    // }
  });

  socket.on("JOIN", (data) => {
    socket.join(data.salon.name);
    // loggedUser = data.user.username;
    // var serviceMessage = {
    //   text: loggedUser + '" c\'est connecté',
    //   type: 'login'
    // };
    // io.in(data.salon.name).emit('SERVICE_MESSAGE', serviceMessage);
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
        // Will escape title and validate DESC against a list of valid direction parameters
        ['createdAt', 'ASC'],
      ]
    }).then((messages) => {
      io.in(data.salon.name).emit('INIT_MESSAGES', messages)
    }).catch(err => {
      console.log(err)
      }
    );
  })

  socket.on('TYPING', (data) => {
    io.in(data.salon.name).emit('TYPING', data)
  })

  socket.on("LEAVE", (salon) => {
    socket.leave(salon);
  })

  socket.on('SEND_MESSAGE', (data) =>{
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