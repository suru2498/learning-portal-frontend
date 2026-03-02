import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface User {
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const token = localStorage.getItem("token");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token || hasFetched.current) return;
    hasFetched.current = true;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
        });
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/me`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!user) return <p>Loading...</p>;

  const memberSince = user.created_at
    ? new Date(user.created_at).toDateString()
    : "N/A";

  return (
    <motion.div
      key="profile-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-500 mt-1">
            Manage your account details
          </p>
        </div>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition shadow-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700 p-10">

        {/* Top Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          <span className="px-4 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
            {user.role}
          </span>
        </div>

        <div className="border-t dark:border-slate-700 mb-8" />

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg dark:bg-slate-900"
              />
            ) : (
              <p className="font-medium">{user.name}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg dark:bg-slate-900"
              />
            ) : (
              <p className="font-medium">{user.email}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-medium">{memberSince}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>

        </div>

        {editMode && (
          <div className="flex gap-4 mt-10">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-200 dark:bg-slate-700 px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}