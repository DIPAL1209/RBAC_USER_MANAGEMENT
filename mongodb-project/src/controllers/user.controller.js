const User = require("../models/User.model");
const Role = require("../models/Role.model");
const response = require("../common/response");
const { buildImageUrl } = require("../common/url.helper");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");


exports.createUser = async (req, res) => {
  try {
    const {name,email,role,status,phone,salary,joining_date,experience_years,addresses = []} = req.body;


    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return response.error(res, "Invalid role", 400);
    }

    const user = await User.create({name,email,role,status,phone,salary,joining_date,experience_years,addresses,
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

    if (updateData.role) {
      const roleExists = await Role.findById(updateData.role);
      if (!roleExists) {
        return response.error(res, "Invalid role", 400);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).populate("role");

    if (!user) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, "User updated successfully", user);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return response.error(res, "Database error", 500);
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role");

    return response.success(res, "Users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return response.error(res, "Database error", 500);
  }
};

exports.getUsersid = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.error(res, "Invalid user id", 400);
    }

    const user = await User.findById(userId).populate("role");

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
      { new: true }
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

