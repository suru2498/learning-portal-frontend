import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OOPsPage() {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicSlug) return;

    const fetchTopic = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/topics/theory/${topicSlug}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("API DATA:", res.data);
        setTopic(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [topicSlug]);

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-10">
        <p>Topic not found.</p>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-4xl mx-auto">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8">
        {topic.title}
      </h1>

      {/* Theory Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          📘 Theory
        </h2>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: topic.description }}
        />
      </div>

      {/* Pseudocode Section */}
      {topic.pseudo_code && topic.pseudo_code.trim().length > 0 && (
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-white text-2xl font-semibold mb-4">
            💻 Pseudo Code
          </h2>

          <pre className="text-green-400 text-sm whitespace-pre overflow-x-auto">
            <code>{topic.pseudo_code}</code>
          </pre>
        </div>
      )}

    </div>
  );
}