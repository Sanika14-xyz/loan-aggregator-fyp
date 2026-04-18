import { useState } from "react";
import { Link } from "react-router-dom";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Hit the real backend API
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error("Could not find an account with that email.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${NAVY} 0%, #091526 100%)`, padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 12px" }}>🔐</div>
          <h1 style={{ color: GOLD, fontSize: 26, fontWeight: 700, margin: 0, fontFamily: "Georgia, serif" }}>Account Recovery</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "6px 0 0" }}>Securely reset your password</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 32, border: "1px solid rgba(201,168,76,0.2)" }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 13, textAlign: "center" }}>
              {error}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 24, lineHeight: 1.6, textAlign: "center" }}>
                Enter the email address associated with your account and we will send you a secure link to reset your password.
              </p>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                style={{ width: "100%", padding: 13, borderRadius: 10, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 15, border: "none", cursor: loading || !email ? "not-allowed" : "pointer", opacity: loading || !email ? 0.7 : 1 }}
              >
                {loading ? "Scanning Database..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📩</div>
              <h3 style={{ color: "white", fontSize: 18, marginBottom: 8 }}>Check your inbox</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                If an account exists for <strong style={{color: GOLD}}>{email}</strong>, a secure password reset link has been sent.
              </p>
              <button 
                onClick={() => { setSubmitted(false); setEmail(""); setError(null); }}
                style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
              >
                Try another email
              </button>
            </div>
          )}

          <p style={{ textAlign: "center", marginTop: 24, marginBottom: 0 }}>
            <Link to="/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;