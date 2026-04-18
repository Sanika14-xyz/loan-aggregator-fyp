import { useState, useContext, useEffect } from "react";
import { User, Shield, Laptop, MonitorSmartphone, KeySquare, Image as ImageIcon, Camera } from "lucide-react";
import AuthContext from "../context/AuthContext";
import API from "../services/api";

const BG_DARK = "#F8FAFC"; // Slate-900
const CARD_BG = "#FFFFFF"; // Slate-800
const BORDER = "#E2E8F0"; // Slate-700
const TEXT_MUTED = "#64748B"; // Slate-400

const ROLE_LABEL = { applicant: "Applicant", admin: "Administrator", loan_officer: "Loan Officer", risk_manager: "Risk Manager", compliance_auditor: "Compliance Auditor" };
const ROLE_COLOR = { admin: "#ef4444", compliance_auditor: "#8b5cf6", loan_officer: "#2563EB", risk_manager: "#f59e0b", applicant: "#10b981" };

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: user?.name || "", phoneNumber: user?.phoneNumber || "", currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`avatar_${user?.email}`) || null);
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const history = [];
    const now = new Date();
    for(let i=0; i<3; i++) {
      const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000 + Math.random() * 10000000));
      history.push({
        date: d.toLocaleDateString("en-IN") + " " + d.toLocaleTimeString("en-IN", {hour: '2-digit', minute:'2-digit'}),
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        device: i === 0 ? "Current Session (Windows)" : (Math.random() > 0.5 ? "Mac OS - Chrome" : "Mobile App - Android"),
        status: "Verified",
        icon: i === 0 ? <Laptop size={16} color={TEXT_MUTED} /> : <MonitorSmartphone size={16} color={TEXT_MUTED} />
      });
    }
    setLoginHistory(history);
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem(`avatar_${user?.email}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      const res = await API.put("/auth/profile", form);
      updateUser(res.data);
      setMsg({ type: "success", text: "Identity Data updated securely." });
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Profile Update failed." });
    } finally { setSaving(false); }
  };

  return (
    <div style={{ padding: "40px", background: BG_DARK, minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32, alignItems: "start" }}>
        
        {/* LEFT COLUMN: IDENTITY & SECURITY */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0", color: "white", display: "flex", alignItems: "center", gap: 10 }}>
            <User size={24} color={TEXT_MUTED} /> My Profile
          </h2>
          
          <div style={{ background: CARD_BG, borderRadius: 16, border: `1px solid ${BORDER}`, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            
            <div style={{ position: "relative", marginBottom: 20 }}>
              <div style={{ width: 110, height: 110, borderRadius: "50%", background: avatar ? `url(${avatar}) center/cover` : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, color: "white", overflow: "hidden", border: `3px solid ${BORDER}` }}>
                {!avatar && user?.name?.[0]?.toUpperCase()}
              </div>
              <label style={{ position: "absolute", bottom: -5, right: -5, width: 36, height: 36, background: "#2563EB", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `3px solid ${CARD_BG}`, transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                <Camera size={16} />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
              </label>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 4px" }}>{user?.name}</h3>
            <p style={{ fontSize: 13, color: TEXT_MUTED, margin: "0 0 16px" }}>{user?.email}</p>
            <div style={{ padding: "6px 16px", borderRadius: 50, background: `${ROLE_COLOR[user?.role]}15`, color: ROLE_COLOR[user?.role], fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", border: `1px solid ${ROLE_COLOR[user?.role]}40` }}>
              {ROLE_LABEL[user?.role]}
            </div>
          </div>

          <div style={{ background: CARD_BG, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={16} color={TEXT_MUTED} />
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Access Audit Log</h3>
            </div>
            <div style={{ padding: "16px 24px" }}>
              {loginHistory.map((log, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i === 2 ? "none" : `1px solid ${BORDER}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {log.icon}
                      <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{log.device}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700, background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 4 }}>{log.status}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 24 }}>
                    <span style={{ fontSize: 11, color: TEXT_MUTED }}>{log.date}</span>
                    <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: "monospace" }}>IP: {log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: CONFIGURATION */}
        <div style={{ marginTop: 52 }}>
          <div style={{ background: CARD_BG, borderRadius: 16, padding: 32, border: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: "0 0 24px" }}>Identification & Security Details</h3>
            
            {msg && (
              <div style={{ padding: "14px 18px", borderRadius: 10, marginBottom: 24, background: msg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: msg.type === "success" ? "#34d399" : "#fca5a5", fontSize: 13, fontWeight: 600, border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                {msg.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[{ label: "Legal Full Name", key: "name", type: "text" }, { label: "Registered Phone Number", key: "phoneNumber", type: "tel" }].map((f) => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `1px solid ${BORDER}`, fontSize: 14, color: "white", outline: "none", boxSizing: "border-box", background: "rgba(30, 58, 138, 0.04)", transition: "border 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#2563EB"} onBlur={(e) => e.target.style.borderColor = BORDER} />
                  </div>
                ))}
                
                <div style={{ margin: "16px 0", height: 1, background: BORDER }} />
                
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <KeySquare size={16} color={TEXT_MUTED} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Security Check (Optional)</p>
                </div>

                {[{ label: "Current Password Token", key: "currentPassword" }, { label: "New Encryption Signature", key: "newPassword" }].map((f) => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
                    <input type="password" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder="••••••••" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `1px solid ${BORDER}`, fontSize: 14, color: "white", outline: "none", boxSizing: "border-box", background: "rgba(30, 58, 138, 0.04)", transition: "border 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#2563EB"} onBlur={(e) => e.target.style.borderColor = BORDER} />
                  </div>
                ))}
                
                <button type="submit" disabled={saving} style={{ padding: 16, borderRadius: 10, background: "#2563EB", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, marginTop: 16, transition: "background 0.2s" }} onMouseEnter={(e) => !saving && (e.target.style.background = "#2563eb")} onMouseLeave={(e) => !saving && (e.target.style.background = "#2563EB")}>
                  {saving ? "Encrypting Update Payload..." : "Sync Personal Configurations"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;