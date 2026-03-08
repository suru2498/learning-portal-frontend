import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
          phone: res.data.phone || "",
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
      className="w-full max-w-3xl mx-auto py-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your account details
          </p>
        </div>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm w-fit"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700 p-6 sm:p-8">

        {/* Top Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">{user.name}</h2>

          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
            {user.role}
          </span>
        </div>

        <div className="border-t dark:border-slate-700 mb-6" />

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>

            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg dark:bg-slate-900"
              />
            ) : (
              <p className="font-medium">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>

            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg dark:bg-slate-900"
              />
            ) : (
              <p className="font-medium">{user.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Mobile Number</p>

            {editMode ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg dark:bg-slate-900"
              />
            ) : (
              <p className="font-medium">
                {user.phone ? user.phone.replace("+91", "") : "N/A"}
              </p>
            )}
          </div>

          {/* Member Since */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-medium">{memberSince}</p>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>

        </div>

        {/* Buttons */}
        {editMode && (
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-200 dark:bg-slate-700 px-5 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}