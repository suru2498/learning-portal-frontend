import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function HLDPage() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<any>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!topicSlug) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/topics/theory/${topicSlug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTopic(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
      })
      .catch(console.error);
  }, [topicSlug]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/topics/sd/${topic.id}`,
        {
          title,
          description,
          pseudo_code: topic.pseudo_code,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTopic({ ...topic, title, description });
      setEditOpen(false);

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/topics/sd/${topic.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/system-design/hld");

    } catch (err) {
      console.error(err);
    }
  };

  if (!topic)
    return <div className="p-10 text-gray-900 dark:text-gray-100">Loading...</div>;

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:max-w-5xl lg:mx-auto">

      {/* Title + Buttons */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
        >
          ←
        </button>

        <h1 className="flex-1 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight break-words">
          {topic.title}
        </h1>

        {role === "ADMIN" && (
          <div className="flex gap-2 sm:gap-3 shrink-0 ml-auto">

            <button
              onClick={() => setEditOpen(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={() => setDeleteOpen(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>

          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">

        <div
          className="prose dark:prose-invert max-w-none prose-sm sm:prose-base break-words"
          dangerouslySetInnerHTML={{
            __html: topic.description || "<p>No theory added yet.</p>",
          }}
        />

      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl w-[95%] sm:w-[600px] lg:w-[700px] shadow-xl">

            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Edit Topic
            </h2>

            <input
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-lg p-2 mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows={10}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-lg p-2 mb-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DELETE MODAL */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-xl">

            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Delete Topic
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this topic?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}