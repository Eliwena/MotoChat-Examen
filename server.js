// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { Client } = require('pg');
// const db = require('./queries')

// // const client = new Client({
// //   password: "root",
// //   user: "root",
// //   host: "postgres",
// // });

// const app = express();
// // app.use(cors());

// // app.use(bodyParser.json());

// // app.use(express.static('client/src'));
// // app.get('/', (req, res) => {
// //     res.json({
// //         message: 'Behold The MEVN Stack!'
// //     });
// // });

// // app.get('/messages', (req, res) => {
// //   res.json({
// //       messages: {
// //         content: 'Content',
// //         titre: 'Behold The MEVN Stack!'
// //       }
// //   });
// // });

// app.get("/users", async (req, res) => {
//   const results = await client
//     .query("SELECT * FROM users")
//     .then((payload) => {
//       return payload.rows;
//     })
//     .catch(() => {
//       throw new Error("Query failed");
//     });
//   res.setHeader("Content-Type", "application/json");
//   res.status(200);
//   res.send(JSON.stringify(results));
// });


// // Ajouter un users en bdd 
// app.post("/user", async (req, res) => {
//   const { name, email, password } = req.body;
//   const results = await client
//     .query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [
//       name,
//       email,
//       password,
//     ])
//     .then((payload) => {
//       return payload.rows;
//     })
//     .catch(() => {
//       throw new Error("Query failed");
//     });
//   res.setHeader("Content-Type", "application/json");
//   res.status(200);
//   res.send(JSON.stringify(results));
// });

// const port = process.env.PORT || 8000;
// (async () => {
//   await client.connect();

//   app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
//   });
// })();

// const myPromise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("foo");
//   }, 300);
//   reject("oops");
// });

// myPromise.then(() => {
//   console.log("hello");
// });

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors');

const db = require('./queries')
const port = 8000
app.use(bodyParser.json())
app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.get('/', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    })
})
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 300);
  reject("oops");
});

myPromise.then(() => {
  console.log("hello");
});