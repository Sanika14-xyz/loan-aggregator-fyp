const handleChatQuery = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Please ask a question." });

    const lowerMsg = message.toLowerCase();
    let reply = "I am the Credify Assistant. I can help you compare loans, check eligibility, or explain our AI scoring system. How can I help?";

    // 🚀 VIVA DEMO SAFEGUARD: Smart Keyword Matching
    // This ensures your bot works perfectly during the presentation without needing a paid API key!
    if (lowerMsg.includes("interest rate") || lowerMsg.includes("rates")) {
      reply = "Our partner banks offer interest rates starting from as low as 8.1% p.a. for Home Loans and 10.5% p.a. for Personal Loans. The exact rate depends on your AI Match Score!";
    } else if (lowerMsg.includes("documents") || lowerMsg.includes("kyc")) {
      reply = "To apply, you will need to upload your PAN Card, Aadhar Card, a recent photograph, and your signature. Our e-KYC AI will verify these automatically.";
    } else if (lowerMsg.includes("fraud") || lowerMsg.includes("secure")) {
      reply = "We take security seriously! Our system uses Optical Character Recognition (OCR) to detect tampered documents and mismatching names before applications are sent to the auditor.";
    } else if (lowerMsg.includes("credit score") || lowerMsg.includes("cibil")) {
      reply = "A credit score of 750 or above usually unlocks the best interest rates. Our AI also considers your debt-to-income ratio to calculate your final risk grade.";
    } else if (lowerMsg.includes("how does this work") || lowerMsg.includes("ai")) {
      reply = "Our engine analyzes your profile against 60+ banks simultaneously. It calculates an 'AI Match Score' out of 100 based on your eligibility, credit score, and income to find your perfect loan.";
    }

    // NOTE: If you want to use a real API later, you would make the axios call to the API here
    // and replace 'reply' with the API's response.

    // Simulate a slight delay so it feels like the AI is "typing"
    setTimeout(() => {
      res.json({ reply });
    }, 1000);

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ reply: "I'm currently experiencing technical difficulties. Please try again later." });
  }
};

module.exports = { handleChatQuery };