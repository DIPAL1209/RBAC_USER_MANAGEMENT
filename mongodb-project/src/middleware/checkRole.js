const mongoose = require("mongoose");
const User  = require("../models/user");
const response = require("../common/response");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.headers.userid;

      if (!userId) {
        return response.error(res, "User id missing in header", 401);
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response.error(res, "Invalid user id in header", 400);
      }

      const user = await User.findById(userId).populate("role");

      if (!user) {
        return response.error(res, "User not found", 404);
      }

      if (!user.role || !allowedRoles.includes(user.role.role_name)) {
        return response.error(
          res,
          "Only Admin or Main Admin can perform this action",
          403
        );
      }

      next();
    } catch (error) {
      console.error("ROLE CHECK ERROR", error.message);
      return response.error(res, error.message, 500);
    }
  };
};
