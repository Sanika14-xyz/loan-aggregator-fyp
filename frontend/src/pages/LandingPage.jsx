import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, BrainCircuit, BarChart3, TrendingUp, Building2, Star, ArrowRight } from "lucide-react";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

// 💎 REUSABLE GLASS CARD
const GlassCard = ({ children, style, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    style={{
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      borderRadius: 24,
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 15px 35px rgba(30, 58, 138, 0.06)",
      padding: 32,
      ...style
    }}
  >
    {children}
  </motion.div>
);

const featureItems = [
  { icon: <BrainCircuit size={28} color={GOLD} />, title: "Neural Loan Matching", desc: "Our AI engine analyzes 60+ institutional lenders against your unique financial profile for the perfect fit." },
  { icon: <ShieldCheck size={28} color={GOLD} />, title: "Secure Audit Ledger", desc: "Every decision is hashed via SHA-256 and chained into an immutable, cryptographically secure audit trail." },
  { icon: <BarChart3 size={28} color={GOLD} />, title: "Arbitrage Engine", desc: "Model debt consolidation scenarios instantly to identify massive interest savings opportunities." },
  { icon: <Zap size={28} color={GOLD} />, title: "e-KYC OCR", desc: "Our computer vision system verifies identity documents with 99.8% biometric accuracy in seconds." },
  { icon: <TrendingUp size={28} color={GOLD} />, title: "Credit Analyser", desc: "Simulate credit score fluctuations and get AI-driven insights to optimize your institutional borrowing power." },
  { icon: <Building2 size={28} color={GOLD} />, title: "Basel II Modeling", desc: "Access professional risk metrics like PD, LGD, and Expected Loss for every loan application." }
];

const LandingPage = () => {
  return (
    <div style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #061124 100%)`, color: "white", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", overflowX: "hidden" }}>
      
      {/* 🚀 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        style={{ padding: "120px 24px 80px", textAlign: "center", position: "relative" }}
      >
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: "inline-flex", background: "rgba(201, 168, 76, 0.1)", border: "1px solid rgba(201, 168, 76, 0.3)", padding: "8px 20px", borderRadius: 50, color: GOLD, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24, alignItems: "center", gap: 8 }}>
          <Star size={14} fill={GOLD} /> Next-Generation FinTech Platform
        </motion.div>
        
        <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 800, color: "white", margin: "0 auto 24px", maxWidth: 1000, lineHeight: 1.1, letterSpacing: "-0.03em", fontFamily: "Georgia, serif" }}>
          The Intelligent Algorithm for <span style={{ color: GOLD }}>Institutional Lending</span>.
        </motion.h1>
        
        <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} style={{ fontSize: "20px", color: "#64748B", margin: "0 auto 48px", maxWidth: 650, lineHeight: 1.6 }}>
          Stop searching for loans. Our neural network analyzes global banks to secure your financial future with mathematical precision.
        </motion.p>
        
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ y: -4, boxShadow: `0 8px 30px ${GOLD}60` }} style={{ padding: "18px 40px", borderRadius: 14, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer" }}>Get Started</motion.button>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ background: "rgba(255,255,255,0.08)" }} style={{ padding: "18px 40px", borderRadius: 14, background: "rgba(255,255,255,0.03)", color: "white", fontWeight: 700, fontSize: 16, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>Sign In</motion.button>
          </Link>
        </motion.div>

        {/* Decorative dynamic glows */}
        <div style={{ position: "absolute", left: "-5%", top: "10%", width: 400, height: 400, background: `radial-gradient(circle, ${GOLD}10 0%, transparent 70%)`, borderRadius: "50%", zIndex: 0 }} />
      </motion.section>

      {/* 🧩 2. FEATURES GRID */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {featureItems.map((item, idx) => (
            <GlassCard key={idx} delay={idx * 0.1}>
              <div style={{ background: "rgba(201,168,76,0.1)", width: "fit-content", padding: 12, borderRadius: 12, marginBottom: 20 }}>{item.icon}</div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "white", margin: "0 0 12px" }}>{item.title}</h3>
              <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 📊 3. RISK ENGINE PREVIEW */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <GlassCard style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "center", background: `linear-gradient(145deg, rgba(11,28,61,0.9) 0%, rgba(201,168,76,0.05) 100%)`, border: `1px solid ${GOLD}30` }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: GOLD, margin: "0 0 16px" }}>The Credify Risk Console</h2>
            <p style={{ color: "#cbd5e1", fontSize: 16, lineHeight: 1.7, margin: "0 0 24px" }}>
              We've integrated <strong>Basel II Institutional Risk Metrics</strong>. Monitor Probability of Default (PD) and Expected Loss (EL) calculations in real-time.
            </p>
            <Link to="/register" style={{ textDecoration: "none", color: GOLD, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              Explore the Algorithm <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{ background: "rgba(30, 58, 138, 0.06)", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
             <span style={{fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em"}}>Neural Risk Grade</span>
             <motion.h1 animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }} style={{fontSize: 84, fontWeight: 900, color: GOLD, margin: "10px 0"}}>A+</motion.h1>
             <div style={{padding: "6px 16px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", borderRadius: 50, fontSize: 12, fontWeight: 800, display: "inline-block"}}>LOW PROBABILITY OF DEFAULT</div>
          </div>
        </GlassCard>
      </section>

      {/* 🏛️ 4. FOOTER */}
      <footer style={{ padding: "60px 24px", background: "rgba(30, 58, 138, 0.04)", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <p style={{ color: GOLD, fontWeight: 800, fontSize: 20, fontFamily: "Georgia, serif", margin: "0 0 12px" }}>Credify</p>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Built for CSE-Finance Final Year Viva 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;