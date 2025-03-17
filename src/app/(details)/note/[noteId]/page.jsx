"use client";
import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";
import { AuthContext } from "../../../../context/authContext";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function NoteEditor() {
  const { noteId } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { updateNote, token } = useContext(AuthContext);
  const [note, setNote] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/note/single/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNote(res.data);
      } catch (error) {
        console.error("Failed to fetch note:", error);
      }
    };

    fetchNote();
  }, [noteId, token]);

  const handleEdit = (e) => {
    setContent(e.target.value);
    setIsSaving(true);
    socket.emit("editNote", { noteId, content: e.target.value, title });
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleTitleEdit = (e) => {
    setTitle(e.target.value);
    setIsSaving(true);
    socket.emit("editNote", { noteId, content, title: e.target.value });
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleUpdateNote = () => {
    updateNote(noteId, title, content);
    setIsSaving(true);
    router.push("/dashboard");

    socket.emit("saveNote", { noteId, title, content });
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500 p-6">
      <div className="w-full max-w-3xl bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/40">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          📝 Update Note
        </h2>
        <input
          type="text"
          className="w-full p-4 mb-4 border border-gray-300 bg-white/50 text-gray-900 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
          defaultValue={note.title}
          onChange={handleTitleEdit}
          placeholder="Enter note title..."
        />
        <textarea
          className="w-full h-60 p-4 border border-gray-300 bg-white/50 text-gray-900 rounded-lg shadow-lg resize-none focus:outline-none focus:ring-4 focus:ring-blue-400"
          defaultValue={note.content}
          onChange={handleEdit}
          placeholder="Start writing your note..."
        />
        <button
          onClick={handleUpdateNote}
          className="mt-6 w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-600"
        >
          🔄 {isSaving ? "Saving..." : "Update Note"}
        </button>
      </div>
    </div>
  );
}
