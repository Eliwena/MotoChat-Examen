// import { db } from "../models";
const { role } = require("../models");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const Role = db.role;


function create(req, res) {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    statut: false
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}


// Retrieve all user from the database.
function findAll(req, res) {
  const username = req.query.username;
  var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;
  User.findAll({
    where: condition, include: [
      {
        model: Role,
        as: "roles",
        attributes: ["id", "name", "createdAt", "updatedAt"],
        through: {
          attributes: [],
        }
      },
    ],
  })
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
  const id = req.params.id;

  User.findByPk(id, {
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["id", "name", "createdAt", "updatedAt"],
        through: {
          attributes: [],
        }
      },
    ],
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
}

// Update a user by the id in the request
function update(req, res) {
  const id = req.params.id;

  User.update(req.body, {
    where: {
      id: id
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        err,
        message: "Error updating User with id=" + id
      });
    });
}

function _delete(req, res) {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        addRole(req, res)
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};


function findAllActive(req, res) {
  User.findAll({ where: { statut: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

function addRole(req, res) {
  const id = req.params.id;
  const rolesName = [];
  
  req.body.forEach(element =>{
    rolesName.push(element.name)
  });
  // res.send(rolesName)
  User.findByPk(id)
    .then(user => {
      if (user) {
        if (req.body) {
          Role.findAll({
            where: {
              name: {
                [Op.or]: rolesName
              }
            }
          }).then(roles => {
            // res.send(roles)
            user.setRoles(roles).then(() => {
              res.send({ message: "User was registered successfully! One" });
            });
          });
        } else {
          // user role = 1
          user.setRoles([1]).then(() => {
            res.send({ message: "User was registered successfully! Two" });
          });
        }
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
}


module.exports = { create, findAll, findOne, update, _delete, findAllActive, addRole };

