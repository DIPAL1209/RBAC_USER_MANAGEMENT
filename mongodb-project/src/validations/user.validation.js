const Joi = require("joi");
const objectId = Joi.string().length(24).hex();

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
      "any.required": "Name is required",
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
      "any.required": "Email is required",
    }),

  role: objectId
    .required()
    .messages({
      "string.length": "Role ID must be a valid ObjectId",
      "any.required": "Role is required",
    }),

  status: Joi.string()
    .valid("active", "inactive")
    .default("active")
    .required(),

  phone: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Phone must be a valid 10-digit Indian mobile number",
    }),

  salary: Joi.number()
    .min(0)
    .max(10000000)
    .precision(2)
    .optional()
    .allow(null),

  joining_date: Joi.date()
    .max("now")
    .required()
    .messages({
      "date.max": "Joining date cannot be in the future",
      "any.required": "Joining date is required",
    }),

  experience_years: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
    .allow(null),

  addresses: Joi.array()
    .items(
      Joi.object({
        city: Joi.string()
          .min(2)
          .max(255)
          .trim()
          .required()
          .messages({
            "any.required": "City is required in address",
          }),
      })
    )
    .optional(),
});

exports.updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .optional(),

  email: Joi.string()
    .email()
    .max(120)
    .lowercase()
    .trim()
    .optional(),

  role: objectId.optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .optional(),

  phone: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .optional()
    .allow(null, ""),

  salary: Joi.number()
    .min(0)
    .max(10000000)
    .precision(2)
    .optional()
    .allow(null),

  joining_date: Joi.date()
    .max("now")
    .optional(),

  experience_years: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional()
    .allow(null),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

exports.assignRoleSchema = Joi.object({
  role: objectId
    .required()
    .messages({
      "string.length": "Role ID must be a valid ObjectId",
      "any.required": "Role ID is required",
    }),
});

exports.userIdParamSchema = Joi.object({
  id: objectId.required().messages({
    "string.length": "User ID must be a valid ObjectId",
    "any.required": "User ID is required",
  }),
});

exports.searchFilterSchema = Joi.object({
  search: Joi.string().trim().max(100).optional().default(""),

  sortBy: Joi.string()
    .valid(
      "name",
      "email",
      "salary",
      "joining_date",
      "experience_years",
      "status",
      "createdAt",
      "updatedAt"
    )
    .optional()
    .default("createdAt"),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .optional()
    .default("desc"),

  page: Joi.number().integer().min(1).optional().default(1),

  limit: Joi.number().integer().min(1).max(100).optional().default(5),

  date: Joi.string().optional(),
});

exports.getAllUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid("active", "inactive").optional(),
  sortBy: Joi.string().valid("name", "email", "createdAt", "updatedAt").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
});

exports.createEmploymentSchema = Joi.object({
  user: objectId.required(),
  company_name: Joi.string().required(),
  department: Joi.string().required(),
  employment_type: Joi.string()
    .valid("full-time", "part-time", "internship", "contract")
    .required(),
});


exports.createProjectSchema = Joi.object({
  employment: objectId.required(),
  project_name: Joi.string().required(),
  client_name: Joi.string().optional(),
  technologies: Joi.array().items(Joi.string()).min(1).required(),
});