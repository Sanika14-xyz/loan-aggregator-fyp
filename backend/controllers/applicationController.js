const crypto = require("crypto");
const Application = require("../models/Application");
const AuditLog = require("../models/AuditLog");
const Bank = require("../models/Bank");
const calculateLoanDecision = require("../services/loanEngine");
const sendEmail = require("../services/emailService");

// 🔒 HELPER: Cryptographic Blockchain Hash Generator
const createSecureAuditLog = async (logData) => {
  const lastLog = await AuditLog.findOne().sort({ timestamp: -1 });
  const prevHash = lastLog ? lastLog.currentHash : "GENESIS_BLOCK";
  const dataString = `${logData.applicationId}-${logData.action}-${logData.performedBy}-${prevHash}-${Date.now()}`;
  const currentHash = crypto.createHash("sha256").update(dataString).digest("hex");

  await AuditLog.create({
    ...logData,
    previousHash: prevHash,
    currentHash: currentHash
  });
};

const submitApplication = async (req, res) => {
  try {
    const { bankId, loanAmount, tenure, loanType, employmentType, income, existingEMI, creditScore, documents } = req.body;
    
    if (!bankId || !loanAmount || !tenure || !loanType || !income || !creditScore)
      return res.status(400).json({ message: "Please provide all required fields" });

    const bank = await Bank.findById(bankId);
    if (!bank) return res.status(404).json({ message: "Bank not found" });

    const userProfile = {
      income: Number(income), creditScore: Number(creditScore),
      loanAmount: Number(loanAmount), tenure: Number(tenure),
      loanType, existingEMI: Number(existingEMI || 0),
      employmentType: employmentType || "Salaried",
    };

    const decision = calculateLoanDecision(userProfile, bank);

    const application = await Application.create({
      userId: req.user.id, bankId: bank._id, loanType,
      loanAmount: Number(loanAmount), tenure: Number(tenure),
      status: decision.approved ? "Approved" : "Rejected",
      aiScore: Number(decision.approvalProbability),
      riskGrade: decision.creditGrade, emi: Number(decision.emi),
      fraudFlag: decision.fraudFlag, defaultProbability: decision.defaultProbability,
      remarks: decision.approved ? "AI System Approved" : decision.reason || "AI System Rejected",
      documents: documents || [],
      pd: decision.pd,
      lgd: decision.lgd,
      ead: decision.ead,
      expectedLoss: decision.expectedLoss
    });

    // 🔒 SECURE AUDIT LOG
    await createSecureAuditLog({
      applicationId: application._id,
      action: decision.approved ? "Approved" : "Rejected",
      reason: decision.approved ? `High Approval Probability (${decision.approvalProbability}%)` : `Rejected by AI: ${decision.reason || "Risk Score too low"}`,
      performedBy: "System (AI)"
    });

    res.status(201).json({ message: "Application Processed", result: decision, applicationId: application._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("bankId", "name type baseInterestRate").sort({ createdAt: -1 });
    res.json(applications);
  } catch { res.status(500).json({ message: "Server Error" }); }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "name email").populate("bankId", "name").sort({ createdAt: -1 });
    res.json(applications);
  } catch { res.status(500).json({ message: "Server Error" }); }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate({ path: "applicationId", select: "loanAmount loanType status documents", populate: { path: "userId", select: "name email" } })
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch { res.status(500).json({ message: "Server Error" }); }
};

const getStats = async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const approved = await Application.countDocuments({ status: "Approved" });
    const rejected = await Application.countDocuments({ status: "Rejected" });
    const totalAmount = await Application.aggregate([{ $match: { status: "Approved" } }, { $group: { _id: null, total: { $sum: "$loanAmount" } } }]);
    res.json({ total, approved, rejected, totalDisbursed: totalAmount[0]?.total || 0 });
  } catch { res.status(500).json({ message: "Server Error" }); }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    const application = await Application.findById(req.params.id)
      .populate("userId", "name email")
      .populate("bankId", "name");
    
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Validate logic for what statuses are allowed and handle email contents accordingly
    application.status = status;
    if (remarks) application.remarks = remarks;
    await application.save();

    // 🔒 SECURE AUDIT LOG
    await createSecureAuditLog({
      applicationId: application._id,
      action: status === "Approved" ? "Approved" : "Rejected",
      reason: remarks || `Manually ${status.toLowerCase()} by officer`,
      performedBy: `${req.user.name} (${req.user.role})`
    });

    await sendEmail({
      email: application.userId.email,
      subject: `Loan Application ${status} - Credify 🏦`,
      html: `
        <div style="font-family: sans-serif; color: #0B1C3D; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: ${status === "Approved" ? "#10b981" : "#ef4444"};">Application ${status}</h2>
          <p>Hi ${application.userId.name},</p>
          <p>Your loan application for <strong>${application.bankId.name}</strong> has been officially <strong>${status}</strong> by our loan officers.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">Official Remarks:</p>
            <p style="margin: 5px 0 0; font-weight: bold;">${remarks || "Your profile and documents have been reviewed."}</p>
          </div>
        </div>
      `
    });

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getOfficerApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("bankId", "name")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("userId", "name email")
      .populate("bankId", "name");
    if (!application) return res.status(404).json({ message: "Not found" });
    res.json(application);
  } catch { res.status(500).json({ message: "Server Error" }); }
};

// 🏦 COLLABORATIVE: Live Chat Append
const addChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });
    application.chatLog.push({ sender: `${req.user.name} (${req.user.role === 'compliance_auditor' ? 'Auditor' : 'Officer'})`, message });
    await application.save();

    await createSecureAuditLog({
      applicationId: application._id, action: "CHAT_MESSAGE_SENT",
      reason: "Message logged in collaborative workspace", performedBy: `${req.user.name} (${req.user.role})`
    });

    res.json(application);
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
};

// 🏦 COLLABORATIVE: Meeting Scheduler
const scheduleMeeting = async (req, res) => {
  try {
    const { date, time, link, reason } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    application.meetings.push({ scheduledBy: req.user.name, date, time, link, reason });
    await application.save();

    await createSecureAuditLog({
      applicationId: application._id, action: "MEETING_SCHEDULED",
      reason: `Validation session booked for ${date} at ${time}`, performedBy: req.user.name
    });

    res.json(application);
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
};

// 🏦 COLLABORATIVE: Publish MOM
const publishMOM = async (req, res) => {
  try {
    const { summary, decision } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    application.moms.push({ createdBy: req.user.name, summary, decision });
    
    if (req.user.role === "compliance_auditor") application.auditorDecision = decision;
    if (req.user.role === "loan_officer") application.officerDecision = decision;
    
    // Consensus Engine
    if (application.auditorDecision === "Approved" && application.officerDecision === "Approved") application.status = "Approved";
    else if (application.auditorDecision === "Flagged" || application.officerDecision === "Under Review") application.status = "Under Review";
    else if (application.auditorDecision === "Rejected" || application.officerDecision === "Rejected") application.status = "Rejected";

    await application.save();

    await createSecureAuditLog({
      applicationId: application._id, action: "MOM_PUBLISHED",
      reason: `Minutes documented. Engine resolved status: ${application.status}`, performedBy: req.user.name
    });

    res.json(application);
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
};

// 🏦 COLLABORATIVE: Dual Decision Matrix
const updateDualDecision = async (req, res) => {
  try {
    const { decision } = req.body; 
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    if (req.user.role === "loan_officer") application.officerDecision = decision;
    if (req.user.role === "compliance_auditor") application.auditorDecision = decision;

    // Consensus Engine
    if (application.auditorDecision === "Approved" && application.officerDecision === "Approved") application.status = "Approved";
    else if (application.auditorDecision === "Flagged" || application.officerDecision === "Under Review") application.status = "Under Review";
    else if (application.auditorDecision === "Rejected" || application.officerDecision === "Rejected") application.status = "Rejected";

    await application.save();

    await createSecureAuditLog({
      applicationId: application._id, action: `DECISION_VOTED`,
      reason: `${req.user.role} voted ${decision}`, performedBy: req.user.name
    });

    res.json(application);
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
};

// 🏦 COLLABORATIVE: Regulatory Form Signing
const signRegulatoryForm = async (req, res) => {
  try {
    const { signature, bankDetails } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    if (application.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized signing attempt" });
    }

    application.isRegulatorySigned = true;
    application.regulatorySignature = signature;
    application.regulatorySignedAt = new Date();
    
    if (bankDetails) {
      application.disbursementDetails = bankDetails;
    }

    await application.save();

    await createSecureAuditLog({
      applicationId: application._id, action: "REGULATORY_FORM_SIGNED",
      reason: `Signed & Disbursement Account Registered`, performedBy: req.user.name
    });

    res.json(application);
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
};

module.exports = { 
  submitApplication, getMyApplications, getAllApplications, 
  getAuditLogs, getStats, updateApplicationStatus, getOfficerApplications, getApplicationById,
  addChatMessage, scheduleMeeting, publishMOM, updateDualDecision, signRegulatoryForm
};