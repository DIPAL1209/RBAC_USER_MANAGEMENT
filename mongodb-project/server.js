const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const routes = require("./src/routes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", require("./src/routes"));


app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
