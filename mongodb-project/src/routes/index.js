const router = require("express").Router();

const userRoutes = require("./user.routes");
const roleRoutes = require("./role.routes");

router.use("/users", userRoutes);
router.use("/roles", roleRoutes);

module.exports = router;
