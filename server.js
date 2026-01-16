require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/sequelize");
const routes = require("./src/routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use("/uploads", express.static("uploads"));


sequelize.authenticate()
  .then(() => console.log("Sequelize connected"))
  .catch(err => console.error("Sequelize connection error:", err));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
