import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import AddTopicModal from "../components/AddTopicModal";

interface Topic {
  id: number;
  title: string;
  slug: string;
}

export default function DSACategoryPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/topics/dsa`
      );
      setTopics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/topics/dsa/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setDeleteId(null);
      fetchTopics();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DSA Topics</h1>
        {role === "ADMIN" && (
    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      + Add Topic
    </button>
  )}
      </div>

      {/* Topics Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="relative p-6 border rounded-xl hover:shadow-lg transition"
            >

              {/* Delete Button */}
              {role === "ADMIN" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(topic.id);
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
                >
                  🗑
                </button>
              )}

              <div
                onClick={() => navigate(`/dsa/${topic.slug}`)}
                className="cursor-pointer"
              >
                {topic.title}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-96 shadow-xl">

            <h2 className="text-xl font-semibold mb-4">
              Delete Topic
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this topic? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {showModal && (
  <AddTopicModal
    categorySlug="dsa"
    onClose={() => setShowModal(false)}
    refresh={fetchTopics}
  />
)}

    </div>
  );
}