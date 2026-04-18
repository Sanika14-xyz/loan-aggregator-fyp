const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");

// POST: Submit a new loan application
router.post("/apply", async (req, res) => {
  try {
    const { email, amount, tenure, income } = req.body;
    
    console.log(`🏦 NEW LOAN APP RECEIVED FROM: ${email}`);
    
    // Save to MongoDB
    const newLoan = await Loan.create({
      email,
      amount,
      tenure,
      income
    });

    res.status(201).json({ 
      message: "Loan application received successfully", 
      loanId: newLoan._id 
    });

  } catch (error) {
    console.error("Loan Application Error:", error);
    res.status(500).json({ message: "Server error processing loan" });
  }
});

module.exports = router;