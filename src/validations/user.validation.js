const Joi = require("joi");

exports.createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  email: Joi.string().email().max(120).required(),
  role_id: Joi.number().integer().positive().required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .required(),

  salary: Joi.number()
    .min(0)
    .optional(),

  joining_date: Joi.date().required(),

  experience_years: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
});

exports.updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),

  email: Joi.string().email().max(120).optional(),

  role_id: Joi.number().integer().positive().optional(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .optional(),

  salary: Joi.number().min(0).optional(),

  joining_date: Joi.date().optional(),

  experience_years: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
}).min(1);
