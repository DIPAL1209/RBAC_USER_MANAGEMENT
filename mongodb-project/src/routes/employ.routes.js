const express = require("express");
const router = express.Router();

const controller = require("../controllers/employ.controller");


router.post("/:userId/employments", controller.createEmployment);

router.get("/", controller.getEmployments);

module.exports = router;
