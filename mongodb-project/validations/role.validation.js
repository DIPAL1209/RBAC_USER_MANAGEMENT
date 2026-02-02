
const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

exports.createRoleSchema = Joi.object({
  role_name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
});

exports.updateRoleSchema = Joi.object({
  role_name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
});

exports.roleIdParamSchema = Joi.object({
  id: objectId.required().messages({
    "string.pattern.base": "Invalid Role ID"
  })
});
