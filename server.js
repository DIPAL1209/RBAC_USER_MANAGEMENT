require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const models = require("./src/models");
const { sequelize } = models;


const routes = require("./src/routes");
app.use("/api", routes);

sequelize
  .authenticate()
  .catch((err) => {
    console.error(" Sequelize connection error:", err);
    process.exit(1);
  });


sequelize
  .sync()
  .catch((err) => console.error(" Sync error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
