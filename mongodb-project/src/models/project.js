const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    employment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employment",
      required: true,
    },

    project_name: {
      type: String,
      required: true,
      trim: true,
    },

    client_name: {
      type: String,
      trim: true,
    },

    technologies: {
      type: [String],
      required: true,
    },
  },
  { timestamps: false,
     versionKey:false,
   }
);

module.exports = mongoose.model("Project", projectSchema);
