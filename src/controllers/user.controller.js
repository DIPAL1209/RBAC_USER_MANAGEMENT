const { User, Role } = require("../models/index");
const { Op } = require("sequelize");
const response = require("../common/response");
const { buildImageUrl } = require("../common/url.helper");
const fs = require("fs");
const path = require("path");

exports.createUser = async (req, res) => {
  try {
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

    const role = await Role.findByPk(role_id);
    if (!role) {
      return response.error(res, "Invalid role_id", 400);
    }

    const newUser = await User.create({
      name,
      email,
      role_id,
      phone: phone || null,
      status,
      salary: salary || null,
      joining_date,
      experience_years: experience_years || null,
    });

    const userWithRole = await User.findByPk(newUser.id, {
      include: {
        model: Role,
        as: "role",
        attributes: ["id", "role_name"],
      },
    });

    return response.success(
      res,
      "User created successfully",
      userWithRole,
      201
    );
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.updateUser = async (req, res) => {
  try {
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

    const user = await User.findByPk(userId);
    if (!user) {
      return response.error(res, "User not found", 404);
    }

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

    await User.update(updatedData, {
      where: { id: userId },
    });

    const updatedUser = await User.findByPk(userId, {
      include: {
        model: Role,
        as: "role",
        attributes: ["id", "role_name"],
      },
    });

    return response.success(res, "User updated successfully", updatedUser);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: "role",
        attributes: ["id", "role_name"],
      },
    });

    return response.success(res, "Users fetched successfully", users);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.getUsersid = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        as: "role",
        attributes: ["id", "role_name"],
      },
    });

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, "Users fetched successfully", [user]);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.assignRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role_id } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return response.error(res, "User not found", 404);
    }

    const role = await Role.findByPk(role_id);
    if (!role) {
      return response.error(res, "Invalid role_id", 400);
    }

    await User.update({ role_id }, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId, {
      attributes: ["id", "name", "role_id"],
      include: {
        model: Role,
        as: "role",
        attributes: ["id", "role_name"],
      },
    });

    const result = {
      user_id: updatedUser.id,
      user_name: updatedUser.name,
      role_id: updatedUser.role_id,
      role_name: updatedUser.role.role_name,
    };

    return response.success(res, "Role updated successfully", result);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return response.error(res, "User not found", 404);
    }

    await User.destroy({ where: { id: userId } });

    return response.success(res, "User deleted successfully");
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.uploadProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return response.error(res, "No file uploaded", 400);
    }

    const fileName = req.file.filename;

    const user = await User.findByPk(userId, {
      attributes: ["id", "profile"],
    });

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    const oldProfile = user.profile;

    if (oldProfile) {
      const oldPath = path.join("uploads", oldProfile);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await User.update({ profile: fileName }, { where: { id: userId } });

    const message = oldProfile
      ? "Profile updated successfully"
      : "Profile uploaded successfully";

    return response.success(res, message, {
      user_id: userId,
      profile: fileName,
      profile_url: buildImageUrl(req, fileName),
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.uploadGallery = (req, res) => {
  if (!req.files || !req.files.length) {
    return response.error(res, "No files uploaded", 400);
  }

  const filenames = req.files.map((f) => f.filename);

  return response.success(res, "Gallery uploaded", {
    total_files: filenames.length,
    files: filenames,
  });
};


exports.deleteprofile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "profile"],
    });

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    const filename = user.profile;

    if (filename) {
      const filePath = path.join("uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await User.update({ profile: null }, { where: { id: userId } });

    return response.success(res, "Profile deleted successfully", {
      user_id: userId,
      profile: null,
      profile_url: null,
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "profile"],
    });

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    const filename = user.profile;

    return response.success(res, "Profile fetched", {
      user_id: user.id,
      profile: filename || null,
      profile_url: buildImageUrl(req, filename),
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
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
