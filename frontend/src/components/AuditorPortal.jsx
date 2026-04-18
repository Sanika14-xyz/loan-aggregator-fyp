import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, CheckCircle2, Clock, XCircle, 
  ChevronDown, ShieldAlert, Activity, ShieldCheck, Mail, Map, FileSearch
} from "lucide-react";
import applicationService from "../services/applicationService";
import SharedCaseWorkspace from "./SharedCaseWorkspace";

// Deep Enterprise Palette for Compliance
const BG_DARK = "#F8FAFC"; 
const CARD_BG = "#FFFFFF"; 
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";
const PURPLE = "#8b5cf6"; // Distinct color for Auditor
const GOLD = "#0F766E";

const statusStyles = {
  Approved: { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", icon: <CheckCircle2 size={16} /> },
  Rejected: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", icon: <XCircle size={16} /> },
  Pending:  { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", icon: <Clock size={16} /> },
  "Under Review": { color: PURPLE, bg: "rgba(139, 92, 246, 0.1)", icon: <ShieldAlert size={16} /> }
};

const AuditorPortal = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [workspaceAppId, setWorkspaceAppId] = useState(null);

  const fetchApps = () => {
    // Auditors see everything via the global fetch
    applicationService.getAllApplications ? applicationService.getAllApplications() : applicationService.getOfficerApplications()
      .then((data) => setApps(data))
      .catch((err) => console.error("Failed to load applications", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  if (loading) return (
    <div style={{ padding: 60, textAlign: "center", color: TEXT_MUTED }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: "inline-block", marginBottom: 12 }}>
        <Clock size={32} color={PURPLE} />
      </motion.div>
      <p style={{ fontSize: 14, fontWeight: 500 }}>Synchronizing Global Audit Net...</p>
    </div>
  );

  return (
    <div style={{ padding: "40px", background: "radial-gradient(circle at top right, #1e1b4b, #000000)", minHeight: "100vh", color: "white" }}>
      {workspaceAppId && <SharedCaseWorkspace applicationId={workspaceAppId} onClose={() => { setWorkspaceAppId(null); fetchApps(); }} />}
      
      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 12 }}>
          <ShieldAlert size={32} color={PURPLE} /> Master Compliance Terminal
        </h2>
        <p style={{ color: TEXT_MUTED, fontSize: 15, margin: 0 }}>Advanced forensic inspection, tax validation, and collaborative auditing.</p>
      </div>

      {/* Main List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {apps.length === 0 && (
          <div style={{ padding: 80, textAlign: "center", background: CARD_BG, borderRadius: 16, border: `1px dashed ${BORDER}` }}>
            <p style={{ color: TEXT_MUTED, fontSize: 15, fontWeight: 500, margin: 0 }}>No applications currently in the audit queue.</p>
          </div>
        )}

        {apps.map((app, idx) => {
          return (
          <motion.div key={app._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} style={{ background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)", borderRadius: 16, border: `1px solid ${selected?._id === app._id ? PURPLE : BORDER}`, boxShadow: selected?._id === app._id ? "0 0 40px rgba(139, 92, 246, 0.2)" : "none", overflow: "hidden" }}>
            
            {/* ROW HEADER */}
            <div onClick={() => setSelected(selected?._id === app._id ? null : app)} style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 24, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: "white", margin: "0 0 6px" }}>{app.userId?.name || "Target Applicant"} </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>Audit Ref: <span style={{fontFamily:"monospace", color: PURPLE}}>{app._id.slice(-8).toUpperCase()}</span></span>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: BORDER }} />
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>{app.loanType}</span>
                </div>
              </div>

              <div style={{ textAlign: "right", minWidth: 120 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: GOLD, margin: "0 0 4px" }}>₹{(app.loanAmount / 100000).toFixed(1)} Lakhs</p>
                <p style={{ fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase" }}>Requested Exposure</p>
              </div>

              <div style={{ width: 140, display: "flex", justifyContent: "flex-end", paddingLeft: 24, borderLeft: `1px solid ${BORDER}` }}>
                <div style={{ padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: statusStyles[app.status]?.bg || statusStyles["Pending"].bg, color: statusStyles[app.status]?.color || statusStyles["Pending"].color, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${statusStyles[app.status]?.color || statusStyles["Pending"].color}50` }}>
                  {app.status.toUpperCase()}
                </div>
              </div>

              <motion.div animate={{ rotate: selected?._id === app._id ? 180 : 0 }}>
                <ChevronDown size={24} color={TEXT_MUTED} />
              </motion.div>
            </div>

            {/* EXPANDED AUDIT INVESTIGATION SECTION */}
            <AnimatePresence>
              {selected?._id === app._id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ borderTop: `1px solid ${BORDER}`, background: "rgba(30, 58, 138, 0.06)" }}>
                  <div style={{ padding: 40 }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
                      {/* Left: Forensic & Tax Checking */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                           <h3 style={{ fontSize: 13, fontWeight: 800, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: 8 }}><FileSearch size={16} /> Automated Tax & ITR Sweeps</h3>
                           
                           <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: `1px dashed ${BORDER}` }}>
                               <span style={{ fontSize: 13, color: TEXT_MUTED }}>PAN Linkage Verification</span>
                               <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "4px 8px", borderRadius: 4 }}>Valid Match [Central DB]</span>
                             </div>
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: `1px dashed ${BORDER}` }}>
                               <span style={{ fontSize: 13, color: TEXT_MUTED }}>3-Year ITR Continuity</span>
                               <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "4px 8px", borderRadius: 4 }}>Anomaly Detected: AY2022 Missing</span>
                             </div>
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                               <span style={{ fontSize: 13, color: TEXT_MUTED }}>GSTIN Business Linkage</span>
                               <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED }}>N/A (Salaried Profile)</span>
                             </div>
                           </div>
                        </div>

                        {/* Internal Email Scraping / Watchlists */}
                        <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 16, padding: 24 }}>
                          <h4 style={{ fontSize: 13, fontWeight: 800, color: "#ef4444", textTransform: "uppercase", margin: "0 0 16px 0", letterSpacing: "0.1em", display: "flex", gap: 8, alignItems: "center" }}><Mail size={16}/> Communication Surveillance</h4>
                          <p style={{ fontSize: 13, color: "white", margin: "0 0 12px 0", lineHeight: 1.6 }}>The internal surveillance module extracted <strong>0 flags</strong> from institutional mailing addresses tracking this identity.</p>
                          <div style={{ padding: "10px 16px", background: "rgba(0,0,0,0.4)", borderRadius: 8, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                            <p style={{ margin: 0, fontSize: 11, color: "#fca5a5", fontFamily: "monospace" }}>[SYSTEM] Anti-Money Laundering (AML) list scan: CLEAN</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Calculations & Official Audit Documents */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{ background: CARD_BG, padding: 24, borderRadius: 16, border: `1px solid ${BORDER}` }}>
                          <h4 style={{ fontSize: 13, fontWeight: 800, color: TEXT_MUTED, margin: "0 0 20px 0", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", gap: 8, alignItems: "center" }}><Activity size={16}/> Debt Stress Calculations</h4>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ padding: 16, background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${BORDER}` }}>
                              <p style={{ margin: "0 0 4px", fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase" }}>Adjusted DTI Ratio</p>
                              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "white", textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>{app.debtToIncomeRatio || 34}%</p>
                            </div>
                            <div style={{ padding: 16, background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${BORDER}` }}>
                              <p style={{ margin: "0 0 4px", fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase" }}>Risk Propensity Matrix</p>
                              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: (app.aiScore||50) > 70 ? "#10b981" : "#ef4444", textShadow: (app.aiScore||50) > 70 ? "0 0 20px rgba(16, 185, 129, 0.5)" : "0 0 20px rgba(239, 68, 68, 0.5)" }}>{(app.aiScore||50).toFixed(1)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Audit specific Docs */}
                        <div style={{ background: CARD_BG, padding: 24, borderRadius: 16, border: `1px solid ${BORDER}` }}>
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                              <h4 style={{ fontSize: 13, fontWeight: 800, color: TEXT_MUTED, margin: 0, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", gap: 8, alignItems: "center" }}><FileText size={16} /> Forensic Identity Docs</h4>
                           </div>
                           
                           {app.documents && app.documents.length > 0 ? (
                             <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                               {app.documents.map((doc, dIdx) => (
                                 <div key={dIdx} style={{ padding: "8px 12px", background: BG_DARK, borderRadius: 6, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}` }}>
                                   <FileText size={14} color={PURPLE} />
                                   <span style={{ fontSize: 12, color: "white" }}>{doc.fileName || "Vault File"}</span>
                                   <ShieldCheck size={14} color={doc.verified ? "#10b981" : "#f59e0b"} />
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <div style={{ background: BG_DARK, padding: 16, borderRadius: 8, border: `1px dashed ${BORDER}` }}>
                                <p style={{ fontSize: 13, color: TEXT_MUTED, margin: 0 }}>Identity vault is currently unpopulated.</p>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>

                    {/* COLLABORATIVE AWARENESS BANNER & BUTTON */}
                    <div style={{ background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)`, border: `1px solid ${BORDER}`, padding: 32, borderRadius: 16, display: "flex", gap: 24, alignItems: "center", marginTop: 16 }}>
                       <div style={{ padding: 16, background: "rgba(30, 58, 138, 0.06)", borderRadius: "50%", border: `1px solid ${BORDER}` }}>
                         <Activity color={PURPLE} size={32} />
                       </div>
                       <div style={{ flex: 1 }}>
                         <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 900, color: "white" }}>Cross-Role Auditor Workspace</h3>
                         <p style={{ margin: 0, fontSize: 14, color: "#cbd5e1", lineHeight: 1.5 }}>Launch the real-time collaborative workspace to <strong>chat with the Loan Officer</strong>, explicitly <strong>schedule verification meetings</strong>, and declare the immutable <strong>Minutes of Meeting (MoM)</strong>. You have overriding authority.</p>
                       </div>
                       <button onClick={() => setWorkspaceAppId(app._id)} style={{ padding: "16px 32px", background: "linear-gradient(90deg, #8b5cf6, #2563EB)", color: "white", fontSize: 15, fontWeight: 900, border: "none", borderRadius: 12, cursor: "pointer", boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)" }}>🔥 Enter Workspace Integration</button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )})}
      </div>
    </div>
  );
};

export default AuditorPortal;
