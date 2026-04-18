require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Bank = require("./models/Bank");
const Application = require("./models/Application");

// Load the exact Mongo URI from .env
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/loan-aggregator")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error connecting:", err));

async function seed() {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("auditor123", salt);
    
    await User.findOneAndUpdate(
      { email: "auditor@bank.com" }, 
      { name: "Enterprise Auditor", email: "auditor@bank.com", password, role: "compliance_auditor" }, 
      { upsert: true, new: true }
    );

    // Also ensure a loan officer exists
    const officerPass = await bcrypt.hash("officer123", salt);
    await User.findOneAndUpdate(
      { email: "officer@bank.com" }, 
      { name: "Senior Loan Officer", email: "officer@bank.com", password: officerPass, role: "loan_officer" }, 
      { upsert: true, new: true }
    );
    
    // Seed a dummy Application so the dashboard has data
    const dummyApplicant = await User.findOneAndUpdate(
      { email: "applicant@test.com" },
      { name: "John Doe", email: "applicant@test.com", password: officerPass, role: "applicant" },
      { upsert: true, new: true }
    );

    const dummyBank = await Bank.findOneAndUpdate(
      { name: "HDFC Enterprise Bank" },
      { name: "HDFC Enterprise Bank", type: "Private", baseInterestRate: 8.5 },
      { upsert: true, new: true }
    );

    await Application.findOneAndUpdate(
      { userId: dummyApplicant._id, bankId: dummyBank._id },
      {
        userId: dummyApplicant._id,
        bankId: dummyBank._id,
        loanType: "Home Loan",
        loanAmount: 4500000,
        tenure: 180,
        status: "Pending",
        aiScore: 78,
        riskGrade: "A",
        debtToIncomeRatio: 34,
        documents: [ { fileName: "Aadhar_KYC.pdf", verified: true }, { fileName: "ITR_2023.pdf", verified: true } ],
        meetings: [],
        moms: []
      },
      { upsert: true, new: true }
    );
    
    console.log("✅ Seed complete! Auditor created (auditor@bank.com). Officer created (officer@bank.com).");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
