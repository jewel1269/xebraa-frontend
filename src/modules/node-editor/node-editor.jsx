"use client";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useParams, useRouter } from "next/navigation";
import socket from './../socket/socket';


export default function NoteEditor() {
  const {noteId} = useParams()
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const { createNote, user } = useContext(AuthContext);
  const router = useRouter()

  const handleEdit = (e) => {
    setContent(e.target.value);
    socket.emit("editNote", { noteId, content: e.target.value, title });
  };

  const handleTitleEdit = (e) => {
    setTitle(e.target.value);
    socket.emit("editNote", { noteId, content, title: e.target.value });
  };

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content!");
      return;
    }

    createNote(title, content, user);
   router.push("/dashboard")

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500 p-6">
      <div className="w-full max-w-3xl bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/40">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          ✍️ Note Editor
        </h2>
        <input
          type="text"
          className="w-full p-4 mb-4 border border-gray-300 bg-white/50 text-gray-900 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
          value={title}
          onChange={handleTitleEdit}
          placeholder="Enter note title..."
        />
        <textarea
          className="w-full h-60 p-4 border border-gray-300 bg-white/50 text-gray-900 rounded-lg shadow-lg resize-none focus:outline-none focus:ring-4 focus:ring-blue-400"
          value={content}
          onChange={handleEdit}
          placeholder="Start writing your note..."
        />
        <button
          onClick={handleCreateNote}
          className="mt-6 w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-600"
        >
          ➕ Create Note
        </button>
      </div>
    </div>
  );
}
