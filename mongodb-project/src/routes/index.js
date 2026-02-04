const router = require("express").Router();

const userRoutes = require("./user.routes");
const roleRoutes = require("./role.routes");
const employRoutes = require("./employ.routes");   
const projectRoutes = require("./project.routes"); 

router.use("/users", userRoutes);
router.use("/roles", roleRoutes);


router.use("/users", employRoutes);
router.use("/projects", projectRoutes);

module.exports = router;
