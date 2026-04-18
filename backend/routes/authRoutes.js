const express = require("express");
const router = express.Router();

// Import all your controllers
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile, 
  forgotPassword 
} = require("../controllers/authController");

// Import your security middleware
const { protect } = require("../middleware/authMiddleware");

// 🚀 FIXED ROUTE: Logs the incoming mobile request, then moves to registerUser
router.post("/register", (req, res, next) => {
  console.log(`📱 REGISTRATION ATTEMPT FROM MOBILE: ${req.body.email}`);
  next(); // 👈 This tells Express: "Move to the next function (registerUser)"
}, registerUser);

// Standard Routes
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);

module.exports = router;