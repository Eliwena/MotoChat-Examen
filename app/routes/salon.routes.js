module.exports = app => {
    const salon = require("../controllers/salon.controller.js");

    var router = require("express").Router();
    
    // Retrieve all Salons
    router.get("/", salon.findAll);

    router.get("/active", salon.findAllActive);

    // Retrieve a single Salon with id
    router.get("/:id", salon.findOne);


    app.use('/salon', router);
  };