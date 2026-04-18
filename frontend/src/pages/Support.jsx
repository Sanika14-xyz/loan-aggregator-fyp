import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Star, Send, ShieldCheck } from "lucide-react";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

const Support = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const faqs = [
    { q: "How accurate is the AI Matching Score?", a: "The score is calculated based on real-time bank eligibility criteria and your current financial profile with 98% accuracy." },
    { q: "Why is my application under review?", a: "Applications requiring manual verification of complex documents go through a second-tier review by bank officers." },
    { q: "What is Basel II Risk?", a: "It refers to the international banking standards used to calculate the risk grade (A-E) shown in your application tracker." }
  ];

  return (
    <div style={{ padding: 40, background: `linear-gradient(135deg, ${NAVY} 0%, #061124 100%)`, minHeight: "100vh", color: "white" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        <header style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: GOLD, margin: "0 0 12px", fontFamily: "Georgia, serif" }}>Client Support Hub</h2>
          <p style={{ color: "#64748B", fontSize: 16 }}>Technical assistance and institutional feedback portal.</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
          {/* FAQ SECTION */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <HelpCircle color={GOLD} /> Information Center
            </h3>
            {faqs.map((f, i) => (
              <div key={i} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontWeight: 700, color: "white", marginBottom: 12, fontSize: 16 }}>{f.q}</p>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{f.a}</p>
              </div>
            ))}
          </div>

          {/* RATING SECTION */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
              <MessageSquare size={32} color={GOLD} style={{ marginBottom: 20, margin: "0 auto" }} />
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Rate Our Engine</h3>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>Help us refine our matching algorithm.</p>
              
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={32}
                    fill={(hover || rating) >= star ? GOLD : "none"}
                    color={(hover || rating) >= star ? GOLD : "rgba(255,255,255,0.2)"}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                  />
                ))}
              </div>

              <textarea 
                placeholder="Detailed feedback..."
                style={{ width: "100%", background: "rgba(30, 58, 138, 0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 16, color: "white", fontSize: 14, minHeight: 120, marginBottom: 20, outline: "none", boxSizing: "border-box" }}
              />
              
              <button style={{ width: "100%", padding: 16, borderRadius: 12, background: GOLD, color: NAVY, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Send size={18} /> TRANSMIT FEEDBACK
              </button>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: 20, borderRadius: 16, border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", gap: 12 }}>
                <ShieldCheck color="#10b981" size={24} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>SSL SECURED 256-BIT ENCRYPTION</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Support;