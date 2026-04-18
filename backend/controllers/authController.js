const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/emailService"); // Import email service

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", { expiresIn: "30d" });

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Please add all fields" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });

    const allowedRoles = ["applicant", "loan_officer", "risk_manager", "compliance_auditor", "admin"];
    const salt = await bcrypt.genSalt(10);
    
    const user = await User.create({
      name, email,
      password: await bcrypt.hash(password, salt),
      role: allowedRoles.includes(role) ? role : "applicant",
    });

    // 📧 SEND WELCOME EMAIL (fire-and-forget - don't block registration on email)
    sendEmail({
      email: user.email,
      subject: "Welcome to Credify! 🎉",
      html: `
        <div style="font-family: sans-serif; color: #0B1C3D; padding: 20px;">
          <h2 style="color: #C9A84C;">Welcome to Credify, ${user.name}!</h2>
          <p>Your secure account has been created. You can now use our AI-powered engine to compare 60+ banks, calculate your EMI, and apply for loans instantly.</p>
          <p>Login to your dashboard to get started.</p>
        </div>
      `
    }).catch(err => console.log("Email skipped:", err.message));

    res.status(201).json({ _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user.id, user.role) });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user.id, user.role) });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getMe = async (req, res) => res.status(200).json(req.user);

const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: "Provide current password" });
      if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ message: "Current password incorrect" });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    await user.save();
    res.json({ _id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📧 FORGOT PASSWORD CONTROLLER
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    await sendEmail({
      email: user.email,
      subject: "Credify - Password Reset Request 🔐",
      html: `
        <div style="font-family: sans-serif; color: #0B1C3D; padding: 20px;">
          <h2 style="color: #C9A84C;">Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password for Credify. If this was you, please click the secure link below to reset your password:</p>
          <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 20px; background: #C9A84C; color: #0B1C3D; text-decoration: none; border-radius: 5px; font-weight: bold;">Return to Login</a>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, forgotPassword };