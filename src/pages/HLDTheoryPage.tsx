import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function HLDTheoryPage() {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState<any>(null);

  useEffect(() => {
    if (!topicSlug) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/topics/${topicSlug}`)
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

      <h1 className="text-4xl font-bold mb-6">
        {topic.title}
      </h1>

      <div className="prose max-w-none text-gray-700">
        {topic.description || "No theory added yet."}
      </div>

    </div>
  );
}