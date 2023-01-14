module.exports = app => {
    const roles = require("../controllers/role.controller.js");

    var router = require("express").Router();

    
    // Retrieve all Tutorials
    router.get("/", roles.findAll);

    
    app.use('/admin/roles', router);
  };