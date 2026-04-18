const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["applicant", "admin", "loan_officer", "risk_manager", "compliance_auditor"],
            default: "applicant",
        },
        phoneNumber: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
