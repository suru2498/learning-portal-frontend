import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AddTopicModal from "../components/AddTopicModal";

interface Topic {
  id: number;
  title: string;
  slug: string;
}

export default function SystemDesignTopicPage() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [children, setChildren] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const hasFetched = useRef(false);
  

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchChildren();
  }, [topicSlug]);

  const fetchChildren = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/topics/children/${topicSlug}`
      );

      setChildren(res.data);
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold capitalize">
          {topicSlug}
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
        <div className="grid grid-cols-2 gap-6">
          {children.map((child) => (
            <div
              key={child.id}
              onClick={() =>
                navigate(
                  `/system-design/${topicSlug}/${child.slug}`
                )
              }
              className="p-6 border rounded-xl hover:shadow-lg cursor-pointer"
            >
              {child.title}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
  <AddTopicModal
    parentSlug={topicSlug}   // 👈 THIS IS CRITICAL
    onClose={() => setShowModal(false)}
    refresh={fetchChildren}
  />
)}
    </div>
  );
}

