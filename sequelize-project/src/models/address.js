module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "addresses",
      timestamps: true,
      underscored: true,
    }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.UserProfile, {
      foreignKey: "user_profile_id",
      as: "profile",
    });
  };

  return Address;
};
