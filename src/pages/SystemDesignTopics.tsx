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
          {type}
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
              onClick={() =>
                navigate(
                  `/system-design/${type}/${child.slug}`
                )
              }
              className="p-6 border rounded-xl hover:shadow-lg cursor-pointer"
            >
              {child.title}
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
    </motion.div>
  );
}

