import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcode_link?: string;
  isSolved?: number;
}

interface Topic {
  id: number;
  title: string;
  description?: string;
  summary?: string;
  problems: Problem[];
}

export default function TopicPage() {
  const { topicSlug } = useParams<{
    categorySlug: string;
    topicSlug: string;
  }>();
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [showConcept, setShowConcept] = useState(true);
  const [showProblems, setShowProblems] = useState(true);

  const [newProblem, setNewProblem] = useState({
    title: "",
    difficulty: "Easy",
    leetcode_link: ""
  });

  const [editTopicData, setEditTopicData] = useState({
    title: "",
    description: "",
    summary: ""
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role?.toLowerCase() === "admin";

  useEffect(() => {
    if (topicSlug) fetchTopic();
  }, [topicSlug]);

  const fetchTopic = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/topics/topic/${topicSlug}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined
        }
      );

      setTopic(res.data);

      setEditTopicData({
        title: res.data.title || "",
        description: res.data.description || "",
        summary: res.data.summary || ""
      });

    } catch (err) {
      console.error(err);
      setTopic(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSolved = async (problemId: number, isSolved?: number) => {
    try {
      if (isSolved) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/topics/problem/${problemId}/solve`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/topics/problem/${problemId}/solve`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchTopic();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProblem = async () => {
    if (!topic) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/topics/problem`,
        {
          ...newProblem,
          topic_id: topic.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewProblem({
        title: "",
        difficulty: "Easy",
        leetcode_link: ""
      });

      setShowForm(false);
      fetchTopic();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTopic = async () => {
    if (!topic) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/topics/${topic.id}`,
        editTopicData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditMode(false);
      fetchTopic();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTopic = async () => {
    if (!topic) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/topics/${topic.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // After delete, go back to category page
      navigate(`/category/${categorySlug}`);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!topic) return <div className="p-10">Topic not found.</div>;

  const total = topic.problems.length;
  const solved = topic.problems.filter(p => p.isSolved).length;
  const progress = total === 0 ? 0 : Math.round((solved / total) * 100);

  const easyTotal = topic.problems.filter(p => p.difficulty === "Easy").length;
  const mediumTotal = topic.problems.filter(p => p.difficulty === "Medium").length;
  const hardTotal = topic.problems.filter(p => p.difficulty === "Hard").length;

  const easySolved = topic.problems.filter(
    p => p.difficulty === "Easy" && p.isSolved
  ).length;

  const mediumSolved = topic.problems.filter(
    p => p.difficulty === "Medium" && p.isSolved
  ).length;

  const hardSolved = topic.problems.filter(
    p => p.difficulty === "Hard" && p.isSolved
  ).length;

  return (
    <div className="lex justify-between items-center mb-8">

      <h1 className="text-3xl font-bold mb-4 capitalize">
        {topic.title}
      </h1>

      {isAdmin && (
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-yellow-600 text-white px-4 py-2 rounded mb-6"
          >
            {editMode ? "Cancel" : "Edit Topic"}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded mb-6"
          >
            Delete Topic
          </button>

          <button
            onClick={() => setShowAddProblem((prev) => !prev)}
            className={`px-4 py-2 rounded-lg transition ${showAddProblem
              ? "bg-blue-600 text-white px-4 py-2 rounded mb-6"
              : "bg-blue-600 text-white px-4 py-2 rounded mb-6"
              }`}
          >
            {showAddProblem ? "Cancel" : "+ Add Problem"}
          </button>

        </div>
      )}


      {showAddProblem && (
        <div className="mt-6 mb-8 p-6 bg-white dark:bg-slate-800 border rounded-xl shadow-sm space-y-4">

          <input
            type="text"
            placeholder="Problem Title"
            value={newProblem.title}
            onChange={(e) =>
              setNewProblem({ ...newProblem, title: e.target.value })
            }
            className="w-full p-3 border rounded-lg dark:bg-slate-900"
          />

          <select
            value={newProblem.difficulty}
            onChange={(e) =>
              setNewProblem({
                ...newProblem,
                difficulty: e.target.value as "Easy" | "Medium" | "Hard",
              })
            }
            className="w-full p-3 border rounded-lg dark:bg-slate-900"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input
            type="text"
            placeholder="LeetCode Link"
            value={newProblem.leetcode_link}
            onChange={(e) =>
              setNewProblem({
                ...newProblem,
                leetcode_link: e.target.value,
              })
            }
            className="w-full p-3 border rounded-lg dark:bg-slate-900"
          />

          <button
            onClick={handleAddProblem}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Save Problem
          </button>

        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex gap-6 text-sm">
          <span className="text-green-600">
            Easy: {easySolved}/{easyTotal}
          </span>
          <span className="text-yellow-600">
            Medium: {mediumSolved}/{mediumTotal}
          </span>
          <span className="text-red-600">
            Hard: {hardSolved}/{hardTotal}
          </span>
        </div>
      </div>

      {editMode ? (
        <div className="mb-8 space-y-4">
          <input
            value={editTopicData.title}
            onChange={(e) =>
              setEditTopicData({ ...editTopicData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <textarea
            value={editTopicData.description}
            onChange={(e) =>
              setEditTopicData({ ...editTopicData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <textarea
            value={editTopicData.summary}
            onChange={(e) =>
              setEditTopicData({ ...editTopicData, summary: e.target.value })
            }
            className="w-full p-2 border rounded h-40"
          />

          <button
            onClick={handleUpdateTopic}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      ) : (
        topic.summary && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm overflow-hidden">

            {/* Header */}
            <button
              onClick={() => setShowConcept((prev) => !prev)}
              className="w-full flex justify-between items-center p-6 text-left"
            >
              <h3 className="text-lg font-semibold">
                Concept Overview
              </h3>

              <span
                className={`transition-transform duration-300 ${showConcept ? "rotate-180" : ""
                  }`}
              >
                ▼
              </span>
            </button>

            {/* Collapsible Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${showConcept
                ? "max-h-[1000px] opacity-100 px-6 pb-6"
                : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {topic.summary}
              </div>
            </div>

          </div>
        )
      )}



      {isAdmin && showForm && (
        <div className="mb-8 space-y-4">
          <input
            placeholder="Problem Title"
            value={newProblem.title}
            onChange={(e) =>
              setNewProblem({ ...newProblem, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <select
            value={newProblem.difficulty}
            onChange={(e) =>
              setNewProblem({
                ...newProblem,
                difficulty: e.target.value as any
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input
            placeholder="LeetCode Link"
            value={newProblem.leetcode_link}
            onChange={(e) =>
              setNewProblem({
                ...newProblem,
                leetcode_link: e.target.value
              })
            }
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleAddProblem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Problem
          </button>
        </div>
      )}

      <div className="mb-10 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm overflow-hidden">

        {/* Header */}
        <button
          onClick={() => setShowProblems((prev) => !prev)}
          className="w-full flex justify-between items-center p-6 text-left"
        >
          <h3 className="text-lg font-semibold">
            Problems
          </h3>

          <span
            className={`transition-transform duration-300 ${showProblems ? "rotate-180" : ""
              }`}
          >
            ▼
          </span>
        </button>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-300 ease-in-out ${showProblems
              ? "max-h-[3000px] opacity-100 px-6 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >

          {topic.problems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No problems added yet.
            </p>
          ) : (
            topic.problems.map(problem => (
              <div
                key={problem.id}
                className={`p-5 border rounded-xl mb-4 ${problem.isSolved
                    ? "bg-green-50 border-green-400"
                    : "bg-white dark:bg-slate-900"
                  }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3>{problem.title}</h3>

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() =>
                        handleToggleSolved(problem.id, problem.isSolved)
                      }
                      className={`px-3 py-1 rounded text-sm ${problem.isSolved
                          ? "bg-gray-300"
                          : "bg-green-500 text-white"
                        }`}
                    >
                      {problem.isSolved
                        ? "Mark Unsolved"
                        : "Mark Solved"}
                    </button>

                    <span className="text-sm">
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                {problem.leetcode_link && (
                  <a
                    href={problem.leetcode_link}
                    target="_blank"
                    className="text-blue-600 text-sm"
                  >
                    Solve on LeetCode →
                  </a>
                )}
              </div>
            ))
          )}

        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-96 shadow-xl">

            <h3 className="text-lg font-semibold mb-4">
              Delete Topic
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this topic?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-600 hover:opacity-80 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleDeleteTopic();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}