const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const { role } = require("./app/models");
const Role = db.role;
const User = db.users;
const app = express();

var corsOptions = {
  origin: "http://localhost:8080",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({alter: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./app/routes/auth.routes')(app);
require("./app/routes/userAcces.routes")(app);
require("./app/routes/user.routes")(app);

// app.get("/:universalURL", (req, res) => {
//   res.send("404 URL NOT FOUND");
// });


// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
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