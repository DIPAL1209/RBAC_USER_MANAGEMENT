const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },

    
    
    profile: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [10, 15]
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
      allowNull: false,
      defaultValue: 'active'
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 50
      }
    },
    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    tableName: "users",
    timestamps: false
  }
);

module.exports = User;