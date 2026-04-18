const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true },
    loanType: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    status: { type: String, default: "Pending" }, 
    aiScore: { type: Number },
    riskGrade: { type: String },
    emi: { type: Number },
    fraudFlag: { type: Boolean, default: false },
    defaultProbability: { type: Number },
    remarks: { type: String },
    documents: [
      {
        fileName: String,
        fileType: String,
        verified: { type: Boolean, default: false },
      }
    ],
    // CORPORATE FINANCE METRICS (BASEL II RISK FRAMEWORK)
    pd: { type: Number }, // Probability of Default (%)
    lgd: { type: Number }, // Loss Given Default (%)
    ead: { type: Number }, // Exposure at Default (₹)
    expectedLoss: { type: Number }, // EL = PD * LGD * EAD
    
    // 🏦 COLLABORATIVE WORKFLOW DYNAMICS
    regulatorySignature: { type: String },
    isRegulatorySigned: { type: Boolean, default: false },
    regulatorySignedAt: { type: Date },
    disbursementDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String }
    },
    officerDecision: { type: String, enum: ["Pending", "Approved", "Rejected", "Under Review"], default: "Pending" },
    auditorDecision: { type: String, enum: ["Pending", "Approved", "Rejected", "Flagged"], default: "Pending" },
    chatLog: [
      {
        sender: { type: String }, // 'Loan Officer' or 'Compliance Auditor'
        message: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    meetings: [
      {
        scheduledBy: { type: String },
        date: { type: String },
        time: { type: String },
        link: { type: String },
        reason: { type: String },
        status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" }
      }
    ],
    moms: [
      {
        createdBy: { type: String },
        summary: { type: String },
        decision: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);