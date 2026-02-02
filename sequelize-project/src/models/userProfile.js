module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      profile_image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "user_profiles",
      timestamps: true,
      underscored: true,
    }
  );

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    UserProfile.hasMany(models.Address, {
      foreignKey: "user_profile_id",
      as: "addresses",
    });
  };

  return UserProfile;

};
