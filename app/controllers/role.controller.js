const db = require("../models");
const Role = db.role;
const Op = db.Sequelize.Op;
const User = db.users;

function findAll(req, res) {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    Role.findAll({ where: condition} )
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving role."
        });
      });
  }

module.exports = {  findAll };
