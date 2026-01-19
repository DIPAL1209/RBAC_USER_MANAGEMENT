const { Role, User } = require("../models/index");
const response = require("../common/response");

exports.createRole = async (req, res) => {
  try {
    const { id, role_name } = req.body;

    const existingRoleById = await Role.findByPk(id);
    if (existingRoleById) {
      return response.error(res, "Role ID already exists", 409);
    }

    const existingRoleByName = await Role.findOne({
      where: { role_name },
    });
    if (existingRoleByName) {
      return response.error(res, "Role name already exists", 409);
    }

    const newRole = await Role.create({ id, role_name });

    return response.success(res, "Role created successfully", newRole, 201);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [["id", "ASC"]],
    });

    return response.success(res, "Roles fetched successfully", roles);
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;

    const role = await Role.findByPk(roleId);

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

    const role = await Role.findByPk(roleId);

    if (!role) {
      return response.error(res, "Role not found", 404);
    }
    await Role.update({ role_name }, { where: { id: roleId } });

    return response.success(res, "Role updated successfully", {
      id: roleId,
      role_name,
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    const role = await Role.findByPk(roleId);

    if (!role) {
      return response.error(res, "Role not found", 404);
    }

    const userCount = await User.count({
      where: { role_id: roleId },
    });

    if (userCount > 0) {
      return response.error(
        res,
        `Cannot delete role. ${userCount} user(s) are assigned to this role`,
        409
      );
    }

    await Role.destroy({ where: { id: roleId } });

    return response.success(res, "Role deleted successfully");
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};
