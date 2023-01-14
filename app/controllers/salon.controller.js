const db = require("../models");
const Salon = db.salon;
const Op = db.Sequelize.Op;
const User = db.users;

function create(req,res){
    // const user = User.findOne({where : {id : req.body.createdBy}})
    // console.lsog(user)
    const salon = {
        name: req.body.name,
        size: req.body.size,
        statut : req.body.statut,
        userId : req.body.createdBy
    }
    Salon.create(salon)
    .then(data => {
        //ajout du user dans la table salon et la colonne createdBy
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Salon."
        });
    });
}

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

function update(req, res) {
    const id = req.params.id;
    Salon.update(req.body, {
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Salon was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Salon with id=${id}. Maybe Salon was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Salon with id=" + id
            });
        });
}

function _delete(req, res) {
    const id = req.params.id;
    Salon.destroy({
        where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Salon was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Salon with id=${id}. Maybe Salon was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Salon with id=" + id
            });
        });
}


module.exports = {  findAll, create , update, findOne, _delete};
