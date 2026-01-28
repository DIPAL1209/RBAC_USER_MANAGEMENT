module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profile: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      experience_years: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

 User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "role"
    });

    User.hasMany(models.Address, {
      foreignKey: "user_id",
      as: "addresses"
    });
  };

  return User;
};
