"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res?.data?.token;
      localStorage.setItem("token", token);
      setAccessToken(token);
      setUser(res.data.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };



const updateNote = async (noteId, title, content) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/note/update/${noteId}`, {
      title,
      content,
    });

    // Success toast
    toast.success("Note updated successfully!");
  } catch (error) {
    console.error("Note update failed", error);

    // Error toast
    toast.error("Failed to update note. Please try again.");
  }
};


  const createNote = async (title, content, user) => {
    try {
      const res = await axios.post("http://localhost:5000/api/note/create", {
        title,
        content,
        user,
      });

      // Success toast
      toast.success("Note created successfully!");
    } catch (error) {
      console.error("Note creation failed", error);

      // Error toast
      toast.error("Failed to create note. Please try again.");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      setToken(token);
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
        setAccessToken(token);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        setAccessToken(null);
      }
    };

    getUser();
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        createNote,
        token,
        updateNote,
      }}
    >
      <Toaster />
      {children}
    </AuthContext.Provider>
  );
};
