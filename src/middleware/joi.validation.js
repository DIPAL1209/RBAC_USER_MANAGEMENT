const response = require("../common/response");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      return response.error(res, message, 400);
    }

    req[property] = value; 
    next();
  };
};

module.exports = validate;
