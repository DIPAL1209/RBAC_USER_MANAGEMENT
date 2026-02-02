const { User, Role } = require("../models");
const response = require("../common/response");

module.exports = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.headers.userid;

      if (!userId) {
        return response.error(res, "User id missing in header", 401);
      }

      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          as: "role",
          attributes: ["role_name"],
        },
      });

      if (!user) {
        return response.error(res, "User not found", 404);
      }

      if (user.role.role_name !== requiredRole) {
        return response.error(res, "Only Admin can perform this action", 403);
      }

      next();
    } catch (error) {
      return response.error(res, "Database error", 500);
    }
  };
};
