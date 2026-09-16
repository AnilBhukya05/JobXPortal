import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  registerUser,
  loginUser,
  fetchMe,
} from "../services/authService";

import {
  getToken,
  setToken,
} from "../services/api";

const AuthContext = createContext(null);

const USER_KEY = "jobxportal_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  function saveUser(userData) {
    setUser(userData);

    if (userData) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(userData)
      );
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

  useEffect(() => {
    async function restoreSession() {
      const token = getToken();

      if (!token) {
        saveUser(null);
        setLoading(false);
        return;
      }

      try {
        const result = await fetchMe();

        saveUser(result.user);
      } catch (error) {
        console.error("Session restore failed:", error);

        setToken(null);
        saveUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function register({
    name,
    email,
    password,
    role,
  }) {
    try {
      const result = await registerUser(
        name,
        email,
        password,
        role || "seeker"
      );

      setToken(
        result.token,
        true
      );

      saveUser(result.user);

      return {
        success: true,
        user: result.user,
      };
    } catch (err) {
      return {
        error:
          err.message ||
          "Registration failed",
      };
    }
  }

  async function login({
    email,
    password,
    remember,
  }) {
    try {
      const result = await loginUser(
        email,
        password
      );

      setToken(
        result.token,
        Boolean(remember)
      );

      saveUser(result.user);

      return {
        success: true,
        user: result.user,
      };
    } catch (err) {
      return {
        error:
          err.message ||
          "Login failed",
      };
    }
  }

  function logout() {
    setToken(null);
    saveUser(null);
  }

  function getUserData(key) {
    if (!user) return null;

    try {
      const data = localStorage.getItem(
        `jxp_${user.id}_${key}`
      );

      if (!data) return null;

      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  function setUserData(key, value) {
    if (!user) return;

    localStorage.setItem(
      `jxp_${user.id}_${key}`,
      JSON.stringify(value)
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        getUserData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}