const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Sign Up/Add User
router.post("/register", async (req, res) => {
  try {
    //Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //Save user to DB and get return responds
    const user = await newUser.save();
    res.status(200).json(user);
    console.log(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//User Login
router.post("/login", async (req, res) => {
  try {
    //finding user in DB with email id
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User not exist");

    //comapre password of current user DB
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
