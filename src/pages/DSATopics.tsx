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
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-900 dark:text-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">DSA Topics</h1>

        {role === "ADMIN" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            + Add
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <motion.div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.04 }}
              className="
              relative
              border
              border-gray-200
              dark:border-gray-700
              rounded-xl
              p-4
              bg-white
              dark:bg-gray-800
              hover:shadow-md
              dark:hover:shadow-lg
              cursor-pointer
              flex
              items-center
              justify-center
              text-center
              min-h-[70px]
              transition
            "
              onClick={() => navigate(`/dsa/${topic.slug}`)}
            >
              {role === "ADMIN" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(topic.id);
                  }}
                  className="absolute top-2 right-2 text-red-500 text-xs hover:scale-110 transition"
                >
                  🗑
                </button>
              )}

              <span className="text-sm font-medium leading-snug">
                {topic.title}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Delete Topic
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this topic?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg"
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