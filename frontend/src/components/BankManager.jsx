import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Landmark, Percent, Activity } from "lucide-react";
import API from "../services/api";

const BG_DARK = "#F8FAFC"; 
const CARD_BG = "#FFFFFF"; 
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";

const BankManager = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", baseInterestRate: "", processingFeePercent: "", maxLoanLimit: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchBanks = () => {
    API.get("/banks")
      .then(res => setBanks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await API.put(`/banks/${editingId}`, form);
      else await API.post("/banks", form);
      setForm({ name: "", baseInterestRate: "", processingFeePercent: "", maxLoanLimit: "" });
      setEditingId(null);
      fetchBanks();
    } catch (err) { alert("Action failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion of this institution? Algorithms will fail if active loans depend on it.")) return;
    try { await API.delete(`/banks/${id}`); fetchBanks(); } 
    catch (err) { alert("Deletion prevented."); }
  };

  if (loading) return (
    <div style={{ padding: 60, textAlign: "center", color: TEXT_MUTED }}>
      <Activity size={32} style={{ marginBottom: 16 }} />
      <p style={{ fontSize: 15, fontWeight: 500 }}>Configuring Institutional Ledger...</p>
    </div>
  );

  return (
    <div style={{ padding: "40px", background: BG_DARK, minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
              <Landmark size={24} color="#8b5cf6" /> Institutional Configuration
            </h2>
            <p style={{ color: TEXT_MUTED, margin: 0, fontSize: 14 }}>Manage partner banks, base risk rates, and exposure limits securely.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32, alignItems: "start" }}>
          
          {/* FORM EDITOR */}
          <div style={{ background: CARD_BG, padding: 24, borderRadius: 16, border: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "white" }}>
              {editingId ? "Modify Institution" : "Onboard Institution"}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Institution Name", key: "name", type: "text" },
                { label: "Base Rate (%)", key: "baseInterestRate", type: "number", step: "0.1" },
                { label: "Processing Fee (%)", key: "processingFeePercent", type: "number", step: "0.1" },
                { label: "Max Exposure (₹)", key: "maxLoanLimit", type: "number" }
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: TEXT_MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
                  <input required type={f.type} step={f.step} value={form[f.key]} onChange={(e) => setForm({...form, [f.key]: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 14, color: "white", outline: "none", boxSizing: "border-box", background: "rgba(30, 58, 138, 0.04)" }} />
                </div>
              ))}
              
              <button type="submit" style={{ padding: 14, borderRadius: 8, background: editingId ? "#f59e0b" : "#8b5cf6", color: "white", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 12 }}>
                <Plus size={16} /> {editingId ? "Update System" : "Add Institution"}
              </button>
              
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", baseInterestRate: "", processingFeePercent: "", maxLoanLimit: "" }); }} style={{ padding: 10, borderRadius: 8, background: "transparent", color: TEXT_MUTED, fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Cancel Modification
                </button>
              )}
            </form>
          </div>

          {/* BANKS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {banks.map((b) => (
              <div key={b._id} style={{ background: CARD_BG, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px", color: "white" }}>{b.name}</h3>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(139,92,246,0.1)", color: "#c4b5fd", fontWeight: 700 }}>Active Partner</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditingId(b._id); setForm(b); }} style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", padding: 8, borderRadius: 6, color: "white" }}><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(b._id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", cursor: "pointer", padding: 8, borderRadius: 6, color: "#ef4444" }}><Trash2 size={14} /></button>
                  </div>
                </div>

                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { l: "Base Interest", v: `${b.baseInterestRate}%`, i: <Percent size={14} /> },
                    { l: "Processing Fee", v: `${b.processingFeePercent}%`, i: <Percent size={14} /> },
                    { l: "Max Exposure", v: `₹${(b.maxLoanLimit/100000).toFixed(1)}L`, i: <Landmark size={14} /> }
                  ].map(d => (
                    <div key={d.l} style={{ background: "rgba(30, 58, 138, 0.04)", borderRadius: 8, padding: "10px 12px", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: TEXT_MUTED, display: "flex", alignItems: "center", gap: 6 }}>{d.i} {d.l}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{d.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {banks.length === 0 && (
              <div style={{ background: CARD_BG, padding: 40, borderRadius: 16, border: `1px dashed ${BORDER}`, textAlign: "center", gridColumn: "1/-1" }}>
                <p style={{ color: TEXT_MUTED, fontSize: 14 }}>No institutions configured in the central database.</p>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default BankManager;