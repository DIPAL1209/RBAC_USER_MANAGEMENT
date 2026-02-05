const Project = require("../models/project");
const {applySearch,applySort,applyPagination} = require("../common/apiLogic");
const response = require("../common/response");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

exports.createProject = async (req, res) => {
  try {
    const { employmentId } = req.params;
    const { project_name, client_name, technologies } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employmentId)) {
      return response.error(res, "Invalid employment ID", 400);
    }

    if (!Array.isArray(technologies) || technologies.length === 0) {
      return response.error(res, "Technologies must be a non-empty array", 400);
    }

    const employment = await Employment.findById(employmentId);
    if (!employment) {
      return response.error(res, "Employment not found", 404);
    }

    const project = await Project.create({
      employment: employmentId,
      project_name,
      client_name,
      technologies,
    });

    employment.projects.push(project._id);
    await employment.save();

    return response.success(res, "Project created successfully", project, 201);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    return response.error(res, "Database error", 500);
  }
};

exports.getProjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.employment) {
      filter.employment = req.query.employment;
    }

    let query = Project.find(filter)
      .populate({
        path: "employment",
        populate: {
          path: "userId",
        },
      });

    query = applySearch(query, req.query, [
      "project_name",
      "client_name",
      "technologies",
    ]);

    query = applySort(query, req.query);

    const { query: pagedQuery, page, limit } =
      applyPagination(query, req.query);

    const [projects, total] = await Promise.all([
      pagedQuery,
      Project.countDocuments(filter),
    ]);

    return response.success(res, "Projects fetched successfully", {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: projects,
    });
  } catch (error) {
    console.error(error);
    return response.error(res, "Database error", 500);
  }
};

