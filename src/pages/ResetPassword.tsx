import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");

  const token = searchParams.get("token");

  const handleReset = async () => {
    if (!token) {
      alert("Invalid reset link");
      return;
    }

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
  };

  return (
    <div className="flex flex-col gap-4 w-80 mx-auto mt-20">
      <h2 className="text-xl font-bold">Reset Password</h2>

      <input
        className="border p-2"
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-green-500 text-white p-2"
        onClick={handleReset}
      >
        Reset Password
      </button>
    </div>
  );
}