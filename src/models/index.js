const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");


const models = {};


models.Role = require("./role")(sequelize, DataTypes);
models.User = require("./user")(sequelize, DataTypes);
models.Xyz  = require("./xyz")(sequelize, DataTypes);
models.Address = require("./address")(sequelize, DataTypes);
models.Project = require("./project")(sequelize, DataTypes);




Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});


models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
