import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, CheckCircle2, AlertCircle, X, ShieldCheck, User } from "lucide-react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [modal, setModal] = useState(null); // { type, title, message, onConfirm, onCancel }
  const [googleState, setGoogleState] = useState({ isOpen: false, callback: null });

  const notify = (type, title, message) => {
    setModal({ type, title, message });
  };

  const confirm = (title, message, onConfirm) => {
    setModal({ type: "confirm", title, message, onConfirm });
  };

  const close = () => setModal(null);

  const simulateGoogle = (onSelect) => {
    setGoogleState({ isOpen: true, callback: onSelect });
  };

  const handleAccountSelect = (email) => {
    if (googleState.callback) googleState.callback(email);
    setGoogleState({ isOpen: false, callback: null });
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm, simulateGoogle }}>
      {children}
      
      {/* 🏛️ INSTITUTIONAL NOTIFICATION MODAL */}
      <AnimatePresence>
        {modal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} style={{ position: "absolute", inset: 0, background: "rgba(5, 28, 44, 0.85)", backdropFilter: "blur(4px)" }} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: "white", width: "100%", maxWidth: 440, borderRadius: 0, border: "2px solid #051C2C",
                position: "relative", zIndex: 1, overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ padding: "32px 32px 20px", display: "flex", alignItems: "start", gap: 20 }}>
                <div style={{ 
                  width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", 
                  background: modal.type === "success" ? "#ECFDF5" : modal.type === "error" ? "#FEF2F2" : "#EFF6FF",
                  color: modal.type === "success" ? "#10B981" : modal.type === "error" ? "#EF4444" : "#0055FE"
                }}>
                  {modal.type === "success" ? <CheckCircle2 size={24} /> : modal.type === "error" ? <AlertCircle size={24} /> : <Info size={24} />}
                </div>
                <div>
                   <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "#051C2C" }}>{modal.title}</h3>
                   <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#6B7280" }}>{modal.message}</p>
                </div>
              </div>

              <div style={{ padding: "20px 32px 32px", display: "flex", gap: 12, justifyContent: "end" }}>
                {modal.type === "confirm" ? (
                  <>
                    <button onClick={close} style={{ padding: "12px 24px", background: "white", border: "1px solid #D1D5DB", color: "#6B7280", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>Cancel</button>
                    <button onClick={() => { modal.onConfirm(); close(); }} style={{ padding: "12px 24px", background: "#051C2C", color: "white", border: "none", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>Confirm</button>
                  </>
                ) : (
                  <button onClick={close} style={{ width: "100%", padding: "14px", background: "#051C2C", color: "white", border: "none", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: "pointer", letterSpacing: "0.1em" }}>Acknowledge</button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* 🌐 INSTITUTIONAL GOOGLE PICKER SIMULATOR */}
        {googleState.isOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGoogleState({isOpen: false})} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
            
            <motion.div 
              initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }}
              style={{
                background: "white", width: "100%", maxWidth: 360, borderRadius: 8, padding: "32px 40px",
                position: "relative", zIndex: 1, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", textAlign: "center"
              }}
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" style={{ width: 32, marginBottom: 16 }} />
              <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#202124" }}>Choose an account</h3>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: "#5f6368" }}>to continue to <span style={{color: "#051C2C", fontWeight: 700}}>Credify Institutional</span></p>

              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                {[
                  { name: "S. Consultant (McKinsey)", email: "s.consultant@mckinsey.com", initial: "S" },
                  { name: "Bain Finance Lead", email: "finance.lead@bain.com", initial: "B" }
                ].map((acc, i) => (
                  <div key={i} onClick={() => handleAccountSelect(acc.email)} style={{ padding: "12px 0", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#051C2C", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{acc.initial}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#3c4043" }}>{acc.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#5f6368" }}>{acc.email}</p>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "12px 0", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <User size={18} color="#5f6368" style={{marginLeft: 7}} />
                  <p style={{ margin: 0, fontSize: 14, color: "#3c4043", fontWeight: 500 }}>Use another account</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
