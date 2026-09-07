import { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser, fetchMe } from "../services/authService";
import { getToken, setToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await fetchMe();
        setUser(user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function register({ name, email, password, role }) {
    try {
      const { token, user } = await registerUser(name, email, password, role || "seeker");
      setToken(token, true);
      setUser(user);
      return { success: true };
    } catch (err) {
      return { error: err.message || "Registration failed" };
    }
  }

  async function login({ email, password, remember }) {
    try {
      const { token, user } = await loginUser(email, password);
      setToken(token, Boolean(remember));
      setUser(user);
      return { success: true };
    } catch (err) {
      return { error: err.message || "Login failed" };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  function getUserData(key) {
    if (!user) return null;
    try {
      return JSON.parse(localStorage.getItem(`jxp_${user.id}_${key}`));
    } catch {
      return null;
    }
  }

  function setUserData(key, value) {
    if (!user) return;
    localStorage.setItem(`jxp_${user.id}_${key}`, JSON.stringify(value));
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, getUserData, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}