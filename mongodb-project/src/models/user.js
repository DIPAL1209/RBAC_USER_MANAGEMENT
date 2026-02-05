const mongoose = require("mongoose");


if (mongoose.models.User) {
  delete mongoose.models.User;
  delete mongoose.modelSchemas.User;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    phone: String,
    profile_image: { type: String, default: null },
    salary: Number,
    experience_years: Number,
    joining_date: Date,
    addresses: [
      {
        _id: false,
        city: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("employments", {
  ref: "Employment",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});

module.exports = mongoose.model("User", userSchema);