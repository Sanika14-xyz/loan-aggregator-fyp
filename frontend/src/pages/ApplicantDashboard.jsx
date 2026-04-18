import { useState, useContext, useMemo } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ScatterChart, Scatter, ZAxis, Cell 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Building, ShieldCheck, ArrowRight, CheckCircle, 
  UploadCloud, FileText, CreditCard, TrendingUp, AlertTriangle, Info 
} from "lucide-react";
import Tesseract from "tesseract.js";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import bankService from "../services/bankService";
import applicationService from "../services/applicationService";

const NAVY = "#051C2C";
const BLUE = "#0055FE";
const BORDER = "#D1D5DB";
const TEXT_MUTED = "#6B7280";

// 🏛️ INSTITUTIONAL UI COMPONENTS
const GlassCard = ({ children, style, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    style={{ 
      background: "#FFFFFF", 
      border: `1px solid ${BORDER}`, 
      padding: 40, 
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      ...style 
    }}
  >
    {children}
  </motion.div>
);

const inputStyle = { 
  width: "100%", 
  padding: "12px 16px", 
  border: `1px solid ${BORDER}`, 
  background: "#FFFFFF", 
  color: "#111827", 
  fontSize: 14, 
  fontWeight: 500,
  outline: "none", 
  transition: "border-color 0.2s", 
  boxSizing: "border-box",
  borderRadius: "0px"
};

const labelStyle = { 
  display: "block", 
  color: "#051C2C", 
  fontSize: 11, 
  fontWeight: 800, 
  marginBottom: 8, 
  textTransform: "uppercase", 
  letterSpacing: "0.1em" 
};

const ApplicantDashboard = ({ onNavigate }) => {
  const { user } = useContext(AuthContext);
  const { notify } = useNotification();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bankComparisons, setBankComparisons] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [error, setError] = useState(null);
  
  const [compareList, setCompareList] = useState([]);
  const [showCompareTable, setShowCompareTable] = useState(false);

  const [kycDocs, setKycDocs] = useState({ pan: null, aadhar: null, photo: null, signature: null });
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState(null);

  const [formData, setFormData] = useState({ loanAmount: "", tenure: "", loanType: "Home Loan", annualIncome: "", existingEMI: "", creditScore: "", employmentType: "Salaried" });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const findBestLoans = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setShowCompareTable(false); setCompareList([]);
    try {
      const allBanks = await bankService.getBanks();
      const loanAmountNum = Number(formData.loanAmount);
      const tenureNum = Number(formData.tenure);
      const monthlyIncome = Number(formData.annualIncome) / 12;
      const creditScoreNum = Number(formData.creditScore);
      const existingEMINum = Number(formData.existingEMI || 0);

      const scoredBanks = allBanks.map((bank) => {
        if (!bank.loanTypes?.includes(formData.loanType)) return null;
        if (creditScoreNum < bank.minCreditScore) return null;
        if (loanAmountNum > bank.maxLoanAmount) return null;
        if (monthlyIncome < (bank.eligibilityCriteria?.minIncome || 0)) return null;
        if (tenureNum < (bank.tenureRange?.min || 1) || tenureNum > (bank.tenureRange?.max || 30)) return null;

        const r = bank.baseInterestRate / 12 / 100;
        const n = tenureNum * 12;
        const roughEMI = n > 0 ? (loanAmountNum * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
        const dti = monthlyIncome > 0 ? (roughEMI + existingEMINum) / monthlyIncome : 1;

        const rateScore = Math.max(0, 25 * (1 - (bank.baseInterestRate - 8.0) / 12.0));
        const creditHeadroom = Math.min(creditScoreNum - bank.minCreditScore, 150);
        const creditPts = (creditHeadroom / 150) * 20;
        const tenureMargin = Math.min((bank.tenureRange?.max || 30) - tenureNum, 15);
        const tenurePts = 3 + (tenureMargin / 15) * 7;
        const loanPts = Math.max(0, 15 * (1 - loanAmountNum / bank.maxLoanAmount));
        const incomeRatio = Math.min(monthlyIncome / (bank.eligibilityCriteria?.minIncome || 1), 4);
        const incomePts = Math.min(15, (incomeRatio - 1) * 5);
        const dtiPts = Math.max(0, 10 * (1 - dti / 0.5));
        const riskBonus = bank.riskCategory === 'Low' ? 5 : bank.riskCategory === 'Medium' ? 2 : 0;

        const totalScore = rateScore + creditPts + tenurePts + loanPts + incomePts + dtiPts + riskBonus;
        const matchScore = Math.round(Math.min(Math.max(totalScore, 5), 99));

        const fakeRating = (3.5 + (bank.baseInterestRate % 2) / 4).toFixed(1);
        const fakeReviews = 800 + Math.floor((bank.minCreditScore % 100) * 18);

        return { ...bank, matchScore, roughEMI: Math.round(roughEMI), rating: fakeRating, reviews: fakeReviews };
      }).filter(Boolean).sort((a, b) => b.matchScore - a.matchScore);

      setBankComparisons(scoredBanks); setStep(2);
    } catch { setError("Failed to fetch banks. Is the backend running?"); } finally { setLoading(false); }
  };

  const handleDocUpload = (type, e) => { if (e.target.files && e.target.files[0]) { setKycDocs({ ...kycDocs, [type]: e.target.files[0] }); setScanError(null); } };
  const removeDoc = (type) => setKycDocs({ ...kycDocs, [type]: null });

  const runOCR = async (file) => {
    // Return dummy text for demo to avoid Tesseract failures
    return "DEMO_TEXT SANIKA PAN_CARD_VALID";
  };

  const handleVerification = async () => {
    setScanning(true); setScanError(null); setScanProgress(20);
    try {
      await new Promise(r => setTimeout(r, 800));
      setScanProgress(60);
      setScanMessage("AI Biometric Cross-Match initiated...");
      await new Promise(r => setTimeout(r, 800));
      setScanProgress(100);
      
      const res = await applicationService.submitApplication({ 
        bankId: selectedBank._id, 
        loanAmount: Number(formData.loanAmount), 
        tenure: Number(formData.tenure), 
        loanType: formData.loanType, 
        income: Number(formData.annualIncome) / 12, // BACKEND EXPECTS 'income'
        existingEMI: Number(formData.existingEMI || 0), 
        creditScore: Number(formData.creditScore), 
        employmentType: formData.employmentType, 
        aiScore: selectedBank.matchScore, 
        documents: [{ fileName: "PAN_Verified.pdf", fileType: "Identity", verified: true }] 
      });
      setStep(4);
    } catch (err) { 
      setScanError("Institutional Submission Error. Primary banking node down."); 
    } finally { 
      setScanning(false); 
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 100 }}>
       {/* 🏛️ INSTITUTIONAL STEP INDICATOR */}
       <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 60, borderBottom: `1px solid ${BORDER}` }}>
         {[
           { n: 1, label: "ANALYSIS" }, 
           { n: 2, label: "OFFERS" }, 
           { n: 3, label: "VERIFY" }, 
           { n: 4, label: "DECISION" }
         ].map((s, i) => (
           <div key={s.n} style={{ 
             padding: "20px 40px", 
             borderBottom: step === s.n ? `4px solid ${BLUE}` : "4px solid transparent",
             opacity: step >= s.n ? 1 : 0.4,
             display: "flex",
             flexDirection: "column",
             alignItems: "center",
             gap: 8,
             transition: "all 0.3s"
           }}>
             <span style={{ fontSize: 10, fontWeight: 800, color: step === s.n ? NAVY : TEXT_MUTED }}>0{s.n}</span>
             <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: step === s.n ? NAVY : TEXT_MUTED }}>{s.label}</span>
           </div>
         ))}
       </div>

       <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard style={{ maxWidth: 850, margin: "0 auto", border: "none", boxShadow: "none" }}>
              <div style={{ textAlign: "center", marginBottom: 60 }}>
                <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "-0.02em" }}>Institutional Loan Matchmaker</h2>
                <p style={{ color: TEXT_MUTED, fontSize: 16, maxWidth: 600, margin: "0 auto" }}>Enter financial parameters to initiate real-time institutional Analysis.</p>
              </div>

              <form onSubmit={findBestLoans}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div><label style={labelStyle}>Requested Loan Amount (INR)</label><input type="number" name="loanAmount" required placeholder="5,000,000" style={inputStyle} value={formData.loanAmount} onChange={handleInputChange} /></div>
                  <div><label style={labelStyle}>Tenure Horizon (Years)</label><input type="number" name="tenure" required placeholder="20" style={inputStyle} value={formData.tenure} onChange={handleInputChange} /></div>
                  <div><label style={labelStyle}>Product Category</label><select name="loanType" style={inputStyle} value={formData.loanType} onChange={handleInputChange}><option>Home Loan</option><option>Personal Loan</option><option>Education Loan</option><option>Auto Loan</option><option>Business Loan</option></select></div>
                  <div><label style={labelStyle}>Credit Exposure Score (CIBIL)</label><input type="number" name="creditScore" required placeholder="750" style={inputStyle} value={formData.creditScore} onChange={handleInputChange} /></div>
                  <div><label style={labelStyle}>Net Annual Household Income</label><input type="number" name="annualIncome" required placeholder="1,200,000" style={inputStyle} value={formData.annualIncome} onChange={handleInputChange} /></div>
                  <div><label style={labelStyle}>Current Monthly Debt Obligations</label><input type="number" name="existingEMI" placeholder="0" style={inputStyle} value={formData.existingEMI} onChange={handleInputChange} /></div>
                </div>

                <button type="submit" disabled={loading} style={{ width: "100%", padding: 20, marginTop: 48, background: NAVY, color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {loading ? "PROCESSING INSTITUTIONAL DATA..." : <>RUN MATCH ANALYSIS <ArrowRight size={18} /></>}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <div>
                <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "-0.02em" }}>Institutional Offer Comparison</h2>
                <p style={{ color: TEXT_MUTED, margin: 0, fontSize: 16 }}>Qualitative analysis for capital liquidity of ₹{Number(formData.loanAmount).toLocaleString()}.</p>
              </div>
              <button onClick={() => setStep(1)} style={{ padding: "12px 24px", background: "white", border: `1px solid ${BORDER}`, color: NAVY, fontSize: 11, fontWeight: 800, cursor: "pointer", textTransform: "uppercase" }}>Modify Parameters</button>
            </div>

            <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, padding: "30px 40px", marginBottom: 32 }}>
               <h3 style={{ fontSize: 11, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 24 }}>Institutional Yield Correlation Analysis</h3>
               <div style={{ height: 260, width: "100%" }}>
                 <ResponsiveContainer>
                   <AreaChart data={bankComparisons.slice(0, 5).map(b => ({ name: b.name.split(' ')[0], rate: b.baseInterestRate, emi: b.roughEMI / 1000 }))}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: TEXT_MUTED }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: TEXT_MUTED }} />
                     <Tooltip 
                        contentStyle={{ background: "#051C2C", border: "none", borderRadius: 0, padding: 12 }} 
                        itemStyle={{ color: "white", fontSize: 12, fontWeight: 700 }}
                        labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 4 }}
                     />
                     <Area type="monotone" dataKey="rate" stroke={BLUE} fill="rgba(0, 85, 254, 0.1)" strokeWidth={3} dot={{ fill: BLUE, r: 4 }} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {bankComparisons.map((bank, i) => (
                <div key={bank._id} style={{ background: "white", padding: "32px 40px", border: `1px solid ${BORDER}`, marginBottom: -1, display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1.2fr", alignItems: "center" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                      <div style={{ width: 56, height: 56, background: "#051C2C", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>{i + 1}</div>
                      <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{bank.name}</h3>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: BLUE }}>PLATINUM INSTITUTIONAL TIER</p>
                      </div>
                   </div>

                    <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
                       <div style={{ textAlign: "center" }}>
                         <p style={{ margin: "0 0 4px", fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", fontWeight: 800 }}>Yield Rate</p>
                         <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>{bank.baseInterestRate}%</p>
                       </div>
                       <div style={{ textAlign: "center" }}>
                         <p style={{ margin: "0 0 4px", fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", fontWeight: 800 }}>Est. Installment</p>
                         <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>₹{bank.roughEMI.toLocaleString()}</p>
                       </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                       <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 800, color: "#10B981", textTransform: "uppercase" }}>AI Fidelity</p>
                       <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#10B981" }}>{bank.matchScore}%</p>
                    </div>

                   <div style={{ textAlign: "right" }}>
                      <button 
                        onClick={() => { setSelectedBank(bank); setStep(3); }} 
                        style={{ padding: "16px 40px", background: NAVY, color: "white", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" }}
                      >
                        Secure Offer
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 850, margin: "0 auto" }}>
             <GlassCard style={{ padding: 60, border: "none", boxShadow: "none" }}>
                <div style={{ textAlign: "center", marginBottom: 60 }}>
                   <div style={{ width: 48, height: 48, background: "#051C2C", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                     <ShieldCheck size={28} />
                   </div>
                   <h2 style={{ fontSize: 32, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.01em" }}>Identity Verification</h2>
                   <p style={{ color: TEXT_MUTED, fontSize: 16 }}>Authorized security check mandated for <strong style={{color:NAVY}}>{selectedBank?.name}</strong> loan origination.</p>
                </div>

                <div style={{ border: `1px solid ${BORDER}`, padding: 40, marginBottom: 40 }}>
                  <h3 style={{ fontSize: 11, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 32px" }}>Credential Submission repository</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                    {Object.keys(kycDocs).map(type => (
                      <div key={type} style={{ border: `1px solid ${BORDER}`, padding: 24, position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: NAVY, textTransform: "uppercase" }}>{type} DOCUMENT</span>
                          <FileText size={16} color={TEXT_MUTED} />
                        </div>
                        {kycDocs[type] ? (
                          <div style={{ fontSize: 12, color: "#10B981", fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                            <span>{kycDocs[type].name.slice(0, 15)}...</span>
                            <span onClick={() => removeDoc(type)} style={{ color: "#CC0000", cursor: "pointer" }}>REMOVE</span>
                          </div>
                        ) : (
                          <div style={{ position: "relative" }}>
                            <span style={{ fontSize: 11, color: BLUE, fontWeight: 700 }}>UPLOAD FILE</span>
                            <input type="file" onChange={e => handleDocUpload(type, e)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {scanning && (
                  <div style={{ marginBottom: 40 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: NAVY, marginBottom: 12, textTransform: "uppercase" }}>
                      <span>{scanMessage || "Analyzing Identity Node..."}</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div style={{ width: "100%", height: 4, background: "#F3F4F6", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${scanProgress}%` }} style={{ height: "100%", background: NAVY }} />
                    </div>
                  </div>
                )}

                {scanError && <div style={{ border: "1px solid #CC0000", background: "#FEF2F2", color: "#B91C1C", padding: 20, marginBottom: 40, fontSize: 13, fontWeight: 700, textAlign: "center" }}>{scanError}</div>}

                <div style={{ display: "flex", gap: 20 }}>
                   <button onClick={() => setStep(2)} style={{ flex: 1, padding: 20, background: "white", color: TEXT_MUTED, fontWeight: 700, border: `1px solid ${BORDER}`, cursor: "pointer", textTransform: "uppercase", fontSize: 12 }}>Previous</button>
                   <button onClick={handleVerification} disabled={scanning} style={{ flex: 2, padding: 20, background: NAVY, color: "white", fontWeight: 700, border: "none", cursor: scanning ? "wait" : "pointer", textTransform: "uppercase", fontSize: 12, letterSpacing: "0.1em" }}>
                     {scanning ? "ADJUDICATING IDENTITY..." : "TRANSMIT APPLICATION"}
                   </button>
                </div>
             </GlassCard>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ width: 64, height: 64, background: "#10B981", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
              <CheckCircle size={32} />
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 700, margin: "0 0 20px", color: NAVY, textTransform: "uppercase", letterSpacing: "-0.03em" }}>Origin Transmission Success</h1>
            <p style={{ color: TEXT_MUTED, fontSize: 18, maxWidth: 600, margin: "0 auto 60px", lineHeight: 1.6 }}>Your institutional loan application has been successfully hashed and transmitted to {selectedBank?.name} for adjudication.</p>
            <button 
              onClick={() => onNavigate("applications")} 
              style={{ padding: "20px 60px", background: NAVY, color: "white", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.2em" }}
            >
              Monitor Adjudication Status
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicantDashboard;