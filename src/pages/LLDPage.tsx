import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LLDTheoryPage() {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState<any>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    if (!topicSlug) return;

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/topics/topic/${topicSlug}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => setTopic(res.data))
      .catch((err) => console.error(err));
  }, [topicSlug]);

  if (!topic) {
    return (
      <div className="p-10">
        <p>Loading...</p>
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
      {topic.pseudo_code && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto">
          <h2 className="text-white text-2xl font-semibold mb-4">
            💻 Pseudo Code
          </h2>

          <pre className="text-sm whitespace-pre-wrap">
            <code>{topic.pseudo_code}</code>
          </pre>
        </div>
      )}

    </div>
  );
}