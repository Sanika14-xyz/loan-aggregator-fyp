import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp, Download, PieChart as PieIcon, Activity } from "lucide-react";
import API from "../services/api";

const BG_DARK = "#F8FAFC"; 
const CARD_BG = "#FFFFFF"; 
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Hydrate with synthetic enterprise data since the backend route is not present 
    setTimeout(() => {
      setStats({
        approvedLoans: 142,
        rejectedLoans: 28,
        totalApplications: 215,
        totalUsers: 894,
        fraudAlerts: 3,
        monthlyTrend: [
          { month: "Jan", applications: 45 },
          { month: "Feb", applications: 52 },
          { month: "Mar", applications: 85 },
          { month: "Apr", applications: 110 }
        ]
      });
    }, 600);
  }, []);

  if (!stats) return (
    <div style={{ padding: 60, textAlign: "center", color: TEXT_MUTED }}>
      <Activity size={32} style={{ marginBottom: 16 }} />
      <p style={{ fontSize: 15, fontWeight: 500 }}>Decrypting Analytics Database...</p>
    </div>
  );

  const statusData = [
    { name: "Approved", value: stats.approvedLoans, color: "#10b981" },
    { name: "Rejected", value: stats.rejectedLoans, color: "#ef4444" },
    { name: "Pending", value: stats.totalApplications - stats.approvedLoans - stats.rejectedLoans, color: "#f59e0b" }
  ];

  return (
    <div style={{ padding: "40px", background: BG_DARK, minHeight: "100vh", color: "white" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
            <TrendingUp size={24} color="#2563EB" /> Regional Intelligence Matrix
          </h2>
          <p style={{ color: TEXT_MUTED, margin: 0, fontSize: 14 }}>Global perspective on loan volume, risk, and fraud detection.</p>
        </div>
        <button style={{ padding: "10px 20px", display: "flex", gap: 8, alignItems: "center", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Download size={16} /> Export to CSV
        </button>
      </div>

      {/* Top Value Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 32 }}>
        {[
          { label: "Active Users", val: stats.totalUsers, icon: <Users size={20} color="#2563EB" />, bg: "rgba(59,130,246,0.1)", border: "#2563EB" },
          { label: "Applications", val: stats.totalApplications, icon: <FileText size={20} color="#8b5cf6" />, bg: "rgba(139,92,246,0.1)", border: "#8b5cf6" },
          { label: "Funded Loans", val: stats.approvedLoans, icon: <CheckCircle size={20} color="#10b981" />, bg: "rgba(16,185,129,0.1)", border: "#10b981" },
          { label: "Threat Anomalies", val: stats.fraudAlerts, icon: <AlertTriangle size={20} color="#ef4444" />, bg: "rgba(239,68,68,0.1)", border: "#ef4444" }
        ].map((c, i) => (
          <div key={i} style={{ background: CARD_BG, padding: 24, borderRadius: 16, border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
            <div style={{ width: 4, height: "100%", background: c.border, position: "absolute", left: 0, top: 0 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{c.label}</p>
              <div style={{ padding: 8, background: c.bg, borderRadius: 8 }}>{c.icon}</div>
            </div>
            <p style={{ fontSize: 36, fontWeight: 800, margin: 0, color: "white" }}>{c.val}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 32 }}>
        
        {/* Loan Volumes Chart */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 24px", color: "white" }}>Quarterly Disbursement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TEXT_MUTED }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TEXT_MUTED }} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD_BG, color: "white" }} />
              <Bar dataKey="applications" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pipeline Chart */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 24px", color: "white" }}>Application Status Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD_BG, color: "white" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
            {statusData.map((s, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_MUTED }}>{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity Table */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "white" }}>Recent Geographic Access</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(30, 58, 138, 0.04)" }}>
                <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>Time</th>
                <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>User ID</th>
                <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>Action Type</th>
                <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy data mapping to match old layout */}
              {[1, 2, 3, 4, 5].map((item, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: "16px 24px", fontSize: 13, color: "white" }}>Today, {10 + idx}:00 AM</td>
                  <td style={{ padding: "16px 24px", fontSize: 13, color: "white", fontFamily: "monospace" }}>USR_{Math.floor(Math.random() * 9999)}</td>
                  <td style={{ padding: "16px 24px", fontSize: 13, color: TEXT_MUTED }}>{idx % 2 === 0 ? "Bank Compare Matrix" : "AI Predictor Generation"}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4, background: "rgba(16,185,129,0.1)", color: "#10b981" }}>Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminAnalytics;