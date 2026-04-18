require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected to:", process.env.MONGO_URI))
  .catch(err => { console.error("❌ Connection failed:", err.message); process.exit(1); });

async function resetUsers() {
  try {
    const User = require("./models/User");
    
    // COMPLETELY DELETE all existing users first
    const deleteResult = await User.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing users`);
    
    const salt = await bcrypt.genSalt(10);
    
    const users = [
      { name: "Enterprise Auditor",   email: "auditor@bank.com",    password: "auditor123",  role: "compliance_auditor" },
      { name: "Senior Loan Officer",  email: "officer@bank.com",    password: "officer123",  role: "loan_officer" },
      { name: "John Doe Applicant",   email: "applicant@test.com",  password: "applicant123", role: "applicant" },
      { name: "Admin User",           email: "admin@credify.com",   password: "admin123",    role: "admin" },
    ];
    
    for (const u of users) {
      const hashedPw = await bcrypt.hash(u.password, salt);
      await User.create({ name: u.name, email: u.email, password: hashedPw, role: u.role });
      console.log(`✅ Created: ${u.email} (password: ${u.password}) role: ${u.role}`);
    }
    
    console.log("\n🎉 All users reset successfully! Use these credentials:");
    console.log("  Auditor:    auditor@bank.com   / auditor123");
    console.log("  Officer:    officer@bank.com   / officer123");
    console.log("  Applicant:  applicant@test.com / applicant123");
    console.log("  Admin:      admin@credify.com  / admin123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset failed:", error.message);
    process.exit(1);
  }
}

resetUsers();
