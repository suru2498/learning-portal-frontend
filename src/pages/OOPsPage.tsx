import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OOPsPage() {

  const { topicSlug } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pseudoCode, setPseudoCode] = useState("");

  const role = localStorage.getItem("role");

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

        setTopic(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPseudoCode(res.data.pseudo_code || "");

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    };

    fetchTopic();

  }, [topicSlug]);

  const handleUpdate = async () => {

    try {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/topics/sd/${topic.id}`,
        {
          title,
          description,
          pseudo_code: pseudoCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTopic({
        ...topic,
        title,
        description,
        pseudo_code: pseudoCode,
      });

      setEditOpen(false);

    } catch (err) {
      console.error(err);
    }

  };

  const handleDelete = async () => {

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/topics/sd/${topic.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/system-design/oops");

    } catch (err) {
      console.error(err);
    }

  };

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

      {/* Title + Buttons */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          {topic.title}
        </h1>

        {role === "ADMIN" && (
          <div className="flex gap-3">

            <button
              onClick={() => setEditOpen(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={() => setDeleteOpen(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>

          </div>
        )}

      </div>

      {/* Theory */}
      <div className="bg-white p-8 rounded-xl shadow-sm mb-10">

        <h2 className="text-2xl font-semibold mb-4">
          📘 Theory
        </h2>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: topic.description }}
        />

      </div>

      {/* Pseudo Code */}
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

      {/* EDIT MODAL */}
      {editOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[750px]">

            <h2 className="text-xl font-bold mb-4">
              Edit Topic
            </h2>

            <input
              className="w-full border rounded-lg p-2 mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows={8}
              className="w-full border rounded-lg p-2 mb-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <textarea
              rows={8}
              className="w-full border rounded-lg p-2 mb-4 font-mono"
              value={pseudoCode}
              onChange={(e) => setPseudoCode(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

      {/* DELETE MODAL */}
      {deleteOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px]">

            <h2 className="text-xl font-bold mb-3">
              Delete Topic
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this topic?  
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
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