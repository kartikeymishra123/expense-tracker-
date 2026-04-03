let { Router } = require("express");
let user = require("../models/user");
let bycrypt = require("bcryptjs");
let { createTokenForUser, validateToken } = require("../auth/userAuth");

let router = Router();

router.post("/signup", async (req, res) => {
  try {
    let { fullname, email, password } = req.body;
    let existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    let hashedPassword = await bycrypt.hash(password, 10);
    let User = await user.create({
      fullname,
      email,
      password: hashedPassword,
    });
    let token = createTokenForUser(User);
    return res.status(201).json({
      token,
      user: {
        _id: User._id,
        name: User.fullname,
        email: User.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let User = await user.findOne({ email });

    if (!User) {
      return res.status(400).json({ message: "user not found" });
    }
    let isMatch = bycrypt.compare(password, User.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }
    let token = createTokenForUser(User);
    return res.status(200).json({
      token,
      user: {
        _id: User._id,
        name: User.fullname,
        email: User.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "server error" });
  }
});
router.put("/update", validateToken, async (req, res) => {
  let UserId = req.user._id;
  let { fullname, email } = req.body;
  try {
    let updatedUser = await user.findByIdAndUpdate(
      UserId,
      { fullname, email },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json({ err });
  }
});
router.get("/me", validateToken, async (req, res) => {
  let UserId = req.user._id;
  try {
    let founduser = await user.findById(UserId);
    return res.status(200).json(founduser);
  } catch (err) {
    return res.status(400).json({ err });
  }
});

module.exports = router;
