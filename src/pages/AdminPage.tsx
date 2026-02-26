import { useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const createTopic = async () => {
    await axios.post(
      "http://localhost:7777/api/admin/topics",
      { slug, title, content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Topic created");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="bg-white p-6 rounded shadow w-1/2">
        <h2 className="font-semibold mb-4">Create Topic</h2>

        <input
          placeholder="Slug"
          className="border p-2 w-full mb-3"
          onChange={(e) => setSlug(e.target.value)}
        />

        <input
          placeholder="Title"
          className="border p-2 w-full mb-3"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content (Markdown)"
          className="border p-2 w-full mb-3"
          rows={6}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createTopic}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Topic
        </button>
      </div>
    </div>
  );
}