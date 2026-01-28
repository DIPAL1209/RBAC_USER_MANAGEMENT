const { User, Role, Address, Project } = require("../models");
const { Op, fn, col } = require("sequelize");
const response = require("../common/response");
const { buildImageUrl } = require("../common/url.helper");
const applyDateFilter = require("../common/dateFilter");
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
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "role_name"]
        },
        {
          model: Address,
          as: "addresses",
          include: [
            {
              model: Project,
              as: "projects",
           attributes: ["id", "title"]
            }
          ]
        }
      ]
    });

    return response.success(res, "Users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return response.error(res, "Database error", 500);
  }
};


exports.getUsersid = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "role_name"]
        },
        {
          model: Address,
          as: "addresses",
          include: [
            {
              model: Project,
              as: "projects"
            }
          ]
        }
      ]
    });

    if (!user) {
      return response.error(res, "User not found", 404);
    }

   
    return response.success(res, "User fetched successfully", [user]);
  } catch (error) {
    console.error(error);
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

exports.combine = async (req, res) => {
  try {
    console.log("🔥 COMBINE API HIT 🔥");

    const {
      search = "",
      sortBy = "created_at",
      sortOrder = "desc",
      page = 1,
      limit = 5
    } = req.query;

    const offset = (page - 1) * limit;

    let whereCondition = {};

    // 🔍 SEARCH
    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const dateCondition = applyDateFilter(req.query);
    if (dateCondition) {
      whereCondition[Op.and] = whereCondition[Op.and] 
        ? [...whereCondition[Op.and], dateCondition]
        : [dateCondition];
    }

    const sortFieldMap = {
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'name': 'name',
      'email': 'email',
      'salary': 'salary',
      'joining_date': 'joining_date',
      'experience_years': 'experience_years',
      'status': 'status',
      'id': 'id'
    };

    const actualSortField = sortFieldMap[sortBy] || 'created_at';

    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      include: [
        { model: Role, as: "role", required: false },
        { model: Address, as: "addresses", required: false }
      ],
      order: [[actualSortField, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return response.success(res, "Users fetched successfully", {
      page: parseInt(page),
      limit: parseInt(limit),
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    console.error("COMBINE ERROR:", error);
    return response.error(res, error.message, 500);
  }
};

exports.getAllusers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { status: "active" },

      include: [
        {
          model: Role,
          as: "role",
          required: false,
          include: [
            {
              model: RolePermission,
              as: "permissions",
              where: { status: "active" },
              required: false,
            },
          ],
        },
        {
          model: UserProfile,
          as: "profile",
          required: false,
        },
      ],

      order: [
        ["id", "ASC"],
        [{ model: Role, as: "role" }, "id", "ASC"],
        [
          { model: Role, as: "role" },
          { model: RolePermission, as: "permissions" },
          "id",
          "ASC",
        ],
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Users with hierarchy fetched",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
