const Employment = require("../models/employment");
const {applySearch,applySort,applyPagination} = require("../common/apiLogic");
const response = require("../common/response");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");


exports.createEmployment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { company_name, department, employment_type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.error(res, "Invalid user ID", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      return response.error(res, "User not found", 404);
    }

    const employment = await Employment.create({
      userId,
      company_name,
      department,
      employment_type,
    });

    const result = await Employment.findById(employment._id).populate(
      "userId",
      "name email",
    );

    return response.success(
      res,
      "Employment created successfully",
      result,
      201,
    );
  } catch (error) {
    console.error("CREATE EMPLOYMENT ERROR:", error);
    return response.error(res, "Database error", 500);
  }
};

exports.getEmployments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    let query = Employment.find(filter)
      .populate("userId")
      .populate("projects");

    query = applySearch(query, req.query, [
      "company_name",
      "department",
      "employment_type",
    ]);

    query = applySort(query, req.query);

    const { query: pagedQuery, page, limit } =
      applyPagination(query, req.query);

    const [employments, total] = await Promise.all([
      pagedQuery,
      Employment.countDocuments(filter),
    ]);

    return response.success(res, "Employments fetched successfully", {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: employments,
    });
  } catch (error) {
    return response.error(res, "Database error", 500);
  }
};
