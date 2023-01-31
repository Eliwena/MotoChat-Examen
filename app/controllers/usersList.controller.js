const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Retrieve all user from the database.
function findAllByUsername(req, res) {
  const username = req.query.username;
  var condition = username
    ? { username: { [Op.iLike]: `%${username}%` } }
    : null;
  User.findAll({
    where: condition,
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["id", "name", "createdAt", "updatedAt"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
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
        },
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
}

function findAllActive(req, res) {
  User.findAll({ where: { statut: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
}

const findAll = async (req, res) => {
  const users = await User.findAll({
    where: {
      id: {
        [Op.ne]: req.userId,
      },
    },
  });
  return res.status(200).json(users);
};

module.exports = { findAll, findOne, findAllActive };
