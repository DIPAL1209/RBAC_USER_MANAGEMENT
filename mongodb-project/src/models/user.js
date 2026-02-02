const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
  },
  { _id: false } 
);

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
      maxlength: 15,
    },

    profile_image: {
      type: String,
    },

    salary: {
      type: Number,
    },

    experience_years: {
      type: Number,
    },

    joining_date: {
      type: Date,
    },

    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
