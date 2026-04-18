const express = require("express");
const router = express.Router();
const {
  submitApplication, getMyApplications,
  getAllApplications, getAuditLogs, getStats, updateApplicationStatus, getOfficerApplications,
  getApplicationById, addChatMessage, scheduleMeeting, publishMOM, updateDualDecision, signRegulatoryForm
} = require("../controllers/applicationController");
const { protect, adminOnly, auditorOnly, officerOnly, adminOrOfficer } = require("../middleware/authMiddleware");

// Custom flexible multi-role mapping (since dual-workflows demand access from either officer or auditor)
const officerOrAuditor = (req, res, next) => {
  if (req.user && ['loan_officer', 'compliance_auditor', 'admin'].includes(req.user.role)) next();
  else res.status(401).json({ message: "Not authorized as valid role" });
};

router.get("/audit-logs", protect, auditorOnly, getAuditLogs);
router.get("/stats", protect, adminOnly, getStats);
router.get("/my", protect, getMyApplications);
router.get("/officer", protect, officerOrAuditor, getOfficerApplications); // Map both safely to grab full case lists
router.get("/:id", protect, officerOrAuditor, getApplicationById); // Single Document Polling
router.get("/", protect, adminOnly, getAllApplications);
router.post("/", protect, submitApplication);

// Existing Legacy Route
router.put("/:id/status", protect, adminOrOfficer, updateApplicationStatus);

// 🏦 COLLABORATIVE ENDPOINTS
router.post("/:id/chat", protect, officerOrAuditor, addChatMessage);
router.post("/:id/meeting", protect, officerOrAuditor, scheduleMeeting);
router.post("/:id/mom", protect, officerOrAuditor, publishMOM);
router.put("/:id/dual-decision", protect, officerOrAuditor, updateDualDecision);

// 🏦 APPLICANT ENDPOINTS
router.post("/:id/sign", protect, signRegulatoryForm);

module.exports = router;