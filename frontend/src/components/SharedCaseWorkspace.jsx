import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MessageSquare, Calendar, FileText, CheckCircle,
  AlertTriangle, ShieldAlert, Send, Video, Download, User,
  Award, BookOpen, Sparkles, Lock, Scale, Gavel, Building2,
  ClipboardList, PenLine, BadgeCheck, XCircle, RefreshCw, ChevronRight, ChevronDown
} from "lucide-react";
import API from "../services/api";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

// Institutional CRM Palette
const BORDER = "#D1D5DB";
const TEXT_MUTED = "#6B7280";
const BLUE = "#0055FE";
const NAVY = "#051C2C";
const BG_STARK = "#FFFFFF";

// ─── RULEBOOK DATA (Functional Requirement) ──────────────────────────────────
const RULEBOOK = [
  {
    category: "RBI Directives",
    color: "#2563EB",
    icon: <Building2 size={16} />,
    rules: [
      { id: "RBI-01", title: "Fair Practices Code – Loan Processing", desc: "Per RBI Master Circular: All loan applications must be acknowledged. Decisions must be conveyed within 30 days. Rejection reasons must be communicated in writing." },
      { id: "RBI-02", title: "KYC / AML Compliance", desc: "RBI KYC Master Direction 2016 (Amended 2024): Lenders must verify PAN, Aadhaar, and photograph. Video-KYC is permitted." },
      { id: "RBI-03", title: "CIBIL Credit Score Threshold", desc: "Recommended minimum CIBIL score of 700 for secured loans. Sub-700 applications require enhanced risk commentary." }
    ]
  },
  {
    category: "Banking Regulations",
    color: "#10B981",
    icon: <Gavel size={16} />,
    rules: [
      { id: "BANK-01", title: "NPA Classification (IRAC Norms)", desc: "IRAC: Loan becomes NPA if overdue > 90 days. Provisioning applies per category." },
      { id: "BANK-02", title: "SARFAESI Act 2002", desc: "Secured creditors can issue 60-day notice and take possession of collateral without court intervention for NPAs." }
    ]
  }
];

// ─── AI MOM GENERATION LOGIC (Functional Requirement) ──────────────────────
const generateAIMomDraft = (app) => {
  const score = app.aiScore || 50;
  const applicantName = app.userId?.name || "Member";
  const loanType = app.loanType || "Loan";
  const loanAmt = (app.loanAmount / 100000).toFixed(1);

  let recommendation = score > 75 ? "Recommend APPROVAL" : score > 55 ? "Recommend CONDITIONAL REVIEW" : "Recommend REJECTION";
  let decision = score > 75 ? "Approved" : score > 55 ? "Flagged" : "Rejected";

  const summary = `MINUTES OF MEETING — SECURE AUDIT LOG\n\nCase Reference: ${(app._id || "N/A").slice(-8).toUpperCase()}\nApplicant: ${applicantName} | Loan: ₹${loanAmt}L ${loanType}\n\n── RISK NARRATIVE ──\nAI Risk Index: ${score}/100. Verification indicates ${score > 75 ? "low" : "marginal"} default propensity.\n\n── INSTITUTIONAL MANDATE ──\n${recommendation} based on institutional risk appetite and Basel III frameworks.\n\nThis record is immutable post-sign-off.`;

  return { summary, decision };
};

const SharedCaseWorkspace = ({ applicationId, onClose }) => {
  const { user } = useContext(AuthContext);
  const [app, setApp] = useState(null);
  const { notify } = useNotification();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [chatInput, setChatInput] = useState("");
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isMomOpen, setIsMomOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const [meetingForm, setMeetingForm] = useState({ date: "", time: "", link: "", reason: "KYC Authentication" });
  const [momForm, setMomForm] = useState({ summary: "", decision: "Pending" });

  const chatEndRef = useRef(null);

  const fetchApp = async () => {
    try {
      const res = await API.get(`/applications/${applicationId}`);
      setApp(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApp(); }, [applicationId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [app?.chatLog]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    try {
      const res = await API.post(`/applications/${applicationId}/chat`, { message: chatInput });
      setApp(res.data);
      setChatInput("");
    } catch (err) { notify("error", "Comms Failure", "Unable to transmit message to the secure channel."); }
  };

  const handleDecision = async (decision) => {
    try {
      const res = await API.put(`/applications/${applicationId}/dual-decision`, { decision });
      setApp(res.data);
      notify("success", "Decision Recorded", "Mandate has been successfully synchronized across the dual sign-off ledger.");
    } catch (err) { notify("error", "Consensus Failure", "Unable to record dual-decision at this time."); }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/applications/${applicationId}/meeting`, meetingForm);
      setApp(res.data);
      setIsMeetingOpen(false);
      notify("success", "Meeting Broadcasted", "Institutional VC link has been transmitted to all stakeholders.");
    } catch (err) { notify("error", "Broadcast Failure", "Network failure prevented meeting dispatch."); }
  };

  const handleSubmitMOM = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/applications/${applicationId}/mom`, momForm);
      setApp(res.data);
      setIsMomOpen(false);
      notify("success", "MoM Locked", "Minutes of Meeting have been recorded and locked in the immutable audit trail.");
    } catch (err) { notify("error", "Registry Failure", "Unable to commit MoM to the audit registry."); }
  };

  const handleAiMom = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const draft = generateAIMomDraft(app);
      setMomForm(draft);
      setAiGenerating(false);
      setIsMomOpen(true);
    }, 1500);
  };

  if (loading || !app) return (
    <div style={{ position: "fixed", inset: 0, background: "white", zSize: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em" }}>INITIATING SECURE WORKSPACE...</p>
    </div>
  );

  const isOfficer = user?.role === "loan_officer";
  const isAuditor = user?.role === "compliance_auditor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: "fixed", inset: "0px", zIndex: 9999,
        background: "#FFFFFF", display: "grid", gridTemplateColumns: "1fr 400px",
        fontFamily: "'Inter', sans-serif", color: "#111827"
      }}
    >
      {/* ── MAIN CONTENT ── */}
      <div style={{ display: "flex", flexDirection: "column", borderRight: `1px solid ${BORDER}`, overflow: "hidden" }}>
        
        {/* Workspace Header */}
        <header style={{ padding: "40px 60px", borderBottom: `1px solid ${BORDER}`, background: NAVY, color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "-0.02em" }}>Institutional Collaboration Workspace</h2>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Case ID: {app._id.toUpperCase()} | Applicant: {app.userId?.name}</p>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>EXIT WORKSPACE</button>
          </div>

          <nav style={{ display: "flex", gap: 32 }}>
            {["overview", "documents", "meetings", "rulebook"].map(t => (
              <button 
                key={t} onClick={() => setActiveTab(t)}
                style={{ 
                  background: "none", border: "none", color: activeTab === t ? "white" : "rgba(255,255,255,0.4)", 
                  fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer",
                  padding: "10px 0", borderBottom: activeTab === t ? `2px solid ${BLUE}` : "2px solid transparent"
                }}
              >
                {t}
              </button>
            ))}
          </nav>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "60px" }}>
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                
                {/* AI Underwriting Narrative */}
                <div style={{ background: "#F9FAFB", padding: 40, border: `1px solid ${BORDER}`, marginBottom: 40 }}>
                  <h4 style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 800, color: BLUE, textTransform: "uppercase" }}>AI UNDERWRITING SUMMARY</h4>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151" }}>
                    The proprietary risk engine has assigned an Institutional Score of **{app.aiScore}/100**. 
                    Based on market volatility and applicant's debt-to-income ratio of {app.debtToIncomeRatio}%, 
                    the system recommends a {app.aiScore > 70 ? "unanimous Approval" : "detailed manual audit"}.
                  </p>
                </div>

                {/* Dual Decision Panel */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div style={{ background: "white", border: `2px solid ${app.officerDecision === 'Approved' ? '#10B981' : BORDER}`, padding: 30 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 16 }}>Loan Officer Adjudication</p>
                    <p style={{ fontSize: 20, fontWeight: 700, margin: "0 0 24px" }}>{app.officerDecision || "PENDING"}</p>
                    {isOfficer && (
                      <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => handleDecision("Approved")} style={{ flex: 1, padding: 12, background: "#10B981", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>APPROVE</button>
                        <button onClick={() => handleDecision("Rejected")} style={{ flex: 1, padding: 12, background: "white", color: "#CC0000", border: "1px solid #CC0000", fontWeight: 700, cursor: "pointer" }}>DECLINE</button>
                      </div>
                    )}
                  </div>

                  <div style={{ background: "white", border: `2px solid ${app.auditorDecision === 'Approved' ? '#10B981' : BORDER}`, padding: 30 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 16 }}>Compliance Auditor Mandate</p>
                    <p style={{ fontSize: 20, fontWeight: 700, margin: "0 0 24px" }}>{app.auditorDecision || "PENDING"}</p>
                    {isAuditor && (
                      <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => handleDecision("Approved")} style={{ flex: 1, padding: 12, background: "#10B981", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>ATTEST</button>
                        <button onClick={() => handleDecision("Flagged")} style={{ flex: 1, padding: 12, background: "white", color: "#F59E0B", border: "1px solid #F59E0B", fontWeight: 700, cursor: "pointer" }}>FLAG ISSUE</button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", marginBottom: 30 }}>KYC Document Registry</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {app.documents?.map((doc, idx) => (
                    <div key={idx} style={{ padding: 24, border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <FileText size={20} color={BLUE} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{doc.fileName}</p>
                          <p style={{ margin: 0, fontSize: 11, color: TEXT_MUTED }}>Status: {doc.verified ? "Digitally Verified" : "Verification Pending"}</p>
                        </div>
                      </div>
                      <button style={{ padding: "8px 16px", background: "white", border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>VIEW</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MEETINGS TAB */}
            {activeTab === "meetings" && (
              <motion.div key="meet" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                  <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", margin: 0 }}>Case Meetings & MoM</h3>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={handleAiMom} style={{ padding: "12px 24px", background: "#F9FAFB", border: `1px solid ${BORDER}`, fontWeight: 800, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                      {aiGenerating ? "ANALYSING..." : <><Sparkles size={14} /> DRAFT AI MOM</>}
                    </button>
                    <button onClick={() => setIsMeetingOpen(true)} style={{ padding: "12px 24px", background: BLUE, color: "white", border: "none", fontWeight: 800, fontSize: 11, cursor: "pointer" }}>SCHEDULE VC</button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                   <div>
                     <p style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 16 }}>Historical Meetings</p>
                     {app.meetings?.map((m, idx) => (
                       <div key={idx} style={{ padding: 20, border: `1px solid ${BORDER}`, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                         <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{m.date} | {m.time} - {m.reason}</p>
                         <a href={m.link} style={{ color: BLUE, fontSize: 12, fontWeight: 800, textDecoration: "none" }}>JOIN ROOM</a>
                       </div>
                     ))}
                   </div>
                   
                   <div>
                     <p style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 16 }}>Minutes of Meeting (MoM) Logs</p>
                     {app.moms?.map((mom, idx) => (
                       <div key={idx} style={{ padding: 30, border: `1px solid ${BORDER}`, background: "#F9FAFB" }}>
                         <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{mom.summary}</pre>
                         <p style={{ marginTop: 20, fontSize: 12, fontWeight: 800, color: BLUE }}>MANDATE: {mom.decision.toUpperCase()}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </motion.div>
            )}

            {/* RULEBOOK TAB */}
            {activeTab === "rulebook" && (
              <motion.div key="rules" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {RULEBOOK.map(sec => (
                  <div key={sec.category} style={{ marginBottom: 40 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 800, color: sec.color, textTransform: "uppercase", marginBottom: 20 }}>{sec.category}</h4>
                    {sec.rules.map(r => (
                      <div key={r.id} style={{ padding: 24, border: `1px solid ${BORDER}`, marginBottom: 12 }}>
                         <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>{r.id}: {r.title}</p>
                         <p style={{ margin: 0, fontSize: 13, color: TEXT_MUTED }}>{r.desc}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT PANEL (SECURE CHAT) ── */}
      <div style={{ display: "flex", flexDirection: "column", background: "#F9FAFB" }}>
        
        <div style={{ padding: "40px 30px", borderBottom: `1px solid ${BORDER}`, background: NAVY, color: "white" }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 4px", textTransform: "uppercase" }}>Encrypted Comms</h3>
          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Live Audit Channel | End-to-End Logged</p>
        </div>

        <div style={{ flex: 1, padding: 30, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {app.chatLog?.map((chat, idx) => (
            <div key={idx} style={{ background: "white", padding: 16, border: `1px solid ${BORDER}`, borderRadius: 4 }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 800, color: BLUE }}>{chat.sender.toUpperCase()}</p>
              <p style={{ margin: 0, fontSize: 13 }}>{chat.message}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendChat} style={{ padding: 24, borderTop: `1px solid ${BORDER}`, background: "white" }}>
          <input 
            type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
            placeholder="Secure transmission..."
            style={{ width: "100%", padding: 16, border: `1px solid ${BORDER}`, outline: "none", fontSize: 13 }}
          />
        </form>
      </div>

      {/* ── MODALS ── */}
      {isMeetingOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form style={{ background: "white", padding: 40, width: 400, border: `1px solid ${NAVY}` }} onSubmit={handleScheduleMeeting}>
            <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 800 }}>SCHEDULE VERIFICATION</h3>
            <input type="date" value={meetingForm.date} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${BORDER}` }} required />
            <input type="time" value={meetingForm.time} onChange={e => setMeetingForm({...meetingForm, time: e.target.value})} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${BORDER}` }} required />
            <input type="text" placeholder="VC Link" value={meetingForm.link} onChange={e => setMeetingForm({...meetingForm, link: e.target.value})} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${BORDER}` }} required />
            <input type="text" placeholder="Reason" value={meetingForm.reason} onChange={e => setMeetingForm({...meetingForm, reason: e.target.value})} style={{ width: "100%", padding: 12, marginBottom: 24, border: `1px solid ${BORDER}` }} required />
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setIsMeetingOpen(false)} style={{ flex: 1, padding: 12 }}>CANCEL</button>
              <button type="submit" style={{ flex: 1, padding: 12, background: BLUE, color: "white", border: "none" }}>SCHEDULE</button>
            </div>
          </form>
        </div>
      )}

      {isMomOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form style={{ background: "white", padding: 40, width: 600, border: `1px solid ${NAVY}` }} onSubmit={handleSubmitMOM}>
            <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 800 }}>MINUTES OF MEETING</h3>
            <textarea value={momForm.summary} onChange={e => setMomForm({...momForm, summary: e.target.value})} style={{ width: "100%", height: 300, padding: 16, marginBottom: 20, border: `1px solid ${BORDER}`, fontFamily: "inherit" }} required />
            <select value={momForm.decision} onChange={e => setMomForm({...momForm, decision: e.target.value})} style={{ width: "100%", padding: 16, marginBottom: 30, border: `1px solid ${BORDER}` }}>
              <option value="Approved">APPROVE CASE</option>
              <option value="Flagged">FLAG FOR REVIEW</option>
              <option value="Rejected">FORCE REJECTION</option>
            </select>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setIsMomOpen(false)} style={{ flex: 1, padding: 12 }}>CANCEL</button>
              <button type="submit" style={{ flex: 1, padding: 12, background: BLUE, color: "white", border: "none" }}>COMMIT MOM</button>
            </div>
          </form>
        </div>
      )}

    </motion.div>
  );
};

export default SharedCaseWorkspace;
