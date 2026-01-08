require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
