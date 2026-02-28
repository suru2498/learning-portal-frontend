import { useState } from "react";
import axios from "axios";

interface Props {
  categorySlug: string;
  onClose: () => void;
  refresh: () => void;
}

export default function AddTopicModal({categorySlug, onClose, refresh,}: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await axios.post(`${import.meta.env.VITE_API_URL}/api/topics`,{ title, categorySlug },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl w-96">

        <h2 className="text-xl font-bold mb-6">
          Add Topic
        </h2>

        <input
          type="text"
          placeholder="Topic name (e.g. Arrays)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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