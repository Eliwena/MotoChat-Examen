const db = require("../models");
const Salon = db.salon;
const Op = db.Sequelize.Op;
const User = db.users;

function findAll(req, res) {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    Salon.findAll({ where: condition, include: [
        {
          model: User,
          as: 'UserCreatedSalon',
          attributes: ["id", "username"],
        },
      ],})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving salon."
        });
      });
  }


function findOne(req, res) {
    const id = req.params.id;
    Salon.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Salon with id=" + id
        });
      });
  }

function findAllActive(req, res) {
    Salon.findAll({ where: { statut: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving salon."
        });
      });
  }



module.exports = {  findAll, findOne, findAllActive};
