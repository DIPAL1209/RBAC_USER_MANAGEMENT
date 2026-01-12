const db = require("../config/db");
const response = require("../common/response");
const { buildImageUrl } = require("../common/url.helper");
const fs = require("fs");
const path = require("path");


exports.createUser = (req, res) => {
  const {
    name,
    email,
    role_id,
    phone,
    status,
    salary,
    joining_date,
    experience_years,
  } = req.body;

  db.query("SELECT id FROM roles WHERE id = ?", [role_id], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);
    if (!rows.length) return response.error(res, "Invalid role_id", 400);

    db.query(
      `INSERT INTO users 
      (name, email, role_id, phone, status, salary, joining_date, experience_years)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        role_id,
        phone || null,
        status,
        salary || null,
        joining_date,
        experience_years || null,
      ],
      (err2, result) => {
        if (err2) return response.error(res, "Database error", 500);

        db.query(
          `SELECT u.*, r.role_name
           FROM users u
           LEFT JOIN roles r ON r.id = u.role_id
           WHERE u.id = ?`,
          [result.insertId],
          (err3, rows2) => {
            if (err3) return response.error(res, "Database error", 500);

            return response.success(
              res,
              "User created successfully",
              rows2[0],
              201
            );
          }
        );
      }
    );
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const {
    name,
    email,
    role_id,
    phone,
    status,
    salary,
    joining_date,
    experience_years,
  } = req.body;

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);
    if (!rows.length) return response.error(res, "User not found", 404);

    const user = rows[0];

    const updatedData = {
      name: name || user.name,
      email: email || user.email,
      role_id: role_id || user.role_id,
      phone: phone !== undefined ? phone : user.phone,
      status: status || user.status,
      salary: salary !== undefined ? salary : user.salary,
      joining_date: joining_date || user.joining_date,
      experience_years:
        experience_years !== undefined
          ? experience_years
          : user.experience_years,
    };

    db.query(
      `UPDATE users 
       SET name = ?, email = ?, role_id = ?, phone = ?, status = ?, 
           salary = ?, joining_date = ?, experience_years = ?
       WHERE id = ?`,
      [
        updatedData.name,
        updatedData.email,
        updatedData.role_id,
        updatedData.phone,
        updatedData.status,
        updatedData.salary,
        updatedData.joining_date,
        updatedData.experience_years,
        userId,
      ],
      (err2) => {
        if (err2) return response.error(res, "Database error", 500);

        db.query(
          `SELECT u.*, r.role_name
           FROM users u
           LEFT JOIN roles r ON r.id = u.role_id
           WHERE u.id = ?`,
          [userId],
          (err3, result) => {
            if (err3) return response.error(res, "Database error", 500);

            return response.success(
              res,
              "User updated successfully",
              result[0]
            );
          }
        );
      }
    );
  });
};

exports.getUsers = (req, res) => {
  db.query(
    `SELECT u.*, r.role_name
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id`,
    (err, rows) => {
      if (err) return response.error(res, "Database error", 500);

      return response.success(res, "Users fetched successfully", rows);
    }
  );
};

exports.getUsersid = (req, res) => {
  const userId = req.params.id;
  db.query(
    `SELECT u.*, r.role_name
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     WHERE u.id =?`,
    [userId],
    (err, rows) => {
      if (err) return response.error(res, "Database error", 500);
      if (!rows.length) return response.error(res, "User not found", 404);

      return response.success(res, "Users fetched successfully", rows);
    }
  );
};


exports.assignRole = (req, res) => {
  const userId = req.params.id;
  const { role_id } = req.body;


  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, userRows) => {
    if (err) return response.error(res, "Database error", 500);
    if (!userRows.length) return response.error(res, "User not found", 404);

    db.query(
      "SELECT * FROM roles WHERE id = ?",
      [role_id],
      (err2, roleRows) => {
        if (err2) return response.error(res, "Database error", 500);
        if (!roleRows.length)
          return response.error(res, "Invalid role_id", 400);

        db.query(
          "UPDATE users SET role_id = ? WHERE id = ?",
          [role_id, userId],
          (err3) => {
            if (err3) return response.error(res, "Database error", 500);

            db.query(
              `SELECT u.id AS user_id, u.name AS user_name,
                    u.role_id, r.role_name
             FROM users u
             LEFT JOIN roles r ON r.id = u.role_id
             WHERE u.id = ?`,
              [userId],
              (err4, rows) => {
                if (err4) return response.error(res, "Database error", 500);

                return response.success(
                  res,
                  "Role updated successfully",
                  rows[0]
                );
              }
            );
          }
        );
      }
    );
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);
    if (!rows.length) return response.error(res, "User not found", 404);

    db.query("DELETE FROM users WHERE id = ?", [userId], (err2) => {
      if (err2) return response.error(res, "Database error", 500);

      return response.success(res, "User deleted successfully");
    });
  });
};

exports.uploadProfile = (req, res) => {
  const userId = req.params.id;

  if (!req.file) {
    return response.error(res, "No file uploaded", 400);
  }

  const fileName = req.file.filename;

  db.query("SELECT profile FROM users WHERE id = ?", [userId], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);
    if (!rows.length) return response.error(res, "User not found", 404);

    const oldProfile = rows[0].profile;

    
    if (oldProfile) {
      const oldPath = path.join("uploads", oldProfile);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    db.query(
      "UPDATE users SET profile = ? WHERE id = ?",
      [fileName, userId],
      (err2) => {
        if (err2) return response.error(res, "Database error", 500);

        const message = oldProfile
          ? "Profile updated successfully"
          : "Profile uploaded successfully";

        return response.success(res, message, {
          user_id: userId,
          profile: fileName,
          profile_url: buildImageUrl(req, fileName)  
        });
      }
    );
  });
};


exports.uploadGallery = (req, res) => {
  if (!req.files || !req.files.length) {
    return response.error(res, "No files uploaded", 400);
  }

  const filenames = req.files.map(f => f.filename);

  return response.success(res, "Gallery uploaded", {
    total_files: filenames.length,
    files: filenames
  });
};


exports.testUpload = (req, res) => {
  return response.success(res, "Files received", {
    profile: req.files.profile?.[0]?.filename,
    documents: req.files.documents?.map(f => f.filename)
  });
};


exports.deleteprofile = (req, res) => {
  const userId = req.params.id;

  db.query("SELECT profile FROM users WHERE id = ?", [userId], (err, rows) => {
    if (err) return response.error(res, "Database error", 500);

    const filename = rows[0]?.profile;

    if (filename) {
      const filePath = path.join("uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.query("UPDATE users SET profile = NULL WHERE id = ?", [userId], (err , rows) => {
      if (err) return response.error(res, "Database error", 500);
      return response.success(res, "Profile deleted successfully", {
        user_id: userId,
        profile: null,
        profile_url: null
      });
    });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT id, profile FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) return response.error(res, "Database error", 500);
      if (!rows.length) return response.error(res, "User not found", 404);

      const filename = rows[0].profile;

      return response.success(res, "Profile fetched", {
        user_id: rows[0].id,
        profile: filename || null,
        profile_url: buildImageUrl(req, filename)
      });
    }
  );
};

exports.combine = (req, res) => {
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "u.id";
  const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.name LIKE ? OR u.email LIKE ?
  `;

  db.query(countQuery, [`%${search}%`, `%${search}%`], (err, countResult) => {
    if (err) return response.error(res, "Database error", 500);

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    const dataQuery = `
      SELECT u.*, r.role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.name LIKE ? OR u.email LIKE ?
      ORDER BY ${sortBy} ${sortOrder}, u.id ASC
      LIMIT ? OFFSET ?
    `;

    db.query(
      dataQuery,
      [`%${search}%`, `%${search}%`, limit, offset],
      (err, rows) => {
        if (err) return response.error(res, "Database error", 500);

        return response.success(res, "Users fetched", {
          page,
          limit,
          totalRecords,
          totalPages,
          data: rows
        });
      }
    );
  });
};
