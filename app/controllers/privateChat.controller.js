const { db, Message, User } = require("../../models");
const Op = db.Sequelize.Op;

// Enregistre un nouveau message dans la base de données
const create = async (req, res) => {
  try {
    const { content, userid } = req.body;
    const username = req.user.username;
    const newMessage = await Message.create({
      content,
      userid,
      username,
    });
    return res.status(201).json({
      message: "Message envoyé avec succès",
      newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur s'est produite lors de l'envoi du message",
    });
  }
};

// Récupère tous les messages entre deux utilisateurs
const getPrivateChat = async (req, res) => {
  try {
    const { userid } = req.params;
    const username = req.user.username;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { username: username, userid: userid },
          { username: userid, userid: username },
        ],
      },
    });
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur s'est produite lors de la récupération des messages",
    });
  }
};

// Récupère toutes les conversations privées pour un utilisateur donné
const findAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const privateChats = await PrivateChat.findAll({
      where: {
        [Sequelize.Op.or]: [{ senderId: userId }, { recipientId: userId }],
      },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "recipient" },
      ],
    });
    return res.status(200).json({ privateChats });
  } catch (error) {
    return res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des conversations privées",
    });
  }
};

// Récupère une conversation privée par identifiant
const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const privateChat = await PrivateChat.findByPk(id, {
      include: [
        { model: User, as: "sender" },
        { model: User, as: "recipient" },
      ],
    });
    if (!privateChat) {
      return res.status(404).json({
        error: `Aucune conversation privée trouvée avec l'ID ${id}`,
      });
    }
    return res.status(200).json({ privateChat });
  } catch (error) {
    return res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération de la conversation privée",
    });
  }
};

module.exports = { create, getPrivateChat, findAll, findOne };
