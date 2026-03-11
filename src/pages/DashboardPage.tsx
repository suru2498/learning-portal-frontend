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
        `${import.meta.env.VITE_API_URL}/api/categories`,
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
        <p className="text-gray-500 text-base sm:text-lg">
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
    className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8"
  >
    {/* Header */}
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
        Learning Dashboard 🚀
      </h1>
    </div>

    {categories.length === 0 ? (
      <div className="text-center text-gray-500 text-base sm:text-lg">
        No categories available.
      </div>
    ) : (
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-2
        xl:grid-cols-2
        gap-6 sm:gap-8
      "
      >
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/${category.slug}`)}
            className="relative group cursor-pointer rounded-3xl p-[2px]
            bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/40
            hover:scale-[1.02] transition"
          >
            <div className="rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-8 lg:p-10 shadow-md group-hover:shadow-xl transition flex flex-col">

              {/* Icon */}
              <div className="text-4xl sm:text-5xl mb-4">
                {category.name.toLowerCase().includes("system")
                  ? "🏗️"
                  : "💻"}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                {category.name}
              </h2>

              {/* Description */}
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base flex-grow">
                Explore topics and start mastering concepts.
              </p>

              {/* CTA */}
              <div className="mt-6 text-blue-600 font-semibold group-hover:translate-x-2 transition">
                View Topics →
              </div>

            </div>
          </div>
        ))}
      </div>
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