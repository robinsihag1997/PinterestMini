const mongoose = require("mongoose");
// const passport = require("passport");
// const plm = require("passport-local-mongoose");
const postModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  title: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("postModel", postModel);
