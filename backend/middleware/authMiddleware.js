const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ message: "User not found" });
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }
  return res.status(401).json({ message: "Not authorized, no token" });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Not authorized, admin only" });
};

const auditorOnly = (req, res, next) => {
  if (req.user && (req.user.role === "compliance_auditor" || req.user.role === "admin")) next();
  else res.status(403).json({ message: "Not authorized, auditor only" });
};

const officerOnly = (req, res, next) => {
  if (req.user && req.user.role === "loan_officer") next();
  else res.status(403).json({ message: "Not authorized, officer only" });
};

const adminOrOfficer = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "loan_officer")) next();
  else res.status(403).json({ message: "Not authorized, admin or officer only" });
};

module.exports = { protect, adminOnly, auditorOnly, officerOnly, adminOrOfficer };