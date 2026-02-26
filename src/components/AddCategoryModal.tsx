import { useState } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
  refresh: () => void;
}

export default function AddCategoryModal({ onClose, refresh }: Props) {
  const [name, setName] = useState("");
  

  const handleSubmit = async () => {
    if (!name.trim()) return;

    await axios.post(
      "http://localhost:7777/api/categories",
      { name },
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl w-96 shadow-xl">

        <h2 className="text-xl font-bold mb-6">
          Add Category
        </h2>

        <input
          type="text"
          placeholder="Category name (e.g. DSA)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-6 dark:bg-slate-700"
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose}>
            Cancel
          </button>
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