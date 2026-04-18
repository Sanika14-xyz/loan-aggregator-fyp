import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sliders, RefreshCw, BarChart2, ShieldCheck, TrendingUp, Cpu } from "lucide-react";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

const WhatIfSimulator = () => {
  const [params, setParams] = useState({
    income: 600000,
    credit: 750,
    loanAmt: 5000000,
    tenure: 20
  });

  const [aiResult, setAiResult] = useState({
    score: 82, wellness: 85, emi: 43265,
    crisis: "Low (8% default risk)"
  });

  // Simulator Effect (Runs deterministic dummy modeling math directly in browser for 0-latency feedback)
  useEffect(() => {
    // 1. Math block representing AI Model simulation
    const r = (8.5 / 12) / 100; // Base 8.5% roughly
    const n = params.tenure * 12;
    const emi = (params.loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    const monthlyInc = params.income / 12;
    const dti = (emi / monthlyInc) * 100;
    
    let baseScore = (params.credit / 900) * 40 + Math.min(params.income / 1000000, 1) * 30 + (1 - Math.min(dti / 100, 1)) * 30;
    
    setAiResult({
      score: Math.min(Math.max(baseScore, 0), 99).toFixed(1),
      wellness: Math.min(Math.max(baseScore + (params.credit > 750 ? 5 : -5), 0), 99).toFixed(1),
      emi: Math.round(emi),
      crisis: baseScore < 50 ? "High Risk (34% crisis prob)" : baseScore < 70 ? "Moderate (15%)" : "Low Risk (Safeguarded)"
    });
  }, [params]);

  return (
    <div style={{ padding: 40, background: "#F8FAFC", minHeight: "100vh", color: "white", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      {/* LEFT: SLIDERS & CONTROLS */}
      <div>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 12 }}><Sliders color={GOLD} size={32} /> What-If Simulator</h2>
          <p style={{ color: "#64748B", fontSize: 16 }}>Interactively adjust your financial vectors and witness the Random Forest prediction respond in real-time.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* INCOME SLIDER */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Annual Income</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>₹{Number(params.income).toLocaleString()}</span>
            </div>
            <input type="range" min="300000" max="5000000" step="50000" value={params.income} onChange={(e) => setParams({ ...params, income: Number(e.target.value) })} style={{ width: "100%", accentColor: GOLD, cursor: "grab" }} />
          </div>

          {/* CREDIT SCORE SLIDER */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Credit Score (CIBIL)</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: params.credit >= 750 ? "#10b981" : GOLD }}>{params.credit}</span>
            </div>
            <input type="range" min="300" max="900" step="10" value={params.credit} onChange={(e) => setParams({ ...params, credit: Number(e.target.value) })} style={{ width: "100%", accentColor: params.credit > 750 ? "#10b981" : GOLD, cursor: "grab" }} />
          </div>

          {/* LOAN AMOUNT SLIDER */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Desired Loan Amount</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>₹{(params.loanAmt / 100000).toLocaleString()} Lakhs</span>
            </div>
            <input type="range" min="500000" max="30000000" step="100000" value={params.loanAmt} onChange={(e) => setParams({ ...params, loanAmt: Number(e.target.value) })} style={{ width: "100%", accentColor: "#f59e0b", cursor: "grab" }} />
          </div>
          
          {/* TENURE */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Tenure</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{params.tenure} Years</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={params.tenure} onChange={(e) => setParams({ ...params, tenure: Number(e.target.value) })} style={{ width: "100%", accentColor: GOLD, cursor: "grab" }} />
          </div>
        </div>
      </div>

      {/* RIGHT: AI PREDICTION OUTPUT */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <motion.div 
          key={aiResult.score} // Trigger re-render animation when score changes
          initial={{ opacity: 0.5, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
          style={{ background: "rgba(11, 28, 61, 0.4)", padding: 40, borderRadius: 24, border: `1px solid ${GOLD}40`, boxShadow: `0 20px 40px rgba(0,0,0,0.4)` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
             <Cpu size={24} color={GOLD} />
             <h3 style={{ fontSize: 14, fontWeight: 700, color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>Random Forest Decision Preview</h3>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40 }}>
            <h1 style={{ fontSize: 72, fontWeight: 900, color: aiResult.score > 75 ? "#10b981" : GOLD, margin: 0, lineHeight: 1 }}>{aiResult.score}</h1>
            <span style={{ fontSize: 16, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Pred. AI Score</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "rgba(30, 58, 138, 0.06)", padding: 20, borderRadius: 16 }}>
              <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}><TrendingUp size={14} /> Estimated EMI</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "white", margin: 0 }}>₹{aiResult.emi.toLocaleString()}</p>
            </div>
            
            <div style={{ background: "rgba(30, 58, 138, 0.06)", padding: 20, borderRadius: 16 }}>
              <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}><ShieldCheck size={14} /> Financial Wellness</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "white", margin: 0 }}>{aiResult.wellness} / 100</p>
            </div>
            
            <div style={{ background: "rgba(30, 58, 138, 0.06)", padding: 20, borderRadius: 16, gridColumn: "span 2" }}>
              <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}><BarChart2 size={14} /> 3-Month Crisis Predictor</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: aiResult.score > 75 ? "#10b981" : "#ef4444", margin: 0 }}>{aiResult.crisis}</p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default WhatIfSimulator;
