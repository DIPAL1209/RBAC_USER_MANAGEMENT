const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    tableName: "roles",
    timestamps: false
  }
);

module.exports = Role;