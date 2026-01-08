
const db = require("../config/db");
const response = require("../common/response");

exports.createRole = (req, res) => {
  const { id, role_name } = req.body;

  if (!id || !role_name) {
    return response.error(res, "id and role_name are required", 400);
  }

      db.query(
        "INSERT INTO roles (id, role_name) VALUES (?, ?)",
        [id, role_name],
        (err2) => {
          if (err2) return response.error(res, "Database error", 500);

          return response.success(
            res,
            "Role created successfully",
            { id, role_name },
            201
          );
        }
      );
    };
  


exports.getRoles = (req, res) => {
  db.query("SELECT * FROM roles", (err, rows) => {
    if (err) return response.error(res, "Database error", 500);

    return response.success(res, "Roles fetched successfully", rows);
  });
};

exports.updateRole = (req, res) => {
  const roleId = req.params.id;
  const { role_name } = req.body;

  if (!role_name) {
    return response.error(res, "role_name is required", 400);
  }

  db.query(
    "UPDATE roles SET role_name = ? WHERE id = ?",
    [role_name, roleId],
    (err, result) => {
      if (err) return response.error(res, "Database error", 500);

      if (result.affectedRows === 0) {
        return response.error(res, "Role not found", 404);
      }
      return response.success(res, "Role updated successfully");
    }
  );
};