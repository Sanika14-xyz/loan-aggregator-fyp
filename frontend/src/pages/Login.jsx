import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const NAVY = "#051C2C";
const BLUE = "#0055FE";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { simulateGoogle } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Institutional Top Bar */}
      <header style={{ padding: "30px 60px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", color: NAVY }}>CREDIFY <span style={{ fontWeight: 300, fontSize: 12, letterSpacing: "0.2em", marginLeft: 8 }}>PARTNER NETWORK</span></div>
        <Link to="/register" style={{ fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: "none" }}>CREATE ACCOUNT</Link>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 450 }}>
          
          <div style={{ marginBottom: 48 }}>
            <h1 style={{ fontSize: 42, fontWeight: 700, margin: "0 0 16px", color: NAVY, lineHeight: 1.1 }}>Sign in to <br/>Institutional Portal</h1>
            <p style={{ color: "#6B7280", fontSize: 16 }}>Access restricted to authorized financial partners.</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#B91C1C", padding: 16, borderRadius: 2, marginBottom: 24, fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: NAVY, marginBottom: 10, letterSpacing: "0.05em" }}>Institutional Email</label>
              <input 
                type="email" 
                className="mck-input"
                placeholder="professional@firm.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div style={{ marginBottom: 40 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: NAVY, marginBottom: 10, letterSpacing: "0.05em" }}>Access Key</label>
              <input 
                type="password" 
                className="mck-input"
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="mck-btn-primary"
              style={{ width: "100%" }}
            >
              {loading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
            </button>

            <div style={{ position: "relative", textAlign: "center", margin: "32px 0 24px" }}>
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#E5E7EB" }} />
              <span style={{ position: "relative", background: "white", padding: "0 16px", fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase" }}>OR CONTINUE WITH</span>
            </div>

            <button 
              type="button" 
              onClick={() => simulateGoogle((email) => {
                setEmail(email);
                setPassword("Institutional@Access#2026");
              })}
              style={{ 
                width: "100%", padding: "16px", background: "#FFFFFF", color: NAVY, 
                fontWeight: 700, border: "2px solid #E5E7EB", cursor: "pointer", fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "0.2s", borderRadius: 0
              }}
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" style={{ width: 16 }} />
              Network Identity (Google)
            </button>
          </form>

          <div style={{ marginTop: 40, borderTop: "1px solid #E5E7EB", paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>
              <ShieldCheck size={12} style={{ marginRight: 6, display: "inline" }} />
              256-BIT ENCRYPTION ACTIVE
            </div>
            <Link to="/forgot-password" style={{ fontSize: 12, color: "#6B7280", textDecoration: "none" }}>Forgot Access Key?</Link>
          </div>

        </motion.div>
      </div>

      <footer style={{ padding: "40px 60px", borderTop: "1px solid #E5E7EB", textAlign: "left" }}>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>© 2026 Credify Institutional. All rights reserved. Access is subject to global banking compliance regulations.</p>
      </footer>

    </div>
  );
};

export default Login;