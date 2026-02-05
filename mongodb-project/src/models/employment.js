const mongoose = require("mongoose");

const employmentSchema = new mongoose.Schema(
  {
    userId: {
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

  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

employmentSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "employment",
});

module.exports = mongoose.model("Employment", employmentSchema);
