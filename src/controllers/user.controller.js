const { User, Role, UserProfile, Address } = require("../models");
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
      status,
      phone,
      salary,
      joining_date,
      experience_years,
      addresses = [],
    } = req.body;


    const role = await Role.findByPk(role_id);
    if (!role) {
      return response.error(res, "Invalid role_id", 400);
    }

    const user = await User.create({
      name,
      email,
      role_id,
      status,
    });

 
    const profile = await UserProfile.create({
      user_id: user.id,
      phone,
      salary,
      joining_date,
      experience_years,
    });

  
    if (Array.isArray(addresses) && addresses.length > 0) {
      for (const addr of addresses) {
        await Address.create({
          user_profile_id: profile.id,
          city: addr.city,
        });
      }
    }

    
    const result = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: "role",
        },
        {
          model: UserProfile,
          as: "profile",
          include: [
            {
              model: Address,
              as: "addresses",
            },
          ],
        },
      ],
    });

    return response.success(
      res,
      "User created successfully",
      result,
      201
    );
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
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
      status,
      phone,
      salary,
      joining_date,
      experience_years,
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return response.error(res, "User not found", 404);

    await User.update(
      { name, email, role_id, status },
      { where: { id: userId } }
    );

    await UserProfile.update(
      { phone, salary, joining_date, experience_years },
      { where: { user_id: userId } }
    );

    const updatedUser = await User.findByPk(userId, {
      include: [
        { model: Role, as: "role" },
        {
          model: UserProfile,
          as: "profile",
          include: [{ model: Address, as: "addresses" }],
        },
      ],
    });

    return response.success(res, "User updated successfully", updatedUser);
  } catch (error) {
    console.error(error);
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
          attributes: ["id", "role_name"],
        },
        {
          model: UserProfile,
          as: "profile",
          include: [
            {
              model: Address,
              as: "addresses",
            },
          ],
        },
      ],
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
          attributes: ["id", "role_name"],
        },
        {
          model: UserProfile,
          as: "profile",
          include: [
            {
              model: Address,
              as: "addresses",
            },
          ],
        },
      ],
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
    if (!req.file) return response.error(res, "No file uploaded", 400);

    const profile = await UserProfile.findOne({ where: { user_id: userId } });
    if (!profile) return response.error(res, "Profile not found", 404);

    if (profile.profile_image) {
      const oldPath = path.join("uploads", profile.profile_image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await UserProfile.update(
      { profile_image: req.file.filename },
      { where: { user_id: userId } }
    );

    return response.success(res, "Profile uploaded", {
      profile_image: req.file.filename,
      profile_url: buildImageUrl(req, req.file.filename),
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
    const profile = await UserProfile.findOne({
      where: { user_id: req.params.id },
    });

    if (!profile) return response.error(res, "Profile not found", 404);

    if (profile.profile_image) {
      const filePath = path.join("uploads", profile.profile_image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await UserProfile.update(
      { profile_image: null },
      { where: { user_id: req.params.id } }
    );

    return response.success(res, "Profile deleted successfully");
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};


exports.getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      where: { user_id: req.params.id },
      attributes: ["profile_image"],
    });

    if (!profile) return response.error(res, "Profile not found", 404);

    return response.success(res, "Profile fetched", {
      profile: profile.profile_image,
      profile_url: buildImageUrl(req, profile.profile_image),
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.combine = async (req, res) => {
  try {
    const {
      search = "",
      sortBy = "created_at",
      sortOrder = "desc",
      page = 1,
      limit = 5,
    } = req.query;

    const offset = (page - 1) * limit;

    let whereCondition = {};


    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    
    const dateCondition = applyDateFilter(req.query);
    if (dateCondition) {
      whereCondition[Op.and] = whereCondition[Op.and]
        ? [...whereCondition[Op.and], dateCondition]
        : [dateCondition];
    }

   
    const sortFieldMap = {
      createdAt: "created_at",
      updatedAt: "updated_at",
      name: "name",
      email: "email",
      status: "status",
      id: "id",
    };

    const actualSortField = sortFieldMap[sortBy] || "created_at";

    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,

      include: [
        {
          model: Role,
          as: "role",
          required: false,
          attributes: ["id", "role_name"],
        },
        {
          model: UserProfile,
          as: "profile",
          required: false,
          include: [
            {
              model: Address,
              as: "addresses",
              required: false,
            },
          ],
        },
      ],

      order: [[actualSortField, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    return response.success(res, "Users fetched successfully", {
      page: parseInt(page),
      limit: parseInt(limit),
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error("COMBINE ERROR:", error);
    return response.error(res, "Database error", 500);
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
          attributes: ["id", "role_name"],
        },
        {
          model: UserProfile,
          as: "profile",
          required: false,
          include: [
            {
              model: Address,
              as: "addresses",
              required: false,
            },
          ],
        },
      ],

      order: [["id", "ASC"]],
    });

    return response.success(res, "Active users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return response.error(res, "Server error", 500);
  }
};