const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    name: {
      type: String,
      required: true,
      trim: true, // removes extra spaces
    },
    profileImage: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
  },
  { timestamps: true } // ✅ automatically adds createdAt & updatedAt
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
