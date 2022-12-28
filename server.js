// const express = require('express')
// const bodyParser = require('body-parser')
// const app = express()
// const cors = require('cors');

// const db = require('./queries')
// const port = 8000
// app.use(bodyParser.json())
// app.use(cors());

// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// )
// app.get('/', (request, response) => {
//     response.json({
//         info: 'Node.js, Express, and Postgres API'
//     })
// })
// app.get('/users', db.getUsers)
// app.get('/users/:id', db.getUserById)
// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)
// app.listen(port, () => {
//     console.log(`App running on port ${port}.`)
// })

// const myPromise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("foo");
//   }, 300);
//   reject("oops");
// });

// myPromise.then(() => {
//   console.log("hello");
// });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const app = express();

var corsOptions = {
  origin: "http://localhost:8080",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
  
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/user.routes")(app);

// app.get("/:universalURL", (req, res) => {
//   res.send("404 URL NOT FOUND");
// });


// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

