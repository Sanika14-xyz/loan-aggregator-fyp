const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        type: {
            type: String, // Public, Private, NBFC
            required: true,
        },
        riskCategory: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        baseInterestRate: {
            type: Number,
            required: true,
        },
        processingFee: {
            type: Number,
            required: true,
        },
        maxLoanAmount: {
            type: Number,
            required: true,
        },
        minCreditScore: {
            type: Number, // e.g., 650, 750
            required: true,
        },
        loanTypes: [
            {
                type: String,
                enum: ["Home Loan", "Car Loan", "Personal Loan", "Education Loan", "Business Loan", "Gold Loan", "Loan Against Property"],
            },
        ],
        // Additional fields for comparison logic
        tenureRange: {
            min: { type: Number, required: true }, // in years
            max: { type: Number, required: true }, // in years
        },
        eligibilityCriteria: {
            minIncome: { type: Number, required: true },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
