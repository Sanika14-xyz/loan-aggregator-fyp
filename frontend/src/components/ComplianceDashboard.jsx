import { useState, useEffect } from "react";
import { ShieldCheck, Search, Activity, Download, Eye, AlertTriangle } from "lucide-react";
import API from "../services/api";

const BG_DARK = "#F8FAFC"; 
const CARD_BG = "#FFFFFF"; 
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";

const eventColors = {
  LOGIN_SUCCESS: "#10b981", LOGIN_FAILED: "#ef4444", 
  APPLICATION_CREATED: "#2563EB", STATUS_UPDATED: "#f59e0b",
  FRAUD_DETECTED: "#ef4444", PROFILE_UPDATED: "#8b5cf6"
};

const ComplianceDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLogs([
        { _id: "log1", createdAt: new Date().toISOString(), eventType: "LOGIN_SUCCESS", actorEmail: "admin@bank.com", ipAddress: "192.168.1.45", targetId: "AUTH_GATEWAY", details: { method: "2FA Verified" } },
        { _id: "log2", createdAt: new Date(Date.now() - 3600000).toISOString(), eventType: "STATUS_UPDATED", actorEmail: "officer@bank.com", ipAddress: "14.12.18.99", targetId: "APP_982121", details: { previous: "Pending", current: "Approved", notes: "Clear risk buffer." } },
        { _id: "log3", createdAt: new Date(Date.now() - 7200000).toISOString(), eventType: "FRAUD_DETECTED", actorEmail: "SYSTEM_ALARM", ipAddress: "0.0.0.0", targetId: "SYS_NET_33", details: { anomaly: "Simultaneous logins detected across separate geographic regions.", threatLevel: "CRITICAL" } },
        { _id: "log4", createdAt: new Date(Date.now() - 86400000).toISOString(), eventType: "APPLICATION_CREATED", actorEmail: "user@client.com", ipAddress: "103.5.5.12", targetId: "APP_982122", details: { loanAmount: 500000, type: "Home Loan" } }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) return (
    <div style={{ padding: 60, textAlign: "center", color: TEXT_MUTED }}>
      <Activity size={32} style={{ marginBottom: 16 }} />
      <p style={{ fontSize: 15, fontWeight: 500 }}>Decrypting Audit Trails...</p>
    </div>
  );

  const filteredLogs = logs.filter(l => {
    const s = search.toLowerCase();
    const hitsSearch = (l.actorEmail||'').toLowerCase().includes(s) || (l.targetId||'').toLowerCase().includes(s);
    const hitsEvent = eventFilter === "ALL" || l.eventType === eventFilter;
    return hitsSearch && hitsEvent;
  });

  return (
    <div style={{ padding: "40px", background: BG_DARK, minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={28} color="#10b981" /> Regulatory Audit Matrix
            </h2>
            <p style={{ color: TEXT_MUTED, margin: 0, fontSize: 14 }}>Immutable compliance trail. System actions securely tracked.</p>
          </div>
          <button style={{ padding: "10px 20px", display: "flex", gap: 8, alignItems: "center", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Download size={16} /> Export Forensic CSV
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <Search size={16} color={TEXT_MUTED} style={{ position: "absolute", left: 16, top: 14 }} />
            <input 
              type="text" placeholder="Search by identity vector or core reference ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD_BG, fontSize: 14, outline: "none", color: "white" }} 
            />
          </div>
          <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} style={{ padding: "0 20px", borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD_BG, fontSize: 14, outline: "none", color: "white", cursor: "pointer" }}>
            <option value="ALL">All Event Vectors</option>
            <option value="LOGIN_SUCCESS">Login Assertions</option>
            <option value="APPLICATION_CREATED">Originations</option>
            <option value="STATUS_UPDATED">Adjudications</option>
            <option value="FRAUD_DETECTED">Anomalies</option>
          </select>
        </div>

        {/* Audit Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
          
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ overflowX: "auto", maxHeight: "60vh" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(30, 58, 138, 0.06)" }}>
                    <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>Timestamp</th>
                    <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>Event Action</th>
                    <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>Primary Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr 
                      key={log._id} 
                      onClick={() => setSelectedLog(log)}
                      style={{ borderTop: `1px solid ${BORDER}`, cursor: "pointer", background: selectedLog?._id === log._id ? "rgba(255,255,255,0.05)" : "transparent", transition: "background 0.2s" }}
                      onMouseEnter={(e) => { if (selectedLog?._id !== log._id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                      onMouseLeave={(e) => { if (selectedLog?._id !== log._id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "16px 24px", fontSize: 13, color: TEXT_MUTED, whiteSpace: "nowrap" }}>
                        {new Date(log.createdAt).toLocaleString("en-IN", {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 4, background: `${eventColors[log.eventType] || "#64748b"}20`, color: eventColors[log.eventType] || TEXT_MUTED, letterSpacing: "0.05em" }}>
                          {log.eventType}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: "white" }}>
                        {log.actorEmail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLogs.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: TEXT_MUTED }}>
                 <p style={{ margin: 0 }}>No audit trails found matching parameters.</p>
              </div>
            )}
          </div>

          {/* INSPECTION VIEW */}
          {selectedLog ? (
            <div style={{ background: CARD_BG, borderRadius: 16, border: `1px solid ${BORDER}`, position: "sticky", top: 40 }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
                <Eye size={18} color="#10b981" />
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "white" }}>Forensic Thread Inspection</h3>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", margin: "0 0 4px" }}>Action Classification</p>
                  <span style={{ fontSize: 14, fontWeight: 800, color: eventColors[selectedLog.eventType] || "white" }}>{selectedLog.eventType}</span>
                </div>
                <div>
                   <p style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", margin: "0 0 4px" }}>Execution Signature (IP Address)</p>
                   <p style={{ fontSize: 15, margin: 0, fontFamily: "monospace", color: "white" }}>{selectedLog.ipAddress}</p>
                </div>
                <div>
                   <p style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", margin: "0 0 4px" }}>Target Resource ID</p>
                   <p style={{ fontSize: 14, margin: 0, color: "white", fontFamily: "monospace" }}>{selectedLog.targetId || "N/A"}</p>
                </div>
                <div>
                   <p style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", margin: "0 0 8px" }}>Context Details</p>
                   <div style={{ background: "rgba(30, 58, 138, 0.06)", padding: 16, borderRadius: 12, border: `1px solid ${BORDER}` }}>
                     <pre style={{ margin: 0, fontSize: 12, color: "#10b981", whiteSpace: "pre-wrap", overflowX: "auto" }}>
                       {JSON.stringify(selectedLog.details, null, 2)}
                     </pre>
                   </div>
                </div>
                {selectedLog.eventType === "FRAUD_DETECTED" && (
                  <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: 16, borderRadius: 8, display: "flex", gap: 12, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                    <AlertTriangle color="#ef4444" size={20} />
                    <div>
                      <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>Critical Anomaly Threshold Breached</p>
                      <p style={{ color: "#fca5a5", fontSize: 12, margin: 0 }}>This transaction vector triggered the deterministic fraud prevention circuit.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: CARD_BG, borderRadius: 16, border: `1px dashed ${BORDER}`, height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: TEXT_MUTED }}>
               <ShieldCheck size={48} color={BORDER} style={{ marginBottom: 16 }} />
               <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>Select a forensic log to inspect details.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ComplianceDashboard;