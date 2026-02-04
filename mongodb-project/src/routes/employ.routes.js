const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
router.post("/:userId/employments", controller.createEmployment);


module.exports = router;
