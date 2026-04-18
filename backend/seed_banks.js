const banks = [
  // -------- REALISTIC INDIAN BANKS --------
  {
    name: "HDFC Bank",
    type: "Private",
    riskCategory: "Low",
    baseInterestRate: 8.3,
    processingFee: 0.5,
    maxLoanAmount: 15000000,
    minCreditScore: 750,
    loanTypes: [
      "Home Loan",
      "Car Loan",
      "Personal Loan",
      "Education Loan",
      "Business Loan",
      "Gold Loan",
      "Loan Against Property",
    ],
    tenureRange: { min: 1, max: 30 },
    eligibilityCriteria: { minIncome: 30000 },
  },
  {
    name: "State Bank of India",
    type: "Public",
    riskCategory: "Low",
    baseInterestRate: 8.1,
    processingFee: 0.3,
    maxLoanAmount: 20000000,
    minCreditScore: 720,
    loanTypes: [
      "Home Loan",
      "Car Loan",
      "Personal Loan",
      "Education Loan",
      "Business Loan",
      "Gold Loan",
      "Loan Against Property",
    ],
    tenureRange: { min: 1, max: 30 },
    eligibilityCriteria: { minIncome: 25000 },
  },
  {
    name: "ICICI Bank",
    type: "Private",
    riskCategory: "Medium",
    baseInterestRate: 9.0,
    processingFee: 1.0,
    maxLoanAmount: 15000000,
    minCreditScore: 700,
    loanTypes: [
      "Home Loan",
      "Car Loan",
      "Personal Loan",
      "Education Loan",
      "Business Loan",
      "Gold Loan",
      "Loan Against Property",
    ],
    tenureRange: { min: 1, max: 25 },
    eligibilityCriteria: { minIncome: 30000 },
  },
  {
    name: "Axis Bank",
    type: "Private",
    riskCategory: "Medium",
    baseInterestRate: 9.2,
    processingFee: 1.2,
    maxLoanAmount: 12000000,
    minCreditScore: 680,
    loanTypes: [
      "Home Loan",
      "Car Loan",
      "Personal Loan",
      "Education Loan",
      "Business Loan",
      "Gold Loan",
      "Loan Against Property",
    ],
    tenureRange: { min: 1, max: 20 },
    eligibilityCriteria: { minIncome: 28000 },
  },
  {
    name: "Punjab National Bank",
    type: "Public",
    riskCategory: "Low",
    baseInterestRate: 8.4,
    processingFee: 0.4,
    maxLoanAmount: 18000000,
    minCreditScore: 710,
    loanTypes: [
      "Home Loan",
      "Car Loan",
      "Personal Loan",
      "Education Loan",
      "Business Loan",
      "Gold Loan",
      "Loan Against Property",
    ],
    tenureRange: { min: 1, max: 30 },
    eligibilityCriteria: { minIncome: 22000 },
  },

  // -------- AUTO-GENERATED DUMMY BANKS WITH RISK LEVEL --------
  ...Array.from({ length: 55 }, (_, i) => {
    const riskLevels = ["Low", "Medium", "High"];
    const risk = riskLevels[i % 3];

    return {
      name: `FinTrust Bank ${i + 1}`,
      type: i % 2 === 0 ? "Private" : "NBFC",
      riskCategory: risk,
      baseInterestRate:
        risk === "Low"
          ? 8 + (i % 3) * 0.3
          : risk === "Medium"
          ? 9 + (i % 3) * 0.5
          : 11 + (i % 3) * 0.7,
      processingFee:
        risk === "Low"
          ? 0.3
          : risk === "Medium"
          ? 1.0
          : 2.0,
      maxLoanAmount:
        risk === "Low"
          ? 20000000
          : risk === "Medium"
          ? 15000000
          : 8000000,
      minCreditScore:
        risk === "Low"
          ? 750
          : risk === "Medium"
          ? 680
          : 600,
      loanTypes: [
        "Home Loan",
        "Car Loan",
        "Personal Loan",
        "Education Loan",
        "Business Loan",
        "Gold Loan",
        "Loan Against Property",
      ],
      tenureRange: {
        min: 1,
        max: risk === "High" ? 10 : 30,
      },
      eligibilityCriteria: {
        minIncome:
          risk === "Low"
            ? 35000
            : risk === "Medium"
            ? 25000
            : 15000,
      },
    };
  }),
];
