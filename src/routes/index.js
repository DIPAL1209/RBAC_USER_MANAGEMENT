const router = require("express").Router();

const userController = require("../controllers/user.controller");
const roleController = require("../controllers/role.controller");
const upload = require("../middleware/upload");

const validate = require("../middleware/joi.validation");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validations/user.validation");

router.post(
  "/users/:id/upload-profile",
  upload.single("profile"),
  userController.uploadProfile
);
router.delete("/users/:id/delete-profile", userController.deleteprofile);

router.post("/users", validate(createUserSchema), userController.createUser);

router.put("/users/:id", validate(updateUserSchema), userController.updateUser);

router.post("/users/:id/assign-role", userController.assignRole);

router.get("/users", userController.getUsers);
router.get("/users/list/combine", userController.combine);
router.get("/users/:id", userController.getUsersid);
router.delete("/users/:id", userController.deleteUser);

router.post("/roles", roleController.createRole);
router.put("/roles/:id", roleController.updateRole);
router.get("/roles", roleController.getRoles);

module.exports = router;
