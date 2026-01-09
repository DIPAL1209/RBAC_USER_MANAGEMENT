const Joi = require("joi");

exports.createRoleSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Role ID must be a number",
      "number.positive": "Role ID must be positive",
      "number.integer": "Role ID must be a whole number",
      "any.required": "Role ID is required"
    }),

  role_name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "Role name must be at least 2 characters",
      "string.max": "Role name cannot exceed 50 characters",
      "string.pattern.base": "Role name can only contain letters and spaces",
      "any.required": "Role name is required"
    })
});


exports.updateRoleSchema = Joi.object({
  role_name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "Role name must be at least 2 characters",
      "string.max": "Role name cannot exceed 50 characters",
      "string.pattern.base": "Role name can only contain letters and spaces",
      "any.required": "Role name is required"
    })
});


exports.roleIdParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Role ID must be a number",
      "number.positive": "Role ID must be positive",
      "number.integer": "Role ID must be a whole number",
      "any.required": "Role ID is required"
    })
});