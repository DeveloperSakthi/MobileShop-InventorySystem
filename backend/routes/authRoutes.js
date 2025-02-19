// routes/authRoutes.js

const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController"); // Import from userController
const { check } = require("express-validator");

const router = express.Router();

// Register Route
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("role", "Role must be admin or staff").isIn(["admin", "staff"]),
  ],
  registerUser
);

// Login Route
router.post(
  "/login",
  [
    check("email", "Valid email required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

module.exports = router;
