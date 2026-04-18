import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Download, CheckCircle2, Clock, XCircle, 
  ChevronDown, ShieldAlert, BarChart3, User, Landmark, ShieldCheck, Target, Award, Search, ArrowUpDown, BellRing, Activity, Video, Calendar 
} from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import applicationService from "../services/applicationService";
import SharedCaseWorkspace from "./SharedCaseWorkspace";

// Institutional CRM Palette
const BG_DARK = "#FFFFFF"; 
const CARD_BG = "#FFFFFF"; 
const BORDER = "#D1D5DB";
const TEXT_MUTED = "#6B7280";
const NAVY = "#051C2C";
const BLUE = "#0055FE";

const statusStyles = {
  Approved: { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", icon: <CheckCircle2 size={16} /> },
  Rejected: { color: "#CC0000", bg: "rgba(204, 0, 0, 0.1)", icon: <XCircle size={16} /> },
  Pending:  { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: <Clock size={16} /> }
};

const LoanOfficerPortal = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [updating, setUpdating] = useState(false);
  const [workspaceAppId, setWorkspaceAppId] = useState(null);
  const { notify, confirm } = useNotification();

  const fetchApps = () => {
    applicationService.getOfficerApplications()
      .then((data) => setApps(data))
      .catch((err) => console.error("Failed to load applications", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    confirm(
      "Confirm Action",
      `Are you sure you wish to mark this institutional application as ${newStatus}? This action will be logged in the audit trail.`,
      async () => {
        setUpdating(true);
        try {
          await applicationService.updateApplicationStatus(id, newStatus, remarks);
          setRemarks(""); setSelected(null); fetchApps();
          notify("success", "Status Synchronized", `Case has been moved to ${newStatus} state successfully.`);
        } catch (err) { 
          notify("error", "Sync Failure", "Unable to transmit status update to the core banking ledger."); 
        } finally { 
          setUpdating(false); 
        }
      }
    );
  };

  const getWellness = (app) => {
    const base = Number(app.aiScore) || 50;
    return {
      score: base,
      income: Math.min(base + 8, 100),
      savings: Math.min(base - 5, 100),
      debt: Math.min(base + 2, 100),
      behavior: Math.min(base + 12, 100),
      credit: Math.min(base + 5, 100),
      crisis: base < 50 ? "High Risk" : base < 72 ? "Moderate Risk" : "Optimized Low Risk",
      xai: [
        { feature: "Income-to-Debt Engine", impact: (app.debtToIncomeRatio || 0) < 40 ? "+12%" : "-15%" },
        { feature: "Credit Consistency", impact: base > 70 ? "+18%" : "-8%" },
        { feature: "Loan Amount Solvency", impact: (app.loanAmount || 0) > 2000000 ? "-5%" : "+4%" }
      ]
    };
  };

  if (loading) return (
    <div style={{ padding: 100, textAlign: "center", color: TEXT_MUTED }}>
      <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Synchronizing CRM Data...</p>
    </div>
  );

  let processedApps = apps.filter((a) => {
    const matchesFilter = filter === "All" || a.status === filter;
    const s = searchTerm.toLowerCase();
    const matchesSearch = (a.userId?.name || "").toLowerCase().includes(s) || 
                          (a._id || "").toLowerCase().includes(s) ||
                          (a.loanType || "").toLowerCase().includes(s);
    return matchesFilter && matchesSearch;
  });

  processedApps.sort((a, b) => {
    if (sortBy === "AI_Score") return (Number(b.aiScore) || 0) - (Number(a.aiScore) || 0);
    if (sortBy === "Amount") return b.loanAmount - a.loanAmount;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const totalPend = apps.filter(a => a.status === "Pending").length;
  const avgScore = apps.length ? Math.round(apps.reduce((acc, a) => acc + (a.aiScore||50), 0) / apps.length) : 0;
  let missingDocs = 0;
  apps.forEach(a => { if(!a.documents || a.documents.length === 0 || a.documents.some(d => !d.verified)) missingDocs++; });

  return (
    <div style={{ padding: "60px", background: "#FFFFFF", minHeight: "100vh", color: "#111827" }}>
      {workspaceAppId && <SharedCaseWorkspace applicationId={workspaceAppId} onClose={() => { setWorkspaceAppId(null); fetchApps(); }} />}
      
      {/* 🏛️ INSTITUTIONAL HEADER */}
      <div style={{ marginBottom: 60, borderBottom: "2px solid #051C2C", paddingBottom: 30 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "-0.02em" }}>Officer Adjudication Center</h2>
        <p style={{ color: TEXT_MUTED, fontSize: 16, margin: 0 }}>Review and adjudicate institutional loan requests within the sovereign risk framework.</p>
      </div>

      {/* KPI GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginBottom: 60 }}>
        {[
          { label: "Active Nodes", val: apps.length, color: "#111827" },
          { label: "Pending Adjudication", val: totalPend, color: "#0055FE" },
          { label: "AI Wellness Score", val: `${avgScore}/100`, color: "#10B981" },
          { label: "KYC Anomalies", val: missingDocs, color: "#CC0000" }
        ].map((kpi, idx) => (
          <div key={idx} style={{ background: "#FFFFFF", padding: "30px", border: "1px solid #D1D5DB" }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 16px 0" }}>{kpi.label}</p>
            <p style={{ fontSize: 36, fontWeight: 700, margin: 0, color: kpi.color }}>{kpi.val}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ marginBottom: 32, display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: 14, color: TEXT_MUTED }} />
          <input 
            type="text" 
            placeholder="Search Registry..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ width: "100%", padding: "14px 16px 14px 48px", border: `1px solid ${BORDER}`, outline: "none", fontSize: 14, background: "#F9FAFB" }} 
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["All", "Pending", "Approved", "Rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "12px 24px", background: filter === f ? NAVY : "white", color: filter === f ? "white" : TEXT_MUTED, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {processedApps.map((app, idx) => (
          <div key={app._id} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, marginBottom: -1 }}>
            <div onClick={() => setSelected(selected?._id === app._id ? null : app)} style={{ padding: "24px 40px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.5fr", alignItems: "center", cursor: "pointer" }}>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{app.userId?.name || "Member"}</p>
                <p style={{ margin: 0, fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", fontWeight: 700 }}>{app.loanType}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", fontWeight: 800 }}>Principal</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>₹{app.loanAmount.toLocaleString()}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", fontWeight: 800 }}>Risk Score</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: app.aiScore > 75 ? "#10B981" : "#F59E0B" }}>{app.aiScore}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ padding: "6px 16px", background: statusStyles[app.status]?.bg, color: statusStyles[app.status]?.color, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>{app.status}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <ChevronDown size={20} style={{ transform: selected?._id === app._id ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }} />
              </div>
            </div>

            <AnimatePresence>
              {selected?._id === app._id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", background: "#F9FAFB" }}>
                  <div style={{ padding: "40px 40px 60px", borderTop: `1px solid ${BORDER}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
                      
                      {/* Left: Financial DNA */}
                      <div>
                        <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 30, color: NAVY }}>Financial Intelligence DNA</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                          {[
                            { label: "Stability Index", val: getWellness(app).income, color: BLUE },
                            { label: "Liquidity Buffer", val: getWellness(app).savings, color: "#10B981" },
                            { label: "Credit Exposure", val: getWellness(app).credit, color: "#8B5CF6" }
                          ].map(trait => (
                            <div key={trait.label}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, fontWeight: 700 }}>
                                <span>{trait.label}</span>
                                <span>{trait.val}%</span>
                              </div>
                              <div style={{ width: "100%", height: 3, background: "#E5E7EB" }}>
                                <div style={{ width: `${trait.val}%`, height: "100%", background: trait.color }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginTop: 40, border: `1px solid ${BORDER}`, padding: 24, background: "white" }}>
                           <h5 style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 800, color: TEXT_MUTED }}>WORKSPACE COLLABORATION</h5>
                           <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 20 }}>This node is linked to the Institutional Auditor workspace for real-time risk verification.</p>
                           <button onClick={() => setWorkspaceAppId(app._id)} style={{ width: "100%", padding: 14, background: NAVY, color: "white", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" }}>Open Workspace</button>
                        </div>
                      </div>

                    </div>

                    {/* 🕵️ AUDITOR COLLABORATION LOGS */}
                    {(app.meetings?.length > 0 || app.moms?.length > 0) && (
                      <div style={{ marginTop: 48, borderTop: `1px solid ${BORDER}`, paddingTop: 40 }}>
                         <h4 style={{ fontSize: 12, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                           <ShieldAlert size={16} color={BLUE} /> Institutional compliance Registry
                         </h4>
                         
                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                            {/* Verification Schedule */}
                            {app.meetings?.length > 0 && (
                              <div style={{ background: "white", padding: 24, border: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 16 }}>Verification Schedule</p>
                                {app.meetings.map((m, mIdx) => (
                                  <div key={mIdx} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: mIdx < app.meetings.length-1 ? `1px solid #F3F4F6` : "none" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                      <span style={{ fontSize: 13, fontWeight: 700 }}>VERIFICATION #{mIdx+1}</span>
                                      <span style={{ fontSize: 11, color: BLUE, fontWeight: 800 }}>{m.status}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 12, color: TEXT_MUTED }}>{new Date(m.date).toLocaleDateString()} at {m.time}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* MoM Data */}
                            {app.moms?.length > 0 && (
                              <div style={{ background: "white", padding: 24, border: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 16 }}>Minutes of Meeting (MoM)</p>
                                {app.moms.map((mom, moIdx) => (
                                  <div key={moIdx} style={{ marginBottom: 20 }}>
                                    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color: BLUE }}>{mom.createdBy.toUpperCase()}</p>
                                    <p style={{ margin: "0 0 10px", fontSize: 13, color: "#111827", lineHeight: 1.5 }}>{mom.summary}</p>
                                    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", background: mom.decision === "Approved" ? "rgba(16, 185, 129, 0.1)" : "rgba(204, 0, 0, 0.1)", color: mom.decision === "Approved" ? "#10B981" : "#CC0000" }}>AUDITOR MANDATE: {mom.decision}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                         </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanOfficerPortal;
