module.exports = app => {
    const roles = require("../../controllers/admin/role.controller.js");

    var router = require("express").Router();

    
    // Retrieve all Tutorials
    router.get("/", roles.findAll);

    
    app.use('/admin/roles', router);
  };