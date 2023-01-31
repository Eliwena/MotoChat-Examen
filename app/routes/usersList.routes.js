module.exports = (app) => {
  const users = require("../controllers/usersList.controller.js");
  const { authJwt } = require("../middleware");

  var router = require("express").Router();

  // Retrieve all Tutorials
  router.get("/", authJwt.verifyToken, users.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", users.findOne);

  // Retrieve all active users
  router.get("/active", users.findAllActive);

  app.use("/users", router);
};
