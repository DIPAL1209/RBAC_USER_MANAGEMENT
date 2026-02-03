const Role = require("../models/role");
const User = require("../models/user");
const response = require("../common/response");
const mongoose = require("mongoose");


exports.createRole = async (req, res) => {
  try {
    const { role_name } = req.body;

    const existingRole = await Role.findOne({ role_name });
    if (existingRole) {
      return response.error(res, "Role name already exists", 409);
    }

    const newRole = await Role.create({ role_name });

    return response.success(res, "Role created successfully", newRole, 201);
  } catch (error) {
    console.error("CREATE ROLE ERROR:", error);
    return response.error(res, "Database error", 500);
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });

    return response.success(res, "Roles fetched successfully", roles);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};


exports.getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return response.error(res, "Invalid role id", 400);
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return response.error(res, "Role not found", 404);
    }

    return response.success(res, "Role fetched successfully", role);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { role_name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return response.error(res, "Invalid role id", 400);
    }


    const role = await Role.findById(roleId);
    if (!role) {
      return response.error(res, "Role not found", 404);
    }

   
    const duplicate = await Role.findOne({
      role_name,
      _id: { $ne: roleId },
    });
    if (duplicate) {
      return response.error(res, "Role name already exists", 409);
    }

    role.role_name = role_name;
    await role.save();

    return response.success(res, "Role updated successfully", role);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return response.error(res, "Invalid role id", 400);
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return response.error(res, "Role not found", 404);
    }


    const userCount = await User.countDocuments({ role: roleId });

    if (userCount > 0) {
      return response.error(
        res,
        `Cannot delete role. ${userCount} user(s) are assigned to this role`,
        409
      );
    }

    await Role.findByIdAndDelete(roleId);

    return response.success(res, "Role deleted successfully");
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};