const { authJwt } = require("../middleware");
const controller = require("../controllers/userAcces.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/moto/all", controller.allAccess);

  app.get(
    "/moto/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/moto/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
