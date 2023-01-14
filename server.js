const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;
const app = express();

var corsOptions = {
  // origin: "http://localhost:8080/",
  // AccessControlAllowOrigin : 'origin'
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
require("./app/routes/admin/user.routes")(app);
require("./app/routes/admin/role.routes")(app);
require("./app/routes/admin/salon.routes")(app);
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