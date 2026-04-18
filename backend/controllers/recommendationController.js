const Bank = require("../models/Bank");

// @desc    Get recommended banks based on criteria
// @route   POST /api/recommend
// @access  Public
const getRecommendations = async (req, res) => {
    try {
        const { loanType, loanAmount, tenureYears, creditScore } = req.body;

        if (!loanType || !loanAmount || !tenureYears || !creditScore) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // 1. Filter eligible banks
        // - Must support the loan type
        // - Loan amount <= Bank's max limit
        // - Credit score >= Bank's min requirement
        const eligibleBanks = await Bank.find({
            loanTypes: loanType,
            maxLoanAmount: { $gte: loanAmount },
            minCreditScore: { $lte: creditScore },
            "tenureRange.min": { $lte: tenureYears },
            "tenureRange.max": { $gte: tenureYears },
        });

        if (eligibleBanks.length === 0) {
            return res.status(200).json([]); // No banks found
        }

        // 2. Calculate Score for each bank
        // Formula: Score = (Interest * W1) + (Fee * W2)
        // We want the LOWEST score (Lower interest & fee is better)

        // Weights (Customizable)
        const W_INTEREST = 10;
        const W_FEE = 1;

        const scoredBanks = eligibleBanks.map((bank) => {
            // Simple formula: Lower is better
            const score = (bank.baseInterestRate * W_INTEREST) + (bank.processingFee * W_FEE);

            return {
                ...bank.toObject(), // Convert Mongoose document to plain object
                matchScore: score,
            };
        });

        // 3. Sort by Score (Ascending -> Lowest score first)
        scoredBanks.sort((a, b) => a.matchScore - b.matchScore);

        // Return top 5 recommendations
        res.status(200).json(scoredBanks.slice(0, 5));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getRecommendations };
