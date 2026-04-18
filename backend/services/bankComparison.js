const calculateLoanDecision = require("./loanEngine");

const compareBanks = (user, banks) => {
    const results = banks.map(bank =>
        calculateLoanDecision(user, bank)
    );

    // Sort by highest approval probability
    return results.sort(
        (a, b) => b.approvalProbability - a.approvalProbability
    );
};

module.exports = compareBanks;
