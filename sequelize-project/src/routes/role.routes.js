const router = require("express").Router();

const roleController = require("../controllers/role.controller");
const validate = require("../middleware/joi.validation");

const {createRoleSchema,updateRoleSchema,roleIdParamSchema} = require("../validations/role.validation");

router.post("/", validate(createRoleSchema, "body"), roleController.createRole);

router.get("/", roleController.getRoles);

router.get("/:id",validate(roleIdParamSchema, "params"),roleController.getRoleById,);

router.put("/:id",validate(roleIdParamSchema, "params"),validate(updateRoleSchema, "body"),roleController.updateRole,);

router.delete("/:id",validate(roleIdParamSchema, "params"),roleController.deleteRole,);

module.exports = router;
