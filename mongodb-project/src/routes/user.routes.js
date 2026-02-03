const router = require("express").Router();

const userController = require("../controllers/user.controller");
const checkRole = require("../middleware/checkRole");
const upload = require("../middleware/upload");
const validate = require("../middleware/joi.validation");

const {
  createUserSchema,
  updateUserSchema,
  assignRoleSchema,
  userIdParamSchema,
  searchFilterSchema,
  getAllUsersSchema,
} = require("../validations/user.validation");

router.post(
  "/",
  validate(createUserSchema, "body"),
  userController.createUser
);


router.get("/", userController.getUsers);

// router.get(
//   "/list/combine",
//   validate(searchFilterSchema, "query"),
//   userController.combine
// );


router.get(
  "/:id/full",
  validate(userIdParamSchema, "params"),
  userController.getUserFullProfile
);

router.get(
  "/:id",
  validate(userIdParamSchema, "params"),
  userController.getUsersid
);

router.put(
  "/:id",
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema, "body"),
  userController.updateUser
);

router.delete(
  "/:id",
  validate(userIdParamSchema, "params"),
  checkRole(["Admin", "Main Admin"]),
  userController.deleteUser
);

router.post(
  "/:id/assign-role",
  validate(userIdParamSchema, "params"),
  validate(assignRoleSchema, "body"),
  userController.assignRole
);

router.post(
  "/:id/upload-profile",
  validate(userIdParamSchema, "params"),
  upload.single("profile"),
  userController.uploadProfile
);

router.get(
  "/:id/profile",
  validate(userIdParamSchema, "params"),
  userController.getProfile
);

router.delete(
  "/:id/delete-profile",
  validate(userIdParamSchema, "params"),
  userController.deleteprofile
);

router.get(
  "/all",
  validate(getAllUsersSchema, "query"),
  userController.getAllusers
);

module.exports = router;
