import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Section {
  title: string;
  content: string;
}

export default function TopicPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState<Section[]>([]);
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [progress, setProgress] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Topic
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7777/api/topics/${name?.toLowerCase()}`
        );

        const rawContent = res.data.content;

        // Split by ## headings
        const splitSections = rawContent
          .split(/^##\s+/gm)
          .filter(Boolean)
          .map((section: string) => {
            const lines = section.split("\n");
            const title = lines[0];
            const content = lines.slice(1).join("\n");
            return { title, content };
          });

        setSections(splitSections);

        // Load saved progress
        const savedProgress = JSON.parse(
          localStorage.getItem(`progress-${name}`) || "[]"
        );

        if (savedProgress.length === splitSections.length) {
          setProgress(savedProgress);
        } else {
          setProgress(new Array(splitSections.length).fill(false));
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [name]);

  // Save progress to localStorage
  useEffect(() => {
    if (name) {
      localStorage.setItem(
        `progress-${name}`,
        JSON.stringify(progress)
      );
    }
  }, [progress, name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const completedCount = progress.filter(Boolean).length;
  const percentage =
    sections.length > 0
      ? Math.round((completedCount / sections.length) * 100)
      : 0;

  return (
    <div
      className="
        min-h-screen px-6 py-10 transition-colors duration-500
        bg-gray-100 dark:bg-slate-900
        text-black dark:text-white
      "
    >
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 text-blue-600 dark:text-blue-300"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Progress Card */}
        <div className="bg-white/70 dark:bg-white/10 p-6 rounded-2xl border border-gray-300 dark:border-white/20 backdrop-blur-xl">
          <div className="flex justify-between mb-2 font-semibold">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>

          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Accordion Sections */}
        {sections.map((section, index) => (
          <div
            key={index}
            className="border border-gray-300 dark:border-white/20 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-white/10"
          >

            {/* Header */}
            <button
              onClick={() => {
                if (openSections.includes(index)) {
                  setOpenSections(
                    openSections.filter(i => i !== index)
                  );
                } else {
                  setOpenSections([...openSections, index]);
                }
              }}
              className="w-full text-left px-6 py-4 font-semibold text-lg flex justify-between items-center hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={progress[index] || false}
                  onChange={(e) => {
                    const updated = [...progress];
                    updated[index] = e.target.checked;
                    setProgress(updated);
                  }}
                />
                {section.title}
              </div>

              <span>
                {openSections.includes(index) ? "−" : "+"}
              </span>
            </button>

            {/* Content */}
            {openSections.includes(index) && (
              <div className="px-6 pb-6 prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {section.content}
                </ReactMarkdown>
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}