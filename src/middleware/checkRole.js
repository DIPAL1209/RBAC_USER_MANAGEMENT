const db = require("../config/db");
const response = require("../common/response");

module.exports = (requiredRole) => {
  return (req, res, next) => {

    const userId = req.headers.userid;   

    if (!userId) {
      return response.error(res, "User id missing in header", 401);
    }

    db.query(
      `SELECT r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
      [userId],
      (err, rows) => {
        if (err) return response.error(res, "Database error", 500);
        if (!rows.length) return response.error(res, "User not found", 404);

        if (rows[0].role_name !== requiredRole) {
          return response.error(res, "Only Admin can perform this action", 403);
        }

        next();
      }
    );
  };
};
