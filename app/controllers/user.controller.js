// import { db } from "../models";
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new user
 function create(req, res) {
  
}

// Retrieve all user from the database.
 function findAll(req, res) {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    User.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
}

// Find a single user with an id
 function findOne(req, res) {
  
}

// Update a user by the id in the request
 function update(req, res) {
  
}

// Delete a user with the specified id in the request
// const _delete = (req, res) => {
// };
//  { _delete as delete };

// Delete all user from the database.
 function deleteAll(req, res) {
  
}


module.exports = { create, findAll, findOne, update, deleteAll };

