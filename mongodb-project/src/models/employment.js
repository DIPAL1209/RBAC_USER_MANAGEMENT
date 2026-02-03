const mongoose = require("mongoose");

const employmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company_name: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    employment_type: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      required: true,
    },
    projects: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project"
}],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Employment", employmentSchema);
