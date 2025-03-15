"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext.jsx";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { user, accessToken, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([
    { _id: "1", title: "First Note", content: "This is the first demo note." },
    {
      _id: "2",
      title: "Second Note",
      content: "This is the second demo note.",
    },
    { _id: "3", title: "Third Note", content: "This is the third demo note." },
  ]);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;
    axios
      .get("/api/notes", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setNotes(res.data));
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome, {user?.name}
          </h2>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            List of Notes
          </h3>
          <ul className="space-y-4">
            {notes.map((note) => (
              <li
                key={note._id}
                className="cursor-pointer p-4 bg-white rounded-lg shadow-lg transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-xl"
              >
                <Link href={`/note/${note._id}`}>
                  <h1 className="text-xl font-medium text-gray-800">
                    {note.title}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">{note.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
