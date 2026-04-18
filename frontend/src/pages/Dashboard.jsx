import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, LogOut, LayoutDashboard, Search, ClipboardList, 
  Calculator, LineChart, BookOpen, User, ShieldCheck, TrendingUp,
  Activity, FileText
} from "lucide-react";
import AuthContext from "../context/AuthContext";

// Page & Component Imports
import ApplicantDashboard from "./ApplicantDashboard";
import AdminAnalytics from "../components/AdminAnalytics";
import ComplianceDashboard from "../components/ComplianceDashboard";
import AuditorPortal from "../components/AuditorPortal";
import BankManager from "../components/BankManager";
import ApplicationTracker from "../components/ApplicationTracker";
import LoanOfficerPortal from "../components/LoanOfficerPortal";
import EMICalculator from "../components/EMICalculator";
import Profile from "../components/Profile";
import CreditScoreAnalyser from "../components/CreditScoreAnalyser";
import WhatIfSimulator from "../components/WhatIfSimulator";
import LoanGuide from "./LoanGuide";

const GOLD = "#0F766E"; // Accent Color
const NAVY = "#1E3A8A"; // Primary Color

// Anti-Gravity Palette
const BG_MAIN = "#F8FAFC"; 
const CARD_BG = "#FFFFFF"; 
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";

const NAV_ITEMS = {
  applicant: [
    { id: "compare", icon: <Search size={20} />, label: "Compare Loans" }, 
    { id: "applications", icon: <ClipboardList size={20} />, label: "My Applications" }, 
    { id: "simulator", icon: <LineChart size={20} />, label: "What-If Simulator" },
    { id: "guide", icon: <BookOpen size={20} />, label: "Loan Guide" },
    { id: "profile", icon: <User size={20} />, label: "Profile" }
  ],
  admin: [
    { id: "analytics", icon: <LayoutDashboard size={20} />, label: "Analytics" }, 
    { id: "banks", icon: <ShieldCheck size={20} />, label: "Manage Banks" }, 
    { id: "applications", icon: <ClipboardList size={20} />, label: "All Applications" }, 
    { id: "simulator", icon: <LineChart size={20} />, label: "What-If Simulator" },
    { id: "profile", icon: <User size={20} />, label: "Profile" }
  ],
  loan_officer: [
    { id: "officer_portal", icon: <ClipboardList size={20} />, label: "Officer Portal" }, 
    { id: "simulator", icon: <LineChart size={20} />, label: "What-If Simulator" },
    { id: "profile", icon: <User size={20} />, label: "Profile" }
  ],
  risk_manager: [
    { id: "applications", icon: <ClipboardList size={20} />, label: "Applications" }, 
    { id: "simulator", icon: <LineChart size={20} />, label: "What-If Simulator" },
    { id: "profile", icon: <User size={20} />, label: "Profile" }
  ],
  compliance_auditor: [
    { id: "audit", icon: <ShieldCheck size={20} />, label: "Audit Logs" }, 
    { id: "auditor_portal", icon: <ClipboardList size={20} />, label: "Auditor Portal" }, 
    { id: "profile", icon: <User size={20} />, label: "Profile" }
  ],
};

const DEFAULT_TAB = { applicant: "compare", admin: "analytics", loan_officer: "officer_portal", risk_manager: "applications", compliance_auditor: "audit" };
const ROLE_LABEL = { applicant: "Applicant", admin: "Administrator", loan_officer: "Loan Officer", risk_manager: "Risk Manager", compliance_auditor: "Compliance Auditor" };
const ROLE_COLOR = { admin: "#ef4444", compliance_auditor: "#8b5cf6", loan_officer: "#2563EB", risk_manager: "#f59e0b", applicant: "#10b981" };

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = user?.role || "applicant";
  
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB[role] || "compare");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.applicant;
  
  const handleLogout = () => { logout(); navigate("/login"); };

  const checkMarketStatus = () => {
    return true;
  };

  const [marketMetrics, setMarketMetrics] = useState({
    repo: 6.50, home: 8.35, bond: 7.124, nifty: 23512, trend: 1, isOpen: checkMarketStatus()
  });

  useEffect(() => {
    const int = setInterval(() => {
      const currentlyOpen = checkMarketStatus();
      setMarketMetrics(prev => {
        if (!currentlyOpen) return { ...prev, isOpen: false };
        const volatility = (Math.random() - 0.5) * 0.04;
        const trend = Math.random() > 0.45 ? 1 : -1;
        return {
          repo: prev.repo,
          home: prev.home + (volatility * 0.2), 
          bond: prev.bond + (volatility * 1.5), 
          nifty: prev.nifty + (trend * Math.random() * 12), 
          trend: volatility > 0 ? 1 : -1,
          isOpen: true
        };
      });
    }, 2800);
    return () => clearInterval(int);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "compare":      return <ApplicantDashboard onNavigate={setActiveTab} />;
      case "analytics":    return <AdminAnalytics />;
      case "banks":        return <BankManager />;
      case "applications": return <ApplicationTracker role={role} />;
      case "officer_portal": return <LoanOfficerPortal />;
      case "auditor_portal": return <AuditorPortal />;
      case "audit":        return <ComplianceDashboard />;
      case "simulator":    return <WhatIfSimulator />;
      case "credit":       return <CreditScoreAnalyser />;
      case "guide":        return <LoanGuide />;
      case "profile":      return <Profile />;
      default:             return <ApplicantDashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF", color: "#111827", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🏛️ INSTITUTIONAL SIDEBAR (McKinsey Style) */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.2 }}
        style={{ 
          background: "#051C2C", 
          height: "100vh", 
          position: "fixed", 
          left: 0, 
          top: 0, 
          zIndex: 50, 
          display: "flex", 
          flexDirection: "column",
        }}
      >
        {/* Institutional Identity */}
        <div style={{ padding: "40px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {sidebarOpen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "white", fontWeight: 700, fontSize: 22, letterSpacing: "-0.03em" }}>
              CREDIFY <span style={{ fontWeight: 300, fontSize: 13, color: "rgba(255,255,255,0.4)", display: "block", letterSpacing: "0.2em", marginTop: 4 }}>INSTITUTIONAL</span>
            </motion.div>
          ) : (
             <div style={{ color: "white", fontWeight: 800, textAlign: "center" }}>C.</div>
          )}
        </div>

        {/* Navigation - Minimalist */}
        <nav style={{ flex: 1, padding: "30px 0", display: "flex", flexDirection: "column" }}>
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                style={{ 
                  display: "flex", alignItems: "center", gap: 16, width: "100%", padding: "16px 24px", border: "none", cursor: "pointer", 
                  background: active ? "rgba(255, 255, 255, 0.05)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.4)",
                  transition: "all 0.2s",
                  borderLeft: active ? "4px solid #0055FE" : "4px solid transparent",
                  textAlign: "left"
                }}
              >
                <div style={{ color: active ? "#0055FE" : "inherit" }}>{item.icon}</div>
                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: 24, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", 
              background: "transparent", color: "white", fontWeight: 600, fontSize: 12, textTransform: "uppercase"
            }}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Exit Portal</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Container */}
      <main style={{ marginLeft: sidebarOpen ? 260 : 80, flex: 1, display: "flex", flexDirection: "column", transition: "all 0.2s" }}>
        
        {/* 🏢 CORPORATE HEADER */}
        <header style={{ 
          height: 72, background: "white", 
          borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", 
          paddingRight: 40, paddingLeft: 30, gap: 24, position: "sticky", top: 0, zIndex: 40
        }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={{ background: "none", border: "none", cursor: "pointer", color: "#111827", padding: 0 }}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>
              {navItems.find((n) => n.id === activeTab)?.label || "Dashboard"}
            </h1>
          </div>
          
          {/* User Section - Executive Style */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Market Status Bar - Minimal */}
            <div style={{ display: window.innerWidth < 1200 ? 'none' : 'flex', gap: 20, fontSize: 11, fontWeight: 600, color: "#6B7280" }}>
               <span>REPO : {marketMetrics.repo.toFixed(2)}%</span>
               <span>NIFTY FIN : <span style={{ color: marketMetrics.trend > 0 ? "#10B981" : "#CC0000" }}>{marketMetrics.nifty.toLocaleString()}</span></span>
            </div>

            <div style={{ height: 32, width: 1, background: "#E5E7EB" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{user?.name || "Member"}</p>
                <p style={{ fontSize: 10, color: "#0055FE", fontWeight: 800, margin: 0, textTransform: "uppercase" }}>{ROLE_LABEL[role]}</p>
              </div>
              <div style={{ width: 36, height: 36, background: "#051C2C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area - Stark Workspace */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "48px 60px", 
          background: "#FFFFFF"
        }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;