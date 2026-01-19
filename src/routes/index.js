const router = require("express").Router();
const checkRole = require("../middleware/checkRole");
const userController = require("../controllers/user.controller");
const roleController = require("../controllers/role.controller");

const upload = require("../middleware/upload");
const validate = require("../middleware/joi.validation");


const {
  createUserSchema,
  updateUserSchema,
  assignRoleSchema,
  userIdParamSchema,
  searchFilterSchema,
} = require("../validations/user.validation");

const {
  createRoleSchema,
  updateRoleSchema,
  roleIdParamSchema,
} = require("../validations/role.validation");

router.post(
  "/users",
  validate(createUserSchema, "body"),
  userController.createUser
);

router.get("/users", userController.getUsers);

router.get(
  "/users/list/combine",
  validate(searchFilterSchema, "query"),
  userController.combine
);

router.get(
  "/users/:id",
  validate(userIdParamSchema, "params"),
  userController.getUsersid
);
router.put(
  "/users/:id",
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema, "body"),
  userController.updateUser
);

// router.delete(
//   "/users/:id",
//   validate(userIdParamSchema, "params"),
//   userController.deleteUser
// );



router.delete(
  "/users/:id",
  validate(userIdParamSchema, "params"),
  checkRole("Admin"),
  userController.deleteUser
);


router.post(
  "/users/:id/assign-role",
  validate(userIdParamSchema, "params"),
  validate(assignRoleSchema, "body"),
  userController.assignRole
);

router.post(
  "/users/:id/upload-profile",
  validate(userIdParamSchema, "params"),
  upload.single("profile"),
  (err, req, res, next) => {
    return response.error(res, err.message, 400);
  },
  userController.uploadProfile
);

router.post(
  "/users/:id/upload-gallery",
  upload.array("images", 10),
  userController.uploadGallery
);

// router.post(
//   "/test-upload",
//   upload.fields([
//     { name: "profile", maxCount: 1 },
//     { name: "documents", maxCount: 3 }
//   ]),
//   userController.testUpload
// );


// router.post("/test-no-file", upload.none(), (req, res) => {
//   return response.success(res, "Only form data received", req.body);
// });



router.get(
  "/users/:id/profile",
  validate(userIdParamSchema, "params"),
  userController.getProfile
);

router.delete(
  "/users/:id/delete-profile",
  validate(userIdParamSchema, "params"),
  userController.deleteprofile
);

router.post(
  "/roles",
  validate(createRoleSchema, "body"),
  roleController.createRole
);

router.get("/roles", roleController.getRoles);

router.get(
  "/roles/:id",
  validate(roleIdParamSchema, "params"),
  roleController.getRoleById
);

router.put(
  "/roles/:id",
  validate(roleIdParamSchema, "params"),
  validate(updateRoleSchema, "body"),
  roleController.updateRole
);

router.delete(
  "/roles/:id",
  validate(roleIdParamSchema, "params"),
  roleController.deleteRole
);


module.exports = router;
