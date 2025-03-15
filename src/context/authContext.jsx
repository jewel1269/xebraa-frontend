"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setUser(jwtDecode(res.data.accessToken));
      })
      .catch(() => {});
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setAccessToken(res.data.accessToken);
      setUser(jwtDecode(res.data.accessToken));
      console.log(user, accessToken);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
