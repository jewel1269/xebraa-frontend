import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

const NoteEditor = () => {
  const { noteId } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.emit("joinNote", noteId);
    socket.on("updateNote", (newContent) => setContent(newContent));
    return () => socket.off("updateNote");
  }, [noteId]);

  const handleEdit = (e) => {
    setContent(e.target.value);
    socket.emit("editNote", { noteId, content: e.target.value });
  };

  return <textarea value={content} onChange={handleEdit} />;
};

export default NoteEditor;
