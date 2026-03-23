const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {
  getAllUsers,
  deleteUser
} = require("../controllers/authController");

const authMiddleware  = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// Test route
router.get("/test", (req, res) => {
  res.send("User route working");
});


// AUTH ONLY → Get all users for chat (name + email only, no sensitive data)
router.get("/chat-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email")
      .lean();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ADMIN ONLY → Get all users (full data)
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);


// ADMIN ONLY → Delete a user
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);


module.exports = router;