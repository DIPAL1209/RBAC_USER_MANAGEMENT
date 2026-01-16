const User = require("./user");
const Role = require("./role");

User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role"
});

Role.hasMany(User, {
  foreignKey: "role_id",
  as: "users"
});

module.exports = { User, Role };