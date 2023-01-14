module.exports = app => {
    const salon = require("../controllers/salon.controller.js");

    var router = require("express").Router();

    // Create a new Salon
    router.post("/", salon.create);
    
    // Retrieve all Salons
    router.get("/", salon.findAll);

    // Retrieve a single Salon with id
    router.get("/:id", salon.findOne);

    // Update a Salon with id
    router.put("/:id", salon.update);

    // Delete a Salon with id
    router.delete("/:id", salon._delete);

    app.use('/admin/salon', router);
  };