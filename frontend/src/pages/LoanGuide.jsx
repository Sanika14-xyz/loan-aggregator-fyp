import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Home, Car, GraduationCap, Briefcase, CreditCard, 
  Sparkles, ChevronDown, ShieldAlert, Scale, Target, AlertTriangle 
} from "lucide-react";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

// 💎 REUSABLE GLASS CARD
const GlassCard = ({ children, style, delay = 0, hover = false }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    whileHover={hover ? { y: -5, boxShadow: `0 15px 40px rgba(0,0,0,0.6), inset 0 0 0 1px ${GOLD}40` } : {}}
    style={{ 
      background: "rgba(240, 244, 255, 0.95)", 
      backdropFilter: "blur(20px)", 
      borderRadius: 24, 
      border: "1px solid rgba(255, 255, 255, 0.08)", 
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)", 
      padding: 32, 
      ...style 
    }}
  >
    {children}
  </motion.div>
);

const LoanGuide = () => {
  const [activeTerm, setActiveTerm] = useState(null);

  const loanTypes = [
    { icon: <Home size={28} color={GOLD} />, title: "Home Loan", desc: "Used to purchase or construct a house. Usually has the lowest interest rates and longest tenures (up to 30 years). The property acts as collateral." },
    { icon: <Car size={28} color={GOLD} />, title: "Auto Loan", desc: "Short-to-medium term loans (1-7 years) specifically for buying a new or used vehicle. The vehicle itself is pledged as security." },
    { icon: <GraduationCap size={28} color={GOLD} />, title: "Education Loan", desc: "Funds higher education. Often comes with a 'moratorium period' where repayment starts only after the course is completed." },
    { icon: <Briefcase size={28} color={GOLD} />, title: "Business Loan", desc: "Capital for startups or existing businesses for expansion, equipment, or working capital. Can be secured or unsecured." },
    { icon: <CreditCard size={28} color={GOLD} />, title: "Personal Loan", desc: "An unsecured loan meaning no collateral is required. Can be used for any personal expense but carries higher interest rates." },
    { icon: <Sparkles size={28} color={GOLD} />, title: "Gold Loan", desc: "A secured loan where you pledge gold jewelry. Very fast processing, low rates, and no strict credit score requirements." }
  ];

  const keyTerms = [
    { term: "Principal Amount", def: "The actual amount of money you borrow from the bank, before any interest is added or calculated." },
    { term: "Interest Rate (ROI)", def: "The cost of borrowing money, expressed as a percentage. It can be 'Fixed' (stays the same) or 'Floating' (changes based on market conditions like the RBI Repo Rate)." },
    { term: "EMI (Equated Monthly Instalment)", def: "The fixed amount you pay the bank every month. It includes a portion of your Principal and a portion of the Interest." },
    { term: "Tenure", def: "The total duration given to you to repay the loan (e.g., 5 years, 20 years). Longer tenures mean smaller EMIs but higher total interest paid." },
    { term: "Collateral / Security", def: "An asset (like a house, car, or gold) you pledge to the bank. If you fail to repay the loan, the bank has the legal right to seize this asset." },
    { term: "Processing Fee", def: "A one-time upfront charge levied by the bank to cover the administrative and operational costs of processing your loan application." },
    { term: "CIBIL / Credit Score", def: "A 3-digit number (300-900) representing your creditworthiness based on past repayment history. Institutional lenders typically look for 750+." }
  ];

  const goldenRules = [
    { icon: <Target size={20} color={GOLD} />, title: "Only borrow what you need", text: "Never take a larger loan just because you are eligible for it. You pay interest on every single rupee disbursed." },
    { icon: <Scale size={20} color={GOLD} />, title: "Keep EMI under 40%", text: "Your total monthly loan EMIs should not exceed 40-50% of your total monthly net income to avoid debt traps." },
    { icon: <ShieldAlert size={20} color={GOLD} />, title: "Read the Fine Print", text: "Always check the sanction letter for hidden charges like prepayment penalties, processing fees, and late payment fines." },
    { icon: <AlertTriangle size={20} color={GOLD} />, title: "Shorter Tenure = Less Interest", text: "A 20-year loan has smaller EMIs, but you will pay almost double the principal amount in interest. Keep tenures short." }
  ];

  return (
    <div style={{ padding: "40px 32px", background: `linear-gradient(135deg, ${NAVY} 0%, #061124 100%)`, minHeight: "100vh", color: "white", fontFamily: "sans-serif" }}>
      
      {/* HEADER SECTION */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40, position: "relative" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 12 }}>
          <BookOpen size={32} color={GOLD} /> Financial Literacy Hub
        </h2>
        <p style={{ color: "#64748B", fontSize: 15, margin: 0, maxWidth: 800, lineHeight: 1.6 }}>
          Understanding institutional lending doesn't have to be complicated. Read our smart guide to master the fundamentals of personal finance before initiating an application.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40, maxWidth: 1200 }}>
        
        {/* SECTION 1: Types of Loans */}
        <section>
          <motion.h3 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span style={{ color: GOLD, fontSize: 14 }}>01 //</span> Institutional Loan Classifications
          </motion.h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {loanTypes.map((loan, idx) => (
              <GlassCard key={idx} delay={0.2 + (idx * 0.05)} hover={true} style={{ padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ background: "rgba(201,168,76,0.1)", padding: 12, borderRadius: 12, border: `1px solid ${GOLD}40` }}>
                    {loan.icon}
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: 0 }}>{loan.title}</h4>
                </div>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, margin: 0 }}>{loan.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Two Column Layout for Terms and Rules */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
          
          {/* SECTION 2: Banking Dictionary (Glass Accordion) */}
          <section>
            <motion.h3 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <span style={{ color: GOLD, fontSize: 14 }}>02 //</span> The Anatomy of a Loan
            </motion.h3>
            
            <GlassCard delay={0.4} style={{ padding: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {keyTerms.map((item, idx) => (
                  <div key={idx} style={{ background: activeTerm === idx ? "rgba(255,255,255,0.05)" : "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden", transition: "background 0.3s" }}>
                    <button 
                      onClick={() => setActiveTerm(activeTerm === idx ? null : idx)}
                      style={{ width: "100%", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", outline: "none" }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 600, color: activeTerm === idx ? GOLD : "white", transition: "color 0.3s" }}>{item.term}</span>
                      <motion.div animate={{ rotate: activeTerm === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={20} color={activeTerm === idx ? GOLD : "#64748B"} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {activeTerm === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }} 
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div style={{ padding: "0 20px 20px" }}>
                            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />
                            <p style={{ margin: 0, fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{item.def}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* SECTION 3: Golden Rules */}
          <section>
            <motion.h3 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <span style={{ color: GOLD, fontSize: 14 }}>03 //</span> Golden Rules
            </motion.h3>
            
            <GlassCard delay={0.5} style={{ background: `linear-gradient(145deg, ${GOLD}15 0%, rgba(11,28,61,0.6) 100%)`, border: `1px solid ${GOLD}40` }}>
              <ul style={{ display: "flex", flexDirection: "column", gap: 24, padding: 0, margin: 0, listStyle: "none" }}>
                {goldenRules.map((rule, idx) => (
                  <li key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ background: "rgba(201,168,76,0.15)", padding: 8, borderRadius: 8, border: `1px solid ${GOLD}40`, flexShrink: 0, marginTop: 2 }}>
                      {rule.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "white", margin: "0 0 6px" }}>{rule.title}</h4>
                      <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: 0 }}>{rule.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </section>

        </div>
      </div>
    </div>
  );
};

export default LoanGuide;