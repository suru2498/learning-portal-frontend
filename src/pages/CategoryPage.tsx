import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddTopicModal from "../components/AddTopicModal";

interface Topic {
  id: number;
  title: string;
  slug: string;
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const role = localStorage.getItem("role");

  const [topics, setTopics] = useState<Topic[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch topics
  const fetchTopics = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7777/api/topics/category/${categorySlug}`
      );
      setTopics(res.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      fetchTopics();
    }
  }, [categorySlug]);

  return (
    <div className="p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Topics</h1>

        {role === "ADMIN" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Topic
          </button>
        )}
      </div>

      {/* Topics List */}
      {loading ? (
        <p>Loading...</p>
      ) : topics.length === 0 ? (
        <p>No topics yet.</p>
      ) : (
        <ul className="space-y-4">
          {topics.map((topic) => (
            <li
              key={topic.id}
              onClick={() =>
                navigate(`/category/${categorySlug}/${topic.slug}`)
              }
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              {topic.title}
            </li>
          ))}
        </ul>
      )}

      {/* 🔥 MODAL RENDER */}
      {showModal && categorySlug && (
        <AddTopicModal
          categorySlug={categorySlug}
          onClose={() => setShowModal(false)}
          refresh={fetchTopics}
        />
      )}
    </div>
  );
}