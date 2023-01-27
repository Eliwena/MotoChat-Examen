module.exports = (sequelize, Sequelize) => {
    const Salon = sequelize.define("salon", {
      name: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.INTEGER
      },
      statut: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Salon;
  };