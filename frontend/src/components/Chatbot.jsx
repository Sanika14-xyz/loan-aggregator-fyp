import { useState, useRef, useEffect } from "react";
import API from "../services/api";

const GOLD = "#0F766E";
const NAVY = "#1E3A8A";

// Enterprise Dark Palette
const BG_DARK = "#F8FAFC"; 
const CARD_BG = "#FFFFFF"; 
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Credify Assistant ⚡. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await API.post("/chat", { message: userMessage.text });
      setMessages((prev) => [...prev, { text: response.data.reply, isBot: true }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: "30px", right: "30px", width: "60px", height: "60px",
          borderRadius: "50%", background: GOLD, color: NAVY, fontSize: "28px",
          border: "none", cursor: "pointer", boxShadow: `0 8px 30px rgba(0,0,0,0.5)`,
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          transition: "transform 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "100px", right: "30px", width: "350px", height: "500px",
          background: CARD_BG, borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1000,
          border: `1px solid ${BORDER}`
        }}>
          {/* Header */}
          <div style={{ background: "rgba(30, 58, 138, 0.06)", borderBottom: `1px solid ${BORDER}`, padding: "16px 20px", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: `1px solid ${GOLD}40` }}>🤖</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, color: GOLD, fontWeight: 700 }}>Credify Assistant</h3>
              <p style={{ margin: 0, fontSize: 12, color: TEXT_MUTED }}>Online & ready to help</p>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: BG_DARK, display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.isBot ? "flex-start" : "flex-end",
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: msg.isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                background: msg.isBot ? CARD_BG : GOLD,
                color: msg.isBot ? "white" : NAVY,
                fontSize: "14px",
                lineHeight: "1.5",
                boxShadow: msg.isBot ? `0 2px 8px rgba(30, 58, 138, 0.04)` : `0 2px 10px ${GOLD}40`,
                border: msg.isBot ? `1px solid ${BORDER}` : "none",
                fontWeight: msg.isBot ? 500 : 700
              }}>
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: CARD_BG, border: `1px solid ${BORDER}`, fontSize: "14px", color: TEXT_MUTED }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: "16px", background: CARD_BG, borderTop: `1px solid ${BORDER}`, display: "flex", gap: "8px" }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about loans, KYC, or AI..." 
              style={{ flex: 1, padding: "12px 16px", borderRadius: "24px", border: `1px solid ${BORDER}`, background: BG_DARK, fontSize: "14px", outline: "none", color: "white" }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              style={{ width: "44px", height: "44px", borderRadius: "50%", background: input.trim() ? GOLD : BORDER, color: NAVY, border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;