// src/controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

const signup = async (req, res) => {
  const { name, email, phone, password, activities, location } = req.body;
  if (
    !Array.isArray(activities) ||
    activities.length === 0 ||
    activities.length > 3
  ) {
    return res
      .status(400)
      .json({ message: "You must select between 1 and 3 activities." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      activities,
      location: {
        type: "Point",
        coordinates: [location.lat, location.lng],
      },
    });
    req.session.userId = user.id;
    res.status(201).json({ message: "User created successfully", status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = user.id;
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
};

module.exports = { signup, login, logout };
