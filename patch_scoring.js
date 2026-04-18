const fs = require('fs');
const filePath = 'c:/Users/Sanika/OneDrive/Desktop/loan-aggregator-fyp/frontend/src/pages/ApplicantDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find exact start and end markers
const startMarker = '      const scoredBanks = allBanks.map((bank) => {';
const endMarker = '}).filter((b) => b.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker) + endMarker.length;

if (startIdx === -1 || endIdx === -1) {
  console.log('ERROR: Markers not found. startIdx=', startIdx, 'endIdx=', endIdx);
  process.exit(1);
}

const newCode = `      const scoredBanks = allBanks.map((bank) => {
        // Hard eligibility filters — immediately reject ineligible banks
        if (!bank.loanTypes?.includes(formData.loanType)) return null;
        if (creditScoreNum < bank.minCreditScore) return null;
        if (loanAmountNum > bank.maxLoanAmount) return null;
        if (monthlyIncome < (bank.eligibilityCriteria?.minIncome || 0)) return null;
        if (tenureNum < (bank.tenureRange?.min || 1) || tenureNum > (bank.tenureRange?.max || 30)) return null;

        // EMI calculation
        const r = bank.baseInterestRate / 12 / 100;
        const n = tenureNum * 12;
        const roughEMI = n > 0 ? (loanAmountNum * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
        const dti = monthlyIncome > 0 ? (roughEMI + existingEMINum) / monthlyIncome : 1;

        // PROPORTIONAL SCORING — each factor is graduated, not binary, so scores differ per bank
        // 1. Interest Rate (25 pts): lower rate = higher score. Best ~8%, worst ~20%
        const rateScore = Math.max(0, 25 * (1 - (bank.baseInterestRate - 8.0) / 12.0));
        // 2. Credit Score Headroom (20 pts): surplus above bank minimum, max benefit at +150 pts
        const creditHeadroom = Math.min(creditScoreNum - bank.minCreditScore, 150);
        const creditPts = (creditHeadroom / 150) * 20;
        // 3. Tenure Fit (10 pts): more buffer below bank's max tenure = better
        const tenureMargin = Math.min((bank.tenureRange?.max || 30) - tenureNum, 15);
        const tenurePts = 3 + (tenureMargin / 15) * 7;
        // 4. Loan Coverage (15 pts): borrowing a smaller fraction of max loan = better fit
        const loanPts = Math.max(0, 15 * (1 - loanAmountNum / bank.maxLoanAmount));
        // 5. Income Adequacy (15 pts): higher income ratio above minimum = better
        const incomeRatio = Math.min(monthlyIncome / (bank.eligibilityCriteria?.minIncome || 1), 4);
        const incomePts = Math.min(15, (incomeRatio - 1) * 5);
        // 6. DTI Safety (10 pts): lower debt-to-income ratio = better
        const dtiPts = Math.max(0, 10 * (1 - dti / 0.5));
        // 7. Risk Category Bonus (5 pts): low-risk banks score higher
        const riskBonus = bank.riskCategory === 'Low' ? 5 : bank.riskCategory === 'Medium' ? 2 : 0;

        const totalScore = rateScore + creditPts + tenurePts + loanPts + incomePts + dtiPts + riskBonus;
        const matchScore = Math.round(Math.min(Math.max(totalScore, 5), 99));

        const fakeRating = (3.5 + (bank.baseInterestRate % 2) / 4).toFixed(1);
        const fakeReviews = 800 + Math.floor((bank.minCreditScore % 100) * 18);

        return { ...bank, matchScore, roughEMI: Math.round(roughEMI), rating: fakeRating, reviews: fakeReviews };
      }).filter(Boolean).sort((a, b) => b.matchScore - a.matchScore);`;

content = content.slice(0, startIdx) + newCode + content.slice(endIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: Scoring logic updated. File saved.');
