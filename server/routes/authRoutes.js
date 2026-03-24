const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// NOTE: /users (GET) and /users/:id (DELETE) have been removed from here.
// They are protected by authMiddleware + adminMiddleware in userRoutes.js

module.exports = router;