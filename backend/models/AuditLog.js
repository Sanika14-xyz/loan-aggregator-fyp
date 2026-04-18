const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  action: String,
  reason: String,
  performedBy: String,
  // NEW: Blockchain Hashing Fields
  previousHash: { type: String, default: "GENESIS_BLOCK" },
  currentHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);