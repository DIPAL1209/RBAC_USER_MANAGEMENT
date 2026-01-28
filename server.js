require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const routes = require("./src/routes/index");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const User = require("./src/models/user")(sequelize, DataTypes);
const Role = require("./src/models/role")(sequelize, DataTypes);
const Address = require("./src/models/address")(sequelize, DataTypes);
const Project = require("./src/models/project")(sequelize, DataTypes);

const models = {
  User,
  Role,
  Address,
  Project,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

app.use("/api", routes);

sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected"))
  .catch((err) => console.error("Sequelize connection error:", err));

sequelize
  .sync() 
  .catch((err) => console.error("Sync error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
