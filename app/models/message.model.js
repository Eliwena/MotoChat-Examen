module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("messages", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    content: {
      type: Sequelize.STRING,
    },
    userid: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    username: {
      type: Sequelize.STRING,
    },
    senderId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    recipientId: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.user, {
      as: "sender",
      foreignKey: "senderId",
    });
    Message.belongsTo(models.user, {
      as: "recipient",
      foreignKey: "recipientId",
    });
  };

  return Message;
};
