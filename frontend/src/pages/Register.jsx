import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Briefcase, Activity, ShieldCheck } from "lucide-react";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const NAVY = "#1E3A8A";
const ACCENT = "#0F766E";
const BG_MAIN = "#F8FAFC";
const BORDER = "#E2E8F0";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "applicant" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const { simulateGoogle } = useNotification();
  const navigate = useNavigate();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    const result = await register(formData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Registration failed.");
      setLoading(false);
    }
  };

  const inputStyle = { 
    width: "100%", 
    padding: "16px 16px 16px 52px", 
    borderRadius: 14, 
    border: `1px solid ${BORDER}`, 
    background: "#FFFFFF", 
    color: "#0F172A", 
    fontSize: 15, 
    fontWeight: 500,
    outline: "none", 
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box" 
  };

  const labelStyle = { 
    display: "block", 
    fontSize: 11, 
    fontWeight: 700, 
    color: "#64748B", 
    marginBottom: 8, 
    textTransform: "uppercase", 
    letterSpacing: "0.08em" 
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", background: BG_MAIN }}>
      
      {/* LEFT SIDE: DECORATIVE PANEL */}
      <div style={{ padding: 80, display: "flex", flexDirection: "column", justifyContent: "center", background: "#051C2C", color: "white", position: "relative", overflow: "hidden" }}>
        
        <div style={{ maxWidth: 500, position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
              <Activity size={32} color="#3B82F6" />
              <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.04em" }}>Credi<span style={{ color: "#3B82F6" }}>fy</span></span>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, lineHeight: 1.1, fontFamily: "Outfit" }}>Digitizing the <br/>Credit Lifecycle</h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 40 }}>
              Join thousands of users who have streamlined their institutional borrowing with our enterprise-grade aggregator.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
               <div><p style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Instant</p><p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>AI Match Analysis</p></div>
               <div><p style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>End-to-End</p><p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Audit Trail Security</p></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: "100%", maxWidth: 460 }}>
          
          <div style={{ background: "white", borderRadius: 32, padding: 48, boxShadow: "0 25px 60px -12px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 10px", fontFamily: "Outfit" }}>Create Identity</h2>
            <p style={{ color: "#64748B", marginBottom: 32, fontSize: 15 }}>Enter your details to initiate onboarding.</p>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.05)", color: "#ef4444", padding: "14px", borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 700, border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Legal Name</label>
                <div style={{ position: "relative" }}>
                   <User size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                   <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Institutional Email</label>
                <div style={{ position: "relative" }}>
                   <Mail size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                   <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Platform Access Role</label>
                <div style={{ position: "relative" }}>
                   <Briefcase size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                   <select name="role" value={formData.role} onChange={handleInputChange} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                     <option value="applicant">Applicant (Loan Seeker)</option>
                     <option value="loan_officer">Loan Officer</option>
                     <option value="compliance_auditor">Compliance Auditor</option>
                   </select>
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>Secure Access Code</label>
                <div style={{ position: "relative" }}>
                   <Lock size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                   <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required style={inputStyle} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="primary-btn"
                style={{ 
                  width: "100%", padding: 18, borderRadius: 14, background: "#1E3A8A", color: "white", 
                  fontWeight: 800, border: "none", cursor: loading ? "wait" : "pointer", fontSize: 16,
                  boxShadow: `0 8px 24px rgba(30, 58, 138, 0.25)`
                }}
              >
                {loading ? "PROCESSING ONBOARDING..." : "INITIALIZE ACCOUNT"}
              </button>

              <div style={{ position: "relative", textAlign: "center", margin: "32px 0 24px" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#E2E8F0" }} />
                <span style={{ position: "relative", background: "white", padding: "0 16px", fontSize: 12, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>OR CONTINUE WITH</span>
              </div>

              <button 
                type="button" 
                onClick={() => simulateGoogle((email) => {
                  setFormData({ 
                   ...formData, 
                   email: email, 
                   name: email.split('@')[0].toUpperCase(), 
                   password: "Institutional@Onboard#2026" 
                  });
                })}
                style={{ 
                  width: "100%", padding: "16px", borderRadius: 14, background: "#FFFFFF", color: "#0F172A", 
                  fontWeight: 700, border: "2px solid #E2E8F0", cursor: "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "0.2s"
                }}
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" style={{ width: 18 }} />
                Network Identity (Google)
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <p style={{ fontSize: 14, color: "#64748B" }}>
                Already a member? <Link to="/login" style={{ color: "#0055FE", fontWeight: 700, textDecoration: "none" }}>Sign In Instead</Link>
              </p>
            </div>
          </div>
          
          <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 11, marginTop: 32, letterSpacing: "0.02em" }}>
            <ShieldCheck size={12} style={{ display: "inline", marginRight: 4 }} />
            GDPR COMPLIANT • END-TO-END DATA SOVEREIGNTY
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;