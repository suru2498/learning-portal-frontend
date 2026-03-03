import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function HLDTheoryPage() {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState<any>(null);

  useEffect(() => {
    if (!topicSlug) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/topics/topic/${topicSlug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setTopic(res.data))
      .catch(console.error);
  }, [topicSlug]);

  if (!topic) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-12 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        {topic.title}
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-sm">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: topic.description || "<p>No theory added yet.</p>",
          }}
        />
      </div>

    </div>
  );
}