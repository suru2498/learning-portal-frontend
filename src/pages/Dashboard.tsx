import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddCategoryModal from "../components/AddCategoryModal";

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:7777/api/categories"
      );

      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50 dark:bg-slate-900">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">
            Learning Dashboard 🚀
          </h1>

          {role === "ADMIN" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              + Add Category
            </button>
          )}
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <p className="text-gray-500">
            No categories available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() =>
                  navigate(`/category/${category.slug}`)
                }
                className="bg-white dark:bg-slate-800 border p-6 rounded-xl cursor-pointer hover:shadow-lg hover:scale-[1.02] transition"
              >
                <h3 className="font-medium text-lg capitalize">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  View topics →
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Category Modal */}
      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          refresh={fetchCategories}
        />
      )}

    </div>
  );
}