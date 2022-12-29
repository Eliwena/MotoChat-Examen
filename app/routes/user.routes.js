module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    
    // Retrieve all Tutorials
    router.get("/", users.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", users.findOne);

    // Update a Tutorial with id
    router.put("/:id", users.update);

    // Delete a Tutorial with id
    router.delete("/:id", users._delete);

    // Create a new Tutorial
    // router.delete("/", users.deleteAll);

    app.use('/admin/users', router);
  };

