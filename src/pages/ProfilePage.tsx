import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:7777/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data));
  }, []);

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">

      <div className="bg-white w-[500px] p-8 rounded-2xl shadow">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            Profile
          </h1>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium
              ${user.role === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
              }`}
          >
            {user.role}
          </span>
        </div>

        <div className="space-y-4 text-gray-700">

          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Member Since</p>
            <p className="font-medium">
              {new Date(user.created_at).toDateString()}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}