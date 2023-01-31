module.exports = (sequelize, Sequelize) => {
    const MessageSalon = sequelize.define("messages_salon", {
      content: {
        type: Sequelize.TEXT
      },
      statut: {
        type: Sequelize.BOOLEAN
      }
    });
    return MessageSalon;
  };