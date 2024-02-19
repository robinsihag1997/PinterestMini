const mongoose = require("mongoose");
const passport = require("passport");
const plm = require("passport-local-mongoose");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  contact: {
    type: String,
  },
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "postModel",
    },
  ],
});

userSchema.plugin(plm);

module.exports = mongoose.model("userModel", userSchema);
