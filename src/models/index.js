const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

const models = {};


models.Role = require("./role")(sequelize, DataTypes);
models.User = require("./user")(sequelize, DataTypes);
models.UserProfile = require("./userProfile")(sequelize, DataTypes);
models.Address = require("./address")(sequelize, DataTypes);


Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
