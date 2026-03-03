import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddTopicModal from "../components/AddTopicModal";
import { motion } from "framer-motion";

interface Topic {
  id: number;
  title: string;
  slug: string;
}

export default function DSACategoryPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/topics/dsa`
      );
      setTopics(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="dsa-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-10"
    >
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
      ) : topics.length === 0 ? (
        <p>No topics yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/dsa/${topic.slug}`)}
              className="p-6 border rounded-xl hover:shadow-lg cursor-pointer transition"
            >
              {topic.title}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddTopicModal
          categorySlug="dsa"
          onClose={() => setShowModal(false)}
          refresh={fetchTopics}
        />
      )}
    </motion.div>
  );
}