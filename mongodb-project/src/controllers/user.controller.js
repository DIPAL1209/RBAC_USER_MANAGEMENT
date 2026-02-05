const User = require("../models/user");
const Role = require("../models/role");

const Project = require("../models/project");
const Address = require("../models/address");
const {applySearch,applySort,applyPagination} = require("../common/apiLogic");
const response = require("../common/response");
const { buildImageUrl } = require("../common/url.helper");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      status,
      phone,
      salary,
      joining_date,
      experience_years,
      addresses = [],
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(role)) {
      return response.error(res, "Invalid role", 400);
    }

    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return response.error(res, "Role not found", 404);
    }

    const user = await User.create({
      name,
      email,
      role,
      status,
      phone,
      salary,
      joining_date,
      experience_years,
      addresses,
    });

    const result = await User.findById(user._id).populate("role");

    return response.success(res, "User created successfully", result, 201);
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    return response.error(res, "Database error", 500);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.error(res, "Invalid user id", 400);
    }

    const updateData = { ...req.body };

    delete updateData.addresses;
    delete updateData.employments;

    if (updateData.role) {
      const roleExists = await Role.findById(updateData.role);
      if (!roleExists) {
        return response.error(res, "Invalid role", 400);
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).populate("role");

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, "User updated successfully", user);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return response.error(res, "Database error", 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.error(res, "Invalid user id", 400);
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, "User deleted successfully");
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};
exports.getUsers = async (req, res) => {
  try {
    let query = User.find()
      .populate("role")
      .populate({
        path: "employments",
        populate: {
          path: "projects",
        },
      });

    query = applySearch(query, req.query, [
      "name",
      "email",
      "phone",
      "status",
    ]);

    query = applySort(query, req.query);

    const { query: pagedQuery, page, limit } =
      applyPagination(query, req.query);

    const [users, total] = await Promise.all([
      pagedQuery,
      User.countDocuments(),
    ]);

    return response.success(res, "Users fetched successfully", {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (error) {
    console.error(error);
    return response.error(res, "Database error", 500);
  }
};



exports.getUserFullProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.error(res, "Invalid user id", 400);
    }

    const user = await User.findById(userId)
      .populate("role")
      .populate({
        path: "employments",
        populate: {
          path: "projects",
        },
      });

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(
      res,
      "User fetched successfully",
      user
    );
  } catch (error) {
    console.error(error);
    return response.error(res, "Database error", 500);
  }
};

exports.assignRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(role)
    ) {
      return response.error(res, "Invalid ID", 400);
    }

    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return response.error(res, "Invalid role", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).populate("role");

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, "Role updated successfully", {
      user_id: user._id,
      user_name: user.name,
      role_id: user.role._id,
      role_name: user.role.role_name,
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return response.error(res, "Profile image is required", 400);
    }

    const imagePath = req.file.path.replace(/\\/g, "/");

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profile_image: imagePath },
      { new: true },
    );

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, "Profile uploaded", {
      profile_image: req.file.filename,
      profile_url: buildImageUrl(req, req.file.filename),
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.deleteprofile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return response.error(res, "User not found", 404);

    if (user.profile_image) {
      const filePath = path.join("uploads", user.profile_image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    user.profile_image = null;
    await user.save();

    return response.success(res, "Profile deleted successfully");
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("profile_image");

    if (!user) return response.error(res, "User not found", 404);

    return response.success(res, "Profile fetched", {
      profile: user.profile_image,
      profile_url: buildImageUrl(req, user.profile_image),
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};


