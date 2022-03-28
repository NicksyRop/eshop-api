const User = require("../model/user");
const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

//login

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).send("User not found");
  }

  if (user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("Wrong credentials");
  }
});

//get user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      return res.status(404).send({ message: "No user matching the Id" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 8),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  try {
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
