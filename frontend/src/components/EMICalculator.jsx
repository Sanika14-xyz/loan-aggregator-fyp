import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ArrowRightLeft, Zap, IndianRupee, PieChart, Info } from "lucide-react";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// 💎 SLEEK CUSTOM SLIDER COMPONENT
const SleekSlider = ({ label, value, min, max, step, onChange, format, color = GOLD }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }}>
        <label style={{ fontSize: 13, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
        <motion.span 
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ fontSize: 18, fontWeight: 700, color: "white", textShadow: `0 0 10px ${color}40` }}
        >
          {format(value)}
        </motion.span>
      </div>
      
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        {/* Custom Track Background */}
        <div style={{ position: "absolute", width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
          {/* Custom Filled Track */}
          <motion.div 
            layout
            style={{ height: "100%", background: color, width: `${percentage}%`, boxShadow: `0 0 10px ${color}` }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          />
        </div>
        
        {/* The Actual Invisible Input (for interaction) */}
        <input 
          type="range" min={min} max={max} step={step} value={value} 
          onChange={(e) => onChange(Number(e.target.value))} 
          style={{ 
            position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 
          }} 
        />
        
        {/* Custom Thumb Indicator */}
        <motion.div 
          style={{ 
            position: "absolute", left: `calc(${percentage}% - 10px)`, width: 20, height: 20, 
            background: "white", borderRadius: "50%", border: `3px solid ${color}`, 
            boxShadow: "0 4px 12px rgba(30, 58, 138, 0.06)", pointerEvents: "none"
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        />
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{format(min)}</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{format(max)}</span>
      </div>
    </div>
  );
};

// 💎 GLASSMORPHISM CARD COMPONENT
const GlassCard = ({ children, style, glowColor = "rgba(255,255,255,0.02)" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    style={{
      background: "rgba(11, 28, 61, 0.4)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: 24,
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: `0 10px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px ${glowColor}`,
      padding: 32,
      ...style
    }}
  >
    {children}
  </motion.div>
);

const EMICalculator = () => {
  const [mode, setMode] = useState("single"); 

  const [principalA, setPrincipalA] = useState(5000000);
  const [rateA, setRateA] = useState(8.5);
  const [tenureA, setTenureA] = useState(20);

  const [principalB, setPrincipalB] = useState(5000000);
  const [rateB, setRateB] = useState(9.2);
  const [tenureB, setTenureB] = useState(15);

  const [currentDebt, setCurrentDebt] = useState(3000000);
  const [currentEMI, setCurrentEMI] = useState(65000);
  const [newConsolidationRate, setNewConsolidationRate] = useState(10.5);
  const [newConsolidationTenure, setNewConsolidationTenure] = useState(5);

  const calculateLoan = (p, r, t) => {
    const ratePerMonth = r / 12 / 100;
    const months = t * 12;
    const emi = (p * ratePerMonth * Math.pow(1 + ratePerMonth, months)) / (Math.pow(1 + ratePerMonth, months) - 1);
    return { emi, totalPayable: emi * months, totalInterest: (emi * months) - p };
  };

  const loanA = useMemo(() => calculateLoan(principalA, rateA, tenureA), [principalA, rateA, tenureA]);
  const loanB = useMemo(() => calculateLoan(principalB, rateB, tenureB), [principalB, rateB, tenureB]);

  const refinanceMath = useMemo(() => {
    const newLoan = calculateLoan(currentDebt, newConsolidationRate, newConsolidationTenure);
    const monthlySavings = currentEMI - newLoan.emi;
    const estimatedOldTenureMonths = currentDebt / (currentEMI * 0.8); 
    const oldTotalPayable = currentEMI * estimatedOldTenureMonths;
    const newTotalPayable = newLoan.totalPayable;
    const totalArbitrageSavings = oldTotalPayable - newTotalPayable;
    return { newEMI: newLoan.emi, monthlySavings, totalArbitrageSavings };
  }, [currentDebt, currentEMI, newConsolidationRate, newConsolidationTenure]);

  const compareData = [
    { name: "Loan A", Principal: principalA, Interest: loanA.totalInterest },
    { name: "Loan B", Principal: principalB, Interest: loanB.totalInterest },
  ];

  return (
    <div style={{ padding: "40px 32px", background: "#F8FAFC", minHeight: "100vh", color: "white" }}>
      {/* HEADER SECTION */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 12 }}>
            <Calculator size={32} color={GOLD} /> Financial Modeling Engine
          </h2>
          <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>Pro-grade tools for loan optimization and arbitrage.</p>
        </div>
        
        {/* NEON TOGGLE TABS */}
        <div style={{ display: "flex", background: "rgba(30, 58, 138, 0.06)", padding: "6px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
          {[
            { id: "single", label: "Single Loan", icon: <PieChart size={16} /> },
            { id: "compare", label: "Compare", icon: <ArrowRightLeft size={16} /> },
            { id: "refinance", label: "Arbitrage", icon: <Zap size={16} /> }
          ].map((tab) => (
            <button 
              key={tab.id} onClick={() => setMode(tab.id)} 
              style={{ 
                display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: "12px", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", 
                background: mode === tab.id ? GOLD : "transparent", 
                color: mode === tab.id ? NAVY : "#64748B", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: mode === tab.id ? `0 4px 20px ${GOLD}60` : "none"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        
        {/* 🚀 MODE: SINGLE LOAN */}
        {mode === "single" && (
          <motion.div key="single" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: 32, alignItems: "start" }}>
            
            <GlassCard>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 32px", display: "flex", alignItems: "center", gap: 8 }}>
                <Info size={18} color={GOLD} /> Adjust Loan Parameters
              </h3>
              <SleekSlider label="Principal Amount" value={principalA} min={100000} max={20000000} step={50000} onChange={setPrincipalA} format={fmt} />
              <SleekSlider label="Annual Interest Rate" value={rateA} min={6} max={24} step={0.1} onChange={setRateA} format={(v) => `${v.toFixed(1)}%`} color="#2563EB" />
              <SleekSlider label="Tenure (Years)" value={tenureA} min={1} max={30} step={1} onChange={setTenureA} format={(v) => `${v} yrs`} color="#10b981" />
            </GlassCard>

            <GlassCard style={{ background: `linear-gradient(145deg, ${GOLD}15 0%, rgba(255,255,255,0.02) 100%)`, border: `1px solid ${GOLD}40` }}>
              <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Equated Monthly Instalment</p>
              <p style={{ color: GOLD, fontSize: 56, fontWeight: 800, margin: "0 0 40px", lineHeight: 1, textShadow: `0 0 20px ${GOLD}40` }}>
                {fmt(Math.round(loanA.emi))}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ color: "#64748B", fontSize: 15 }}>Principal Amount</span>
                  <span style={{ fontWeight: 600, fontSize: 16, color: "white" }}>{fmt(principalA)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ color: "#64748B", fontSize: 15 }}>Total Interest</span>
                  <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 16 }}>+ {fmt(Math.round(loanA.totalInterest))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
                  <span style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Total Payable</span>
                  <span style={{ color: GOLD, fontWeight: 800, fontSize: 20 }}>{fmt(Math.round(loanA.totalPayable))}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* 🚀 MODE: COMPARE */}
        {mode === "compare" && (
          <motion.div key="compare" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              
              {/* Scenario A */}
              <GlassCard glowColor={`${GOLD}40`} style={{ border: `1px solid ${GOLD}60` }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 32px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ background: GOLD, color: NAVY, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>A</div> 
                  Scenario A
                </h3>
                <SleekSlider label="Loan Amount" value={principalA} min={100000} max={20000000} step={50000} onChange={setPrincipalA} format={fmt} />
                <SleekSlider label="Interest Rate" value={rateA} min={6} max={24} step={0.1} onChange={setRateA} format={(v) => `${v.toFixed(1)}%`} />
                <SleekSlider label="Tenure" value={tenureA} min={1} max={30} step={1} onChange={setTenureA} format={(v) => `${v} yrs`} />
                
                <div style={{ marginTop: 32, padding: 20, background: "rgba(30, 58, 138, 0.06)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Monthly EMI</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: GOLD, margin: 0 }}>{fmt(Math.round(loanA.emi))}</p>
                </div>
              </GlassCard>

              {/* Scenario B */}
              <GlassCard glowColor="#2563EB40" style={{ border: `1px solid #2563EB60` }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 32px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ background: "#2563EB", color: "white", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>B</div> 
                  Scenario B
                </h3>
                <SleekSlider label="Loan Amount" value={principalB} min={100000} max={20000000} step={50000} onChange={setPrincipalB} format={fmt} color="#2563EB" />
                <SleekSlider label="Interest Rate" value={rateB} min={6} max={24} step={0.1} onChange={setRateB} format={(v) => `${v.toFixed(1)}%`} color="#2563EB" />
                <SleekSlider label="Tenure" value={tenureB} min={1} max={30} step={1} onChange={setTenureB} format={(v) => `${v} yrs`} color="#2563EB" />
                
                <div style={{ marginTop: 32, padding: 20, background: "rgba(30, 58, 138, 0.06)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Monthly EMI</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: "#60a5fa", margin: 0 }}>{fmt(Math.round(loanB.emi))}</p>
                </div>
              </GlassCard>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
              <GlassCard style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 20px" }}>The Verdict</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 32px", color: "#cbd5e1" }}>
                  By choosing <strong>Loan {loanA.totalInterest < loanB.totalInterest ? "A" : "B"}</strong>, you will save a total of 
                  <span style={{ color: "#10b981", fontWeight: 800, fontSize: 24, display: "block", marginTop: 12 }}>
                    {fmt(Math.abs(Math.round(loanA.totalInterest - loanB.totalInterest)))}
                  </span>
                  in interest payments.
                </p>
              </GlassCard>

              <GlassCard>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#64748B", margin: "0 0 24px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={compareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: "white", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(value) => fmt(Math.round(value))} contentStyle={{ background: NAVY, borderRadius: 12, border: `1px solid ${GOLD}`, color: "white" }} />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar dataKey="Principal" stackId="a" fill="rgba(255,255,255,0.2)" radius={[0, 0, 8, 8]} barSize={80} />
                    <Bar dataKey="Interest" stackId="a" fill={GOLD} radius={[8, 8, 0, 0]} barSize={80} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* 🚀 MODE: REFINANCE ARBITRAGE */}
        {mode === "refinance" && (
          <motion.div key="refinance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            
            <GlassCard glowColor="#ef444440">
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 8px" }}>Step 1: Current Debt Status</h3>
              <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 32px" }}>Enter total existing high-interest loans.</p>
              <SleekSlider label="Total Remaining Debt" value={currentDebt} min={50000} max={10000000} step={50000} onChange={setCurrentDebt} format={fmt} color="#ef4444" />
              <SleekSlider label="Combined Current EMI" value={currentEMI} min={5000} max={500000} step={1000} onChange={setCurrentEMI} format={fmt} color="#ef4444" />
            </GlassCard>

            <GlassCard glowColor={`${GOLD}40`} style={{ border: `1px solid ${GOLD}60` }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 8px" }}>Step 2: New Consolidation Loan</h3>
              <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 32px" }}>Model a new, lower-interest single loan.</p>
              <SleekSlider label="New Interest Rate" value={newConsolidationRate} min={6} max={20} step={0.1} onChange={setNewConsolidationRate} format={(v) => `${v.toFixed(1)}%`} />
              <SleekSlider label="New Repayment Tenure" value={newConsolidationTenure} min={1} max={20} step={1} onChange={setNewConsolidationTenure} format={(v) => `${v} yrs`} />
            </GlassCard>

            <GlassCard style={{ gridColumn: "1 / -1", padding: 40, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, background: `linear-gradient(145deg, ${NAVY} 0%, rgba(201,168,76,0.05) 100%)` }}>
              <div>
                <p style={{ fontSize: 13, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px", fontWeight: 600 }}>New Consolidated EMI</p>
                <p style={{ fontSize: 48, fontWeight: 800, color: "white", margin: 0 }}>{fmt(Math.round(refinanceMath.newEMI))}</p>
              </div>
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 32 }}>
                <p style={{ fontSize: 13, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px", fontWeight: 600 }}>Monthly Cashflow Freed</p>
                <p style={{ fontSize: 48, fontWeight: 800, color: refinanceMath.monthlySavings > 0 ? "#10b981" : "#ef4444", margin: 0, textShadow: refinanceMath.monthlySavings > 0 ? "0 0 20px rgba(16, 185, 129, 0.4)" : "none" }}>
                  {refinanceMath.monthlySavings > 0 ? "+" : ""}{fmt(Math.round(refinanceMath.monthlySavings))}
                </p>
              </div>
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 32 }}>
                <p style={{ fontSize: 13, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px", fontWeight: 600 }}>Total Arbitrage Savings</p>
                <p style={{ fontSize: 48, fontWeight: 800, color: GOLD, margin: 0, textShadow: `0 0 20px ${GOLD}40` }}>
                  {refinanceMath.totalArbitrageSavings > 0 ? fmt(Math.round(refinanceMath.totalArbitrageSavings)) : "None"}
                </p>
              </div>
            </GlassCard>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EMICalculator;