const db = require("../config/db");
const response = require("../common/response");

exports.createRole = async (req, res) => {

  const { id, role_name } = req.body;

  db.query("SELECT id FROM roles WHERE id = ?", [id], (err, idRows) => {
    if (err) return response.error(res, "Database error", 500);

    if (idRows.length > 0) {
      return response.error(res, "Role ID already exists", 409);
    }

    db.query(
      "SELECT role_name FROM roles WHERE role_name = ?",
      [role_name],
      (err2, nameRows) => {
        if (err2) return response.error(res, "Database error", 500);

        if (nameRows.length > 0) {
          return response.error(res, "Role name already exists", 409);
        }

        db.query(
          "INSERT INTO roles (id, role_name) VALUES (?, ?)",
          [id, role_name],
          (err3) => {
            if (err3) return response.error(res, "Database error", 500);

            return response.success(
              res,
              "Role created successfully",
              { id, role_name },
              201
            );
          }
        );
      }
    );
  });
};

exports.getRoles = (req, res) => {
  db.query("SELECT * FROM roles ORDER BY id ASC", (err, rows) => {
    if (err) return response.error(res, "Database error", 500);

    return response.success(res, "Roles fetched successfully", rows);
  });
};

exports.getRoleById = (req, res) => {
  const roleId = req.params.id;

  db.query("SELECT * FROM roles WHERE id = ?", [roleId], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);

    if (!rows.length) {
      return response.error(res, "Role not found", 404);
    }

    return response.success(res, "Role fetched successfully", rows[0]);
  });
};

exports.updateRole = (req, res) => {
  const roleId = req.params.id;
  const { role_name } = req.body;

  db.query("SELECT * FROM roles WHERE id = ?", [roleId], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);

    if (!rows.length) {
      return response.error(res, "Role not found", 404);
    }

        db.query(
          "UPDATE roles SET role_name = ? WHERE id = ?",
          [role_name, roleId],
          (err3) => {
            if (err3) return response.error(res, "Database error", 500);

            return response.success(res, "Role updated successfully", {
              id: roleId,
              role_name,
            });
          }
        );
      
  });
};

exports.deleteRole = (req, res) => {
  const roleId = req.params.id;

  db.query("SELECT * FROM roles WHERE id = ?", [roleId], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);

    if (!rows.length) {
      return response.error(res, "Role not found", 404);
    }


    db.query(
      "SELECT COUNT(*) as user_count FROM users WHERE role_id = ?",
      [roleId],
      (err2, countResult) => {
        if (err2) return response.error(res, "Database error", 500);

        if (countResult[0].user_count > 0) {
          return response.error(
            res,
            `Cannot delete role. ${countResult[0].user_count} user(s) are assigned to this role`,
            409
          );
        }

      
        db.query("DELETE FROM roles WHERE id = ?", [roleId], (err3) => {
          if (err3) return response.error(res, "Database error", 500);

          return response.success(res, "Role deleted successfully");
        });
      }
    );
  });
};

