import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddTopicModal from "../components/AddTopicModal";
import { motion } from "framer-motion";

interface Topic {
  id: number;
  title: string;
  slug: string;
}

export default function SystemDesignTopicPage() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [children, setChildren] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { type } = useParams();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const titleMap: Record<string, string> = {
    hld: "High-Level Design",
    lld: "Low-Level Design",
    oops: "Object-Oriented Programming"
  };


  useEffect(() => {
    if (!type) return;

    // 🔥 CLEAR OLD DATA FIRST
    setChildren([]);
    setLoading(true);

    fetchChildren();
  }, [type]);

  const fetchChildren = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/topics/children/${type}`
      );
      setChildren(res.data);
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/topics/sd/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setDeleteId(null);
      fetchChildren();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <motion.div
      key={type} // 🔥 important for re-triggering animation
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-10"
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold capitalize">
          {titleMap[type || ""] || type}
        </h1>

        {role === "ADMIN" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add
          </button>
        )}
      </div>

      {/* Children */}
      {loading ? (
        <p>Loading...</p>
      ) : children.length === 0 ? (
        <p>No topics yet.</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {children.map((child) => (
            <div
              key={child.id}
              className="relative p-6 border rounded-xl hover:shadow-lg transition"
            >

              {/* Delete Button (Admin Only) */}
              {role === "ADMIN" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(child.id);
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
                >
                  🗑
                </button>
              )}

              {/* Card Click */}
              <div
                onClick={() =>
                  navigate(`/system-design/${type}/${child.slug}`)
                }
                className="cursor-pointer"
              >
                {child.title}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Add Modal */}
      {showModal && (
        <AddTopicModal
          parentSlug={type}   // 👈 THIS IS CRITICAL
          onClose={() => setShowModal(false)}
          refresh={fetchChildren}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">

            <h2 className="text-xl font-semibold mb-4">
              Delete Topic
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this topic? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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
    </motion.div>
  );

}