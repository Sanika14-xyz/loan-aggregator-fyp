const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config({ path: "./.env" });

const seedOfficer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/credify");
    console.log("MongoDB Connected");

    const email = "officer@credify.com";
    const password = "officerpassword123";

    // Check if exists
    let officer = await User.findOne({ email });
    if (officer) {
      console.log(`Loan Officer already exists with email: ${email}`);
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    officer = await User.create({
      name: "Senior Loan Officer",
      email: email,
      password: hashedPassword,
      role: "loan_officer",
    });

    console.log("✅ Successfully created Loan Officer Account!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit();
  } catch (error) {
    console.error("Error creating Officer:", error);
    process.exit(1);
  }
};

seedOfficer();
