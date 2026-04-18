import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Download, CheckCircle2, Clock, XCircle, 
  ChevronDown, ShieldAlert, BarChart3, User, Landmark, Target, Award, ArrowUpRight, Activity
} from "lucide-react";
import API from "../services/api";
import applicationService from "../services/applicationService";
import SharedCaseWorkspace from "./SharedCaseWorkspace";

const NAVY = "#051C2C";
const BLUE = "#0055FE";
const BORDER = "#D1D5DB";
const TEXT_MUTED = "#6B7280";

const statusStyles = {
  Approved: { color: "#10B981", bg: "#ECFDF5", icon: <CheckCircle2 size={14} /> },
  Rejected: { color: "#EF4444", bg: "#FEF2F2", icon: <XCircle size={14} /> },
  Pending:  { color: "#F59E0B", bg: "#FFFBEB", icon: <Clock size={14} /> },
  "Under Review": { color: BLUE, bg: "#EFF6FF", icon: <Activity size={14} /> }
};

const ApplicationTracker = ({ role }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [updating, setUpdating] = useState(false);
  const [workspaceAppId, setWorkspaceAppId] = useState(null);
  const [letterView, setLetterView] = useState(null);
  const [signView, setSignView] = useState(null);
  const [signatureInput, setSignatureInput] = useState("");
  const [bankDetails, setBankDetails] = useState({ accountName: "", accountNumber: "", ifscCode: "" });

  const isAdmin = role === "admin" || role === "loan_officer" || role === "compliance_auditor";

  const fetchApps = () => {
    API.get(isAdmin ? "/applications" : "/applications/my")
      .then((r) => setApps(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, [isAdmin]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true);
    try {
      await applicationService.updateApplicationStatus(id, newStatus, remarks);
      setRemarks(""); setSelected(null); fetchApps();
    } catch (err) { alert("Update failed"); } finally { setUpdating(false); }
  };

  if (loading) return (
    <div style={{ padding: 100, textAlign: "center", color: NAVY }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: "inline-block", marginBottom: 20 }}>
        <Activity size={40} color={BLUE} />
      </motion.div>
      <p style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Synchronizing Institutional Ledger...</p>
    </div>
  );

  const filtered = filter === "All" ? apps : apps.filter((a) => a.status === f);

  return (
    <div style={{ padding: "40px", background: "#FFFFFF", minHeight: "100vh", color: NAVY }}>
      {workspaceAppId && <SharedCaseWorkspace applicationId={workspaceAppId} onClose={() => { setWorkspaceAppId(null); fetchApps(); }} />}
      
      {/* 🏛️ INSTITUTIONAL HEADER */}
      <div style={{ marginBottom: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${BORDER}`, paddingBottom: 40 }}>
        <div>
           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Landmark size={24} color={BLUE} />
              <span style={{ fontSize: 10, fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: "0.2em" }}>Credify Institutional Hub</span>
           </div>
           <h2 style={{ fontSize: 40, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
             {isAdmin ? "Global Application Registry" : "My Credit Portfolio"}
           </h2>
           <p style={{ color: TEXT_MUTED, fontSize: 16, marginTop: 8 }}>Managing {apps.length} high-fidelity capital allocation nodes.</p>
        </div>
        
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Approved", "Pending", "Rejected"].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              style={{ 
                padding: "10px 24px", background: filter === f ? NAVY : "white", color: filter === f ? "white" : NAVY,
                border: `1px solid ${filter === f ? NAVY : BORDER}`, fontSize: 11, fontWeight: 800, cursor: "pointer", 
                textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s"
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
        {apps.length === 0 && (
          <div style={{ padding: 100, textAlign: "center", border: `1px dashed ${BORDER}` }}>
            <p style={{ color: TEXT_MUTED, fontSize: 14, fontWeight: 600 }}>No institutional data available for this registry segment.</p>
          </div>
        )}

        {apps.map((app, idx) => (
          <motion.div 
            key={app._id} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.05 }}
            style={{ 
              background: "#FFFFFF", border: `1px solid ${BORDER}`, marginBottom: -1,
              transition: "all 0.2s"
            }}
          >
            {/* ROW HEADER */}
            <div 
              onClick={() => setSelected(selected?._id === app._id ? null : app)}
              style={{ padding: "30px 40px", display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 0.2fr", alignItems: "center", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{app.bankId?.name}</h3>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                   <span style={{ fontSize: 10, fontWeight: 800, color: BLUE, textTransform: "uppercase" }}>{app.loanType}</span>
                   <span style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED }}>REF: {app._id.slice(-8).toUpperCase()}</span>
                </div>
              </div>

              <div>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>Principal Allocation</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>₹{app.loanAmount.toLocaleString()}</p>
              </div>

              <div>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>AI Score</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 40, height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${app.aiScore || 70}%`, height: "100%", background: (app.aiScore || 70) > 80 ? "#10B981" : "#F59E0B" }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: (app.aiScore || 70) > 80 ? "#10B981" : "#F59E0B" }}>{app.aiScore || 70}%</span>
                </div>
              </div>

              <div>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>Applied On</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{new Date(app.createdAt).toLocaleDateString()}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ 
                  padding: "6px 16px", background: statusStyles[app.status]?.bg, color: statusStyles[app.status]?.color,
                  fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em",
                  border: `1px solid ${statusStyles[app.status]?.color}40`
                }}>
                  {app.status}
                </span>
              </div>

              <div style={{ textAlign: "right" }}>
                <motion.div animate={{ rotate: selected?._id === app._id ? 180 : 0 }}>
                  <ChevronDown size={18} color={TEXT_MUTED} />
                </motion.div>
              </div>
            </div>

            {/* EXPANDED SECTION */}
            <AnimatePresence>
              {selected?._id === app._id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ borderTop: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ padding: 40, background: "#F9FAFB" }}>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40 }}>
                       {/* Left Panel: Detailed Metrics */}
                       <div style={{ background: "white", padding: 32, border: `1px solid ${BORDER}` }}>
                          <h4 style={{ margin: "0 0 24px", fontSize: 11, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Application Health Analytics</h4>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                             <div style={{ padding: "20px", background: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>Match Decision</p>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: app.status === 'Approved' ? "#10B981" : NAVY }}>{app.status.toUpperCase()}</p>
                             </div>
                             <div style={{ padding: "20px", background: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>Proposed EMI</p>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>₹{app.emi?.toLocaleString() || "Calculated at Adjudication"}</p>
                             </div>
                             <div style={{ padding: "20px", background: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>Risk Grade</p>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>CLASS-{app.riskGrade || "AAA"}</p>
                             </div>
                             <div style={{ padding: "20px", background: "#F8FAFC", border: `1px solid ${BORDER}` }}>
                                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>Tenure Horizon</p>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{app.tenure} Years</p>
                             </div>
                          </div>

                          <div style={{ marginTop: 32 }}>
                             <h5 style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>Official Adjudication Remarks</h5>
                             <p style={{ margin: 0, fontSize: 14, color: NAVY, lineHeight: 1.6 }}>{app.remarks || "No supplementary advisor notes have been logged for this node."}</p>
                          </div>
                       </div>

                       {/* Right Panel: Actions & Timeline */}
                       <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                          
                          {isAdmin && app.status === "Pending" && (
                            <div style={{ background: NAVY, color: "white", padding: 32 }}>
                               <h4 style={{ margin: "0 0 20px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Executive Adjudication</h4>
                               <textarea 
                                 placeholder="Enter institutional remarks..."
                                 value={remarks} onChange={(e) => setRemarks(e.target.value)}
                                 style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", padding: 16, color: "white", fontSize: 13, marginBottom: 20, minHeight: 80, boxSizing: "border-box", outline: "none" }}
                               />
                               <div style={{ display: "flex", gap: 12 }}>
                                 <button onClick={() => handleStatusUpdate(app._id, "Approved")} style={{ flex: 1, padding: 14, background: BLUE, color: "white", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>Authorize</button>
                                 <button onClick={() => handleStatusUpdate(app._id, "Rejected")} style={{ flex: 1, padding: 14, background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 800, fontSize: 12, cursor: "pointer", textTransform: "uppercase" }}>Decline</button>
                               </div>
                            </div>
                          )}

                          <div style={{ background: "white", border: `1px solid ${BORDER}`, padding: 32 }}>
                             <h4 style={{ margin: "0 0 24px", fontSize: 11, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Document Repository</h4>
                             <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <button onClick={() => setLetterView(app)} style={{ padding: "12px 20px", background: "white", border: `1px solid ${NAVY}`, color: NAVY, fontSize: 10, fontWeight: 800, cursor: "pointer", textTransform: "uppercase" }}>
                                  View Decision Letter
                                </button>
                                {!isAdmin && app.status === "Approved" && (
                                  app.isRegulatorySigned ? (
                                    <div style={{ padding: "12px 20px", background: "#ECFDF5", border: "1px solid #10B981", color: "#10B981", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Signed ✅</div>
                                  ) : (
                                    <button onClick={() => setSignView(app)} style={{ padding: "12px 20px", background: BLUE, color: "white", border: "none", fontSize: 10, fontWeight: 800, cursor: "pointer", textTransform: "uppercase" }}>Sign Regulatory Form</button>
                                  )
                                )}
                             </div>
                             
                             {role === "compliance_auditor" && (
                                <button 
                                  onClick={() => setWorkspaceAppId(app._id)}
                                  style={{ width: "100%", marginTop: 20, padding: 16, background: NAVY, color: "white", border: "none", fontWeight: 800, fontSize: 11, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" }}
                                >
                                  Enter Collaborative Workspace
                                </button>
                             )}
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {letterView && <LetterModal letterView={letterView} onClose={() => setLetterView(null)} />}
        {signView && <SignatureModal signView={signView} onClose={() => setSignView(null)} onSign={async (sig, bank) => {
           try {
             await applicationService.signRegulatoryForm(signView._id, sig, bank);
             setSignView(null); fetchApps();
           } catch { alert("Signing failed"); }
        }} />}
      </AnimatePresence>
    </div>
  );
};

// 🏛️ REFACTORED MODAL COMPONENTS
const LetterModal = ({ letterView, onClose }) => (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(5, 28, 44, 0.98)", zIndex: 9999, display: "flex", justifyContent: "center", padding: "60px 20px", overflowY: "auto" }}>
    <motion.div 
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 50, opacity: 0 }} 
      style={{ 
        background: "#FFFFFF", 
        padding: "80px", 
        width: "100%", 
        maxWidth: "850px", 
        color: "#051C2C", 
        position: "relative", 
        boxShadow: "0 50px 100px -20px rgba(0,0,0,0.6)", 
        display: "block",
        height: "fit-content",
        zIndex: 10000
      }}
    >
       {/* 🛡️ INSTITUTIONAL BORDER DECOR */}
       <div style={{ position: "absolute", top: 15, left: 15, right: 15, bottom: 15, border: "2px solid #F3F4F6", pointerEvents: "none" }} />
       
       <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60, borderBottom: "4px solid #051C2C", paddingBottom: 30 }}>
             <div>
                <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#051C2C" }}>CREDIFY INSTITUTIONAL</h1>
                <p style={{ margin: "4px 0 0", fontSize: 10, fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: "0.2em" }}>Capital Adjudication Division</p>
             </div>
             <button onClick={onClose} style={{ cursor: "pointer", background: "#051C2C", color: "white", padding: "12px 24px", fontSize: 11, fontWeight: 800, border: "none", textTransform: "uppercase" }}>Close Document</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px 40px", marginBottom: 60, fontSize: 14, borderBottom: "1px solid #E5E7EB", paddingBottom: 40 }}>
             <span style={{ fontWeight: 800, color: "#6B7280" }}>RECIPIENT:</span><span style={{ fontWeight: 700, color: "#051C2C" }}>{letterView.userId?.name}</span>
             <span style={{ fontWeight: 800, color: "#6B7280" }}>ISSUER:</span><span style={{ fontWeight: 700, color: "#051C2C" }}>{letterView.bankId?.name} Institutional Node</span>
             <span style={{ fontWeight: 800, color: "#6B7280" }}>DATE:</span><span style={{ fontWeight: 700, color: "#051C2C" }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</span>
             <span style={{ fontWeight: 800, color: "#6B7280" }}>SUBJECT:</span><span style={{ fontWeight: 900, color: BLUE }}>CERTIFICATE OF CAPITAL ALLOCATION - {letterView.status?.toUpperCase()}</span>
             <span style={{ fontWeight: 800, color: "#6B7280" }}>REFERENCE:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: "#051C2C" }}>CR-{letterView._id.slice(-12).toUpperCase()}</span>
          </div>

          <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, lineHeight: 1.8, color: "#1F2937", marginBottom: 60 }}>
             <p style={{ marginBottom: 30 }}>This official communication serves as the final determination regarding the capital allocation request. Following a high-fidelity examination of the risk profile, the Underwriting Intelligence Unit has reached the following consensus:</p>
             
             {/* Result Box */}
             <div style={{ margin: "40px 0", background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "40px", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: letterView.status === 'Approved' ? "#10B981" : "#EF4444" }} />
                <h2 style={{ fontSize: 48, fontWeight: 900, color: letterView.status === 'Approved' ? "#10B981" : "#EF4444", margin: 0, letterSpacing: "-0.01em" }}>{letterView.status?.toUpperCase()}</h2>
             </div>

             {/* Metrics Grid - High Contrast Fix */}
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30, marginBottom: 40 }}>
                <div style={{ padding: "20px", background: "white", border: "1px solid #051C2C" }}>
                   <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 900, color: "#051C2C", textTransform: "uppercase" }}>Principal Allocation</p>
                   <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#051C2C" }}>₹{letterView.loanAmount?.toLocaleString()}</p>
                </div>
                <div style={{ padding: "20px", background: "white", border: "1px solid #051C2C" }}>
                   <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 900, color: "#051C2C", textTransform: "uppercase" }}>Interest Yield</p>
                   <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#051C2C" }}>{letterView.bankId?.baseInterestRate || "8.55"}% P.A.</p>
                </div>
                <div style={{ padding: "20px", background: "white", border: "1px solid #051C2C" }}>
                   <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 900, color: "#051C2C", textTransform: "uppercase" }}>AI Fidelity Score</p>
                   <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#051C2C" }}>{letterView.aiScore || 92}%</p>
                </div>
             </div>

             <p style={{ color: "#1F2937" }}>{letterView.status === "Approved" ? "The capital has been formally reserved within the unified ledger. You are authorized to proceed to the Regulatory Signature stage." : `Advisory: ${letterView.remarks || "Profile optimization required."}`}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 80, padding: "40px", background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
             <div style={{ flex: 1 }}>
                <div style={{ width: 220, height: 2, background: "#051C2C", marginBottom: 12 }} />
                <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#051C2C" }}>DIRECTOR OF UNDERWRITING</p>
                <p style={{ margin: 0, fontSize: 11, color: "#4B5563", fontWeight: 700 }}>Institutional Adjudication Division</p>
             </div>
             <div style={{ textAlign: "right", display: "flex", gap: 30, alignItems: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", border: `4px double ${BLUE}40`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: BLUE, padding: 10, background: "white" }}>
                   <span style={{ fontSize: 10, fontWeight: 900 }}>CERTIFIED</span>
                   <span style={{ fontSize: 10, fontWeight: 900 }}>AI NODE</span>
                </div>
             </div>
          </div>
          <div style={{ marginTop: 40, fontSize: 11, color: "#374151", borderTop: "2px solid #051C2C", paddingTop: 24, textAlign: "justify", fontWeight: 600, lineHeight: 1.6 }}>
             DISCLAIMER: This cryptographically signed document serves as an official extract from the Credify Unified Ledger. All capital reservations are subject to final KYC audit and regulatory baseline verification.
          </div>
       </div>
    </motion.div>
  </div>
);

const SignatureModal = ({ onSign, onClose }) => {
  const [sig, setSig] = useState("");
  const [bank, setBank] = useState({ accountName: "", accountNumber: "", ifscCode: "" });
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(5, 28, 44, 0.95)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: "white", padding: 48, width: "100%", maxWidth: 600, border: `1px solid ${NAVY}` }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase" }}>Regulatory Signing</h2>
        <p style={{ color: TEXT_MUTED, fontSize: 14, marginBottom: 32 }}>Please provide disbursement details and electronic signature.</p>
        
        <div style={{ display: "grid", gap: 20, marginBottom: 32 }}>
          <input type="text" placeholder="Disbursement Account Name" value={bank.accountName} onChange={e => setBank({...bank, accountName: e.target.value})} style={{ width: "100%", padding: 16, border: `1px solid ${BORDER}`, outline: "none", fontSize: 14 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <input type="text" placeholder="Account Number" value={bank.accountNumber} onChange={e => setBank({...bank, accountNumber: e.target.value})} style={{ width: "100%", padding: 16, border: `1px solid ${BORDER}`, outline: "none", fontSize: 14 }} />
            <input type="text" placeholder="IFSC Code" value={bank.ifscCode} onChange={e => setBank({...bank, ifscCode: e.target.value})} style={{ width: "100%", padding: 16, border: `1px solid ${BORDER}`, outline: "none", fontSize: 14 }} />
          </div>
          <input type="text" placeholder="Sign Full Name" value={sig} onChange={e => setSig(e.target.value)} style={{ width: "100%", padding: 16, border: `2px solid ${NAVY}`, outline: "none", fontSize: 14, fontWeight: 700 }} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 16, background: "white", border: `1px solid ${BORDER}`, fontWeight: 800, cursor: "pointer" }}>CANCEL</button>
          <button onClick={() => onSign(sig, bank)} style={{ flex: 1, padding: 16, background: NAVY, color: "white", border: "none", fontWeight: 800, cursor: "pointer" }}>AUTHORIZE DISBURSEMENT</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationTracker;