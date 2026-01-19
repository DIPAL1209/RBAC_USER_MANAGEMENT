const Joi = require("joi");

exports.createUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
      "string.pattern.base": "Name can only contain letters and spaces",
      "any.required": "Name is required"
    }),

  email: Joi.string()
    .email()
    .max(120)
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email cannot exceed 120 characters",
      "any.required": "Email is required"
    }),

  role_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Role ID must be a number",
      "number.positive": "Role ID must be positive",
      "any.required": "Role ID is required"
    }),

  phone: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Phone must be a valid 10-digit Indian mobile number (starting with 6-9)"
    }),

  status: Joi.string()
    .valid("active", "inactive")
    .default("active")
    .required()
    .messages({
      "any.only": "Status must be either 'active' or 'inactive'",
      "any.required": "Status is required"
    }),

  salary: Joi.number()
    .min(0)
    .max(10000000)
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      "number.min": "Salary cannot be negative",
      "number.max": "Salary cannot exceed 1 crore"
    }),

  joining_date: Joi.date()
    .max("now")
    .required()
    .messages({
      "date.max": "Joining date cannot be in the future",
      "any.required": "Joining date is required"
    }),

  experience_years: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
    .allow(null)
    .messages({
      "number.min": "Experience cannot be negative",
      "number.max": "Experience cannot exceed 50 years",
      "number.integer": "Experience must be a whole number"
    })
});


exports.updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
      "string.pattern.base": "Name can only contain letters and spaces"
    }),

  email: Joi.string()
    .email()
    .max(120)
    .lowercase()
    .trim()
    .optional()
    .messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email cannot exceed 120 characters"
    }),

  role_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "Role ID must be a number",
      "number.positive": "Role ID must be positive"
    }),

  phone: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Phone must be a valid 10-digit Indian mobile number (starting with 6-9)"
    }),

  status: Joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "any.only": "Status must be either 'active' or 'inactive'"
    }),

  salary: Joi.number()
    .min(0)
    .max(10000000)
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      "number.min": "Salary cannot be negative",
      "number.max": "Salary cannot exceed 1 crore"
    }),

  joining_date: Joi.date()
    .max("now")
    .optional()
    .messages({
      "date.max": "Joining date cannot be in the future"
    }),

  experience_years: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
    .allow(null)
    .messages({
      "number.min": "Experience cannot be negative",
      "number.max": "Experience cannot exceed 50 years",
      "number.integer": "Experience must be a whole number"
    })
}).min(1).messages({
  "object.min": "At least one field must be provided for update"
});

exports.assignRoleSchema = Joi.object({
  role_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Role ID must be a number",
      "number.positive": "Role ID must be positive",
      "any.required": "Role ID is required"
    })
});


exports.userIdParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "User ID must be a number",
      "number.positive": "User ID must be positive",
      "any.required": "User ID is required"
    })
});


exports.searchFilterSchema = Joi.object({
  search: Joi.string()
    .trim()
    .max(100)
    .optional()
    .default("")
    .messages({
      "string.max": "Search query cannot exceed 100 characters"
    }),

  sortBy: Joi.string()
    .valid("id", "u.name", "u.email", "u.salary", "u.joining_date", "u.experience_years", "u.status")
    .optional()
    .default("id")
    .messages({
      "any.only": "Invalid sort field. Allowed: id, name, email, salary, joining_date, experience_years, status"
    }),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .optional()
    .default("asc")
    .messages({
      "any.only": "Sort order must be 'asc' or 'desc'"
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      "number.min": "Page must be at least 1",
      "number.base": "Page must be a number"
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(5)
    .messages({
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100",
      "number.base": "Limit must be a number"
    })
});