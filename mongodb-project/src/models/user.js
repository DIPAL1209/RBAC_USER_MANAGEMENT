const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    phone: {
      type: String,
      maxlength: 10,
    },

    profile_image: {
      type: String,
      default: null,
    },

    salary: Number,
    experience_years: Number,
    joining_date: Date,

    employments: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Employment"
}]
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
