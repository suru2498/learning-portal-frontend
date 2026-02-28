import { useState } from "react";
import axios from "axios";

interface Props {
  categorySlug?: string;
  parentSlug?: string;
  onClose: () => void;
  refresh: () => void;
}

export default function AddTopicModal({
  categorySlug,
  parentSlug,
  onClose,
  refresh,
}: Props) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim()) return;

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/topics`,
      {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        categorySlug: categorySlug || null,
        parentSlug: parentSlug || null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-96 shadow-xl">

        <h2 className="text-xl font-bold mb-6">Add Topic</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title (e.g. Content Delivery Network)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* Slug */}
        <input
          type="text"
          placeholder="Slug (e.g. cdn)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg"
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}