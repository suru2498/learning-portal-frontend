import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  leetcode_link?: string;
}

interface Topic {
  id: number;
  title: string;
  description?: string;
}

export default function TopicPage() {
  // ✅ Now reading BOTH params
  const { topicSlug } = useParams<{
    categorySlug: string;
    topicSlug: string;
  }>();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicSlug) {
      fetchTopic();
    }
  }, [topicSlug]);

  const fetchTopic = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:7777/api/topics/topic/${topicSlug}`
      );

      setTopic(res.data.topic);
      setProblems(res.data.problems);

    } catch (error) {
      console.error("Error fetching topic:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!topic) {
    return <div className="p-10">Topic not found.</div>;
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 capitalize">
        {topic.title}
      </h1>

      {/* Description */}
      {topic.description && (
        <p className="mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
          {topic.description}
        </p>
      )}

      {/* Problems Section */}
      <h2 className="text-xl font-semibold mb-4">
        Problems
      </h2>

      {problems.length === 0 ? (
        <p>No problems added yet.</p>
      ) : (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="p-5 border rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">
                  {problem.title}
                </h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    problem.difficulty === "Easy"
                      ? "bg-green-100 text-green-600"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              {problem.leetcode_link && (
                <a
                  href={problem.leetcode_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Solve on LeetCode →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}