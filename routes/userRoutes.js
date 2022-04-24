const router = require("express").Router();
const User = require("../models/User");

// creating user (POST)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    console.log(req.body);
    const user = await User.create({ name, email, password, picture });
    res.status(201).json(user);
  } catch (error) {
    let msg;
    if (error.code == 11000) {
      msg = "Usario ya existe";
    } else {
      msg = error.message;
    }
    console.log(error);
    res.status(400).json(msg);
  }
});

// login user (POST)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "linea";
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
