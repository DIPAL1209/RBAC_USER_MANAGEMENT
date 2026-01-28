module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("Address", {
    city: {
      type: DataTypes.STRING,
      allowNull: false
    }
},
  
 {
      tableName: "addresses",
      timestamps: true  
    }
);


  Address.associate = (models) => {
    
    Address.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

 
    Address.hasMany(models.Project, {
      foreignKey: "address_id",
      as: "projects"
    });
  };

  return Address;
};
