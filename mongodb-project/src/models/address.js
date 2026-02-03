const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    city: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Address", addressSchema);
