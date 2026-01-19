module.exports = (sequelize, DataTypes) => {
  const Xyz = sequelize.define(
    "Xyz",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "xyz",
      timestamps: true,
    }
  );

  return Xyz;
};
