module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  });


  Project.associate = (models) => {
    Project.belongsTo(models.Address, {
      foreignKey: "address_id",
      as: "address"
    });
  };

  return Project;
};
