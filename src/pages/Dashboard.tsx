import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddCategoryModal from "../components/AddCategoryModal";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`
      );
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        key="dashboard-loading"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <p className="text-gray-500 text-lg">
          Loading categories...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="dashboard-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-[80vh] px-6 py-10"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">
          Learning Dashboard 🚀
        </h1>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No categories available.
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate(`/${category.slug}`)}
                className="relative group cursor-pointer rounded-3xl p-[2px]
                           bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/40
                           hover:scale-[1.03] transition-all duration-300"
              >
                <div className="rounded-3xl bg-white dark:bg-slate-800 p-12 h-full shadow-md group-hover:shadow-2xl transition-all duration-300">
                  <div className="text-6xl mb-6">
                    {category.name.toLowerCase().includes("system")
                      ? "🏗️"
                      : "💻"}
                  </div>

                  <h2 className="text-3xl font-bold capitalize mb-4">
                    {category.name}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Explore topics and start mastering concepts.
                  </p>

                  <div className="mt-8 text-blue-600 font-semibold text-lg group-hover:translate-x-2 transition">
                    View Topics →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === "ADMIN" && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700
                     text-white px-5 py-2.5 rounded-full shadow-lg
                     hover:shadow-xl transition-all duration-200 z-50"
        >
          + Add Category
        </button>
      )}

      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          refresh={fetchCategories}
        />
      )}
    </motion.div>
  );
}