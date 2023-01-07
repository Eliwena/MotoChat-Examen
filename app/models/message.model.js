module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("messages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      content: {
        type: Sequelize.STRING
      }
    });
  
    return Role;
  };