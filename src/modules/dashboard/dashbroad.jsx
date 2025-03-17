"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext.jsx";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Log Out Successful");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  useEffect(() => {
    if (!token || !user?._id) return; 
  
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`https://backend-three-omega-65.vercel.app/api/note/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };
  
    fetchNotes();
  }, [token, user?._id]); 
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-white/40">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Welcome, <span className="text-black">{user?.name || "Guest"}</span>
          </h2>
          <div className="flex gap-3">
            <Link href={"/note"}>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                Note
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white/20 p-6 rounded-xl shadow-md border border-white/30">
          <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
            Your <span className="text-black">Notes</span>
          </h3>
          {notes.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="cursor-pointer p-5 bg-white/40 backdrop-blur-lg rounded-xl shadow-lg border border-white/30 transition-transform transform hover:scale-105 hover:shadow-2xl"
                >
                  <Link href={`/note/${note._id}`}>
                    <h1 className="text-lg font-semibold text-gray-900">
                      {note.title}
                    </h1>
                    <p className="text-sm text-gray-700 mt-1">{note.content}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-100 text-center">No notes available.</p>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
