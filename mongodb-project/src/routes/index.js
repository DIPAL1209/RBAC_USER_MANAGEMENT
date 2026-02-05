const express = require("express");
const router = express.Router();

router.use("/users", require("./user.routes"));
router.use("/employments", require("./employ.routes"));
router.use("/projects", require("./project.routes"));
router.use("/roles", require("./role.routes"));

module.exports = router;
