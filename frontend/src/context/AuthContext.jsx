import { createContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        try { 
          setUser(JSON.parse(storedUser)); 
        } catch (error) { 
          console.error("Auth initialization failed:", error);
          localStorage.clear(); 
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      
      // Save to localStorage FIRST
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      // Update state SECOND
      setUser(data);
      
      return { success: true };
    } catch (e) { 
      return { 
        success: false, 
        message: e.response?.data?.message || "Invalid credentials or server error" 
      }; 
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await API.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (e) { 
      return { 
        success: false, 
        message: e.response?.data?.message || "Registration failed" 
      }; 
    }
  };

  const logout = () => { 
    localStorage.removeItem("token"); 
    localStorage.removeItem("user"); 
    setUser(null); 
  };

  const updateUser = (d) => { 
    const m = { ...user, ...d }; 
    setUser(m); 
    localStorage.setItem("user", JSON.stringify(m)); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {/* We remove the {!loading && children} here and move 
          the loading spinner to App.jsx for better stability.
      */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;