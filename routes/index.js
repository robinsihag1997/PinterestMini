var express = require("express");
const UserModel = require("../models/UserSchema");
const passport = require("passport");
var router = express.Router();
const localStrategy = require("passport-local");
const upload = require("./multer");
const postModel = require("../models/postModel");

passport.use(new localStrategy(UserModel.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { nav: false });
});

//------------------Register routes----------------//
//----front rout----------
router.get("/register", function (req, res) {
  res.render("register", { nav: false });
});
//------register post route--------------------
router.post("/register", async function (req, res) {
  const { username, email, contact } = req.body;
  const data = new UserModel({
    username,
    email,
    contact,
  });
  UserModel.register(data, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

//-------------------Profile Route--------------------//
router.get("/profile", isLogined, async function (req, res) {
  const user = await UserModel.findOne({
    username: req.session.passport.user,
  }).populate("posts");

  res.render("profile", { user, nav: true });
});
//-------------------showpostRoute--------------------//
router.get("/show/posts", isLogined, async function (req, res) {
  const user = await UserModel.findOne({
    username: req.session.passport.user,
  }).populate("posts");

  res.render("show", { user, nav: true });
});
//-------------------feedRoute--------------------//
router.get("/feed", async function (req, res) {
  const user = await UserModel.findOne({
    username: req.session.passport.user,
  });
  const posts = await postModel.find().limit(20).populate("user");
  res.render("feed", { user, posts, nav: true });
});
//-------------------addpost Route--------------------//
router.get("/add", isLogined, async function (req, res) {
  const user = await UserModel.findOne({
    username: req.session.passport.user,
  });

  res.render("add", { user, nav: true });
});
//-------------------Createpost Route--------------------//
router.post(
  "/createpost",
  isLogined,
  upload.single("postimage"),
  async function (req, res) {
    const user = await UserModel.findOne({
      username: req.session.passport.user,
    });

    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);
//-------------------fileuploadRoute--------------------//
router.post(
  "/fileupload",
  isLogined,
  upload.single("image"),
  async function (req, res) {
    const user = await UserModel.findOne({
      username: req.session.passport.user,
    });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);
//-------------------Login Route--------------------//
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
  }),
  function (req, res) {
    res.render("profile");
  }
);
//-------------------Logout Route--------------------//
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
//-------------------is Logined in function--------------------//
function isLogined(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
module.exports = router;
