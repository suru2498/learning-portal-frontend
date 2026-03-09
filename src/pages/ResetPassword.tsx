import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const handleReset = async () => {
    if (!token) {
      alert("Invalid reset link");
      return;
    }

    if (!password.trim()) {
      alert("Please enter a new password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        }
      );

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 flex justify-center pt-20 px-4 overflow-x-hidden">
    
    <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold text-center mb-6">
        Reset Password
      </h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleReset();
        }}
        className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition disabled:opacity-60"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

    </div>

  </div>
);
}