module.exports = app => {
  const privateChat = require("../controllers/privateChat.controller.js");
  var router = require("express").Router();

  // Create a new PrivateChat
  router.post("/", privateChat.create);

  // Retrieve all PrivateChats
  router.get("/", privateChat.findAll);

  // Retrieve a single PrivateChat with id
  router.get("/:id", privateChat.findOne);

  // // Update a PrivateChat with id
  // router.put("/:id", privateChat.update);

  // // Delete a PrivateChat with id
  // router.delete("/:id", privateChat._delete);
  app.use("/privateChat", router);
};
