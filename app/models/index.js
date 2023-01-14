const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.salon = require("../models/salon.model.js")(sequelize, Sequelize);
db.messageSalon = require("../models/messageSalon.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.users, {
  through: "user_roles",
  foreignKey: "roleId",
  as: "users",
});
db.users.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  as: "roles",
});


db.salon.belongsToMany(db.users, {
  through: "users_salons",
  foreignKey: "salonId",
});

db.users.belongsToMany(db.salon, {
  through: "users_salons",
  foreignKey: "userId",
});

db.users.hasMany(db.messageSalon, {
  foreignKey: "userId",
  });

db.messageSalon.belongsTo(db.users);

db.users.hasMany(db.salon,{
  as : "SalonCreatedBy",
});

db.salon.belongsTo(db.users,{foreignKey: "userId",as: "UserCreatedSalon"});


db.salon.hasMany(db.messageSalon, {
  foreignKey: "salonId",
  });

db.messageSalon.belongsTo(db.salon);



db.ROLES = ["user", "admin"];


module.exports = db;
