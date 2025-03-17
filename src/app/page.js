"use client";
import { useEffect, useState } from "react";
import Dashboard from "../modules/dashboard/dashbroad.jsx";
import Signup from "../modules/signup/signup.jsx";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(token);
  }, []);

 

  return user ? <Dashboard /> : <Signup />;
};

export default Home;
