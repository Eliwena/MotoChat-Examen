// // @ts-check

// const express = require("express");
// const app = express();
// const port = 8000;

// // const client = new Client({
// //   password: "root",
// //   user: "root",
// //   host: "postgres",
// // });

// const server = express();

// server.user(express.static("public"));

// server.get("/", (req, res) => {
//   res.render('index', {})
//   // res.sendFile("/index.html");
// });

  
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

//server express js 

// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 8000;

// app.use(express.static('public'));

// app.get('/ya', (req, res) => {
//   res.sendFile(path.join(__dirname, '/index.html'));
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// })

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
});

app.get('/messages', (req, res) => {
  res.json({
      messages: {
        content: 'Content',
        titre: 'Behold The MEVN Stack!'
      }
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});