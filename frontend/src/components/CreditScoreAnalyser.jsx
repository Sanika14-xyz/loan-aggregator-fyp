import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { Activity, Award, TrendingUp, AlertTriangle } from "lucide-react";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

// 💎 REUSABLE GLASS CARD
const GlassCard = ({ children, style, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay, ease: "easeOut" }}
    style={{ background: "rgba(240, 244, 255, 0.95)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)", padding: 32, ...style }}>
    {children}
  </motion.div>
);

const CreditScoreAnalyser = () => {
  const [score, setScore] = useState(750);

  const getScoreData = (s) => {
    if (s < 580) return { category: "Poor", color: "#ef4444", icon: <AlertTriangle size={24} color="#ef4444" />, text: "High Risk. Institutional loan approval is highly unlikely. Immediate debt restructuring advised." };
    if (s < 670) return { category: "Fair", color: "#f59e0b", icon: <Activity size={24} color="#f59e0b" />, text: "Medium Risk. Loans available but at sub-prime, higher interest rates." };
    if (s < 740) return { category: "Good", color: "#2563EB", icon: <TrendingUp size={24} color="#2563EB" />, text: "Low Risk. Strong approval odds and competitive market rates." };
    if (s < 800) return { category: "Very Good", color: "#10b981", icon: <Award size={24} color="#10b981" />, text: "Very Low Risk. High approval odds and excellent interest rates." };
    return { category: "Excellent", color: GOLD, icon: <Award size={24} color={GOLD} />, text: "Exceptional. You qualify for the absolute best rates in the financial market." };
  };

  const scoreData = getScoreData(score);
  const gaugeData = [{ name: "Score", value: score - 300, fill: scoreData.color }, { name: "Remaining", value: 900 - score, fill: "rgba(255,255,255,0.05)" }];

  const breakdownData = [
    { name: "Payment History", weight: 35, impact: "High" },
    { name: "Credit Utilisation", weight: 30, impact: "High" },
    { name: "Credit Age", weight: 15, impact: "Medium" },
    { name: "Mix of Credit", weight: 10, impact: "Low" },
    { name: "New Enquiries", weight: 10, impact: "Low" },
  ];

  const percentage = ((score - 300) / (900 - 300)) * 100;

  return (
    <div style={{ padding: "40px 32px", background: "#F8FAFC", minHeight: "100vh", color: "white" }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 12 }}>
          <Activity size={32} color={GOLD} /> AI Credit Risk Analyser
        </h2>
        <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>Understand your CIBIL health and optimize your profile for institutional lending.</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        
        {/* LEFT: GAUGE AND SLIDER */}
        <GlassCard delay={0.1} style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "flex-end" }}>
            <label style={{ fontSize: 13, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Simulate Credit Score</label>
            <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{score}</span>
          </div>
          
          {/* Custom Sleek Slider */}
          <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center", marginBottom: 40 }}>
            <div style={{ position: "absolute", width: "100%", height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
              <motion.div layout style={{ height: "100%", background: GOLD, width: `${percentage}%`, boxShadow: `0 0 10px ${GOLD}80` }} transition={{ type: "spring", bounce: 0, duration: 0.3 }} />
            </div>
            <input type="range" min="300" max="900" value={score} onChange={(e) => setScore(Number(e.target.value))} style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} />
            <motion.div style={{ position: "absolute", left: `calc(${percentage}% - 12px)`, width: 24, height: 24, background: "white", borderRadius: "50%", border: `4px solid ${GOLD}`, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", pointerEvents: "none" }} transition={{ type: "spring", bounce: 0, duration: 0.3 }} />
          </div>
          
          <div style={{ position: "relative", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gaugeData} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={110} outerRadius={150} paddingAngle={0} dataKey="value" stroke="none">
                  {gaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} style={{ filter: index === 0 ? `drop-shadow(0 0 8px ${scoreData.color}60)` : "none", transition: "all 0.4s ease" }} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h1 style={{ fontSize: 56, fontWeight: 800, color: "white", margin: "0 0 8px", lineHeight: 1, textShadow: `0 0 20px ${scoreData.color}40` }}>{score}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${scoreData.color}20`, border: `1px solid ${scoreData.color}40`, padding: "6px 20px", borderRadius: 50 }}>
                {scoreData.icon}
                <span style={{ fontSize: 16, fontWeight: 700, color: scoreData.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{scoreData.category}</span>
              </div>
            </div>
          </div>

          <p style={{ marginTop: 32, fontSize: 15, color: "#cbd5e1", lineHeight: 1.6 }}>{scoreData.text}</p>
        </GlassCard>

        {/* RIGHT: BREAKDOWN & TIPS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          <GlassCard delay={0.2}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#64748B", margin: "0 0 24px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Score Composition Algorithm</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breakdownData} layout="vertical" margin={{ left: 50, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: "#cbd5e1", fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} contentStyle={{ background: NAVY, borderRadius: 12, border: `1px solid ${GOLD}`, color: "white" }} formatter={(val) => [`${val}%`, "Weight"]} />
                <Bar dataKey="weight" fill={GOLD} radius={[0, 6, 6, 0]} barSize={16}>
                  {breakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={index < 2 ? "#2563EB" : GOLD} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard delay={0.3} style={{ background: `linear-gradient(145deg, ${GOLD}15 0%, rgba(11,28,61,0.6) 100%)`, border: `1px solid ${GOLD}40` }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={20} /> AI Actionable Insights
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: "#cbd5e1" }}>
              {score < 600 && <li><strong>Critical Action:</strong> Pay all overdue EMI/Credit Card bills immediately to halt further profile degradation.</li>}
              {score < 750 && <li><strong>Optimization:</strong> Keep credit card utilisation strictly below 30% of your total sanctioned limit.</li>}
              {score < 800 && <li><strong>Warning:</strong> Avoid initiating multiple hard credit enquiries (new loan applications) in a short 30-day window.</li>}
              {score >= 700 && <li><strong>Maintenance:</strong> Preserve legacy credit accounts. Older accounts significantly increase your "Credit Age" metric.</li>}
              {score >= 800 && <li><strong>Leverage:</strong> You possess elite creditworthiness. Use this leverage to negotiate lower processing fees with lenders.</li>}
            </ul>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default CreditScoreAnalyser;