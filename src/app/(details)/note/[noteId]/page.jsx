"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function NoteEditor() {
    const { noteId } = useParams();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        socket.emit("joinNote", noteId);
        socket.on("updateNote", (data) => {
            setContent(data.content);
            setTitle(data.title);
        });

        return () => {
            socket.off("updateNote");
        };
    }, [noteId]);

    const handleEdit = (e) => {
        setContent(e.target.value);
        socket.emit("editNote", { noteId, content: e.target.value, title });
        console.log(title);
    };

    const handleTitleEdit = (e) => {
        setTitle(e.target.value);
        socket.emit("editNote", { noteId, content, title: e.target.value });
        console.log(content);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Note Editor
                </h2>
                <input
                    type="text"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={handleTitleEdit}
                    placeholder="Enter note title..."
                />
                <textarea
                    className="w-full h-60 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={content}
                    onChange={handleEdit}
                    placeholder="Start editing your note..."
                />
            </div>
        </div>
    );
}
