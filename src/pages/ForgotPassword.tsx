import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

if (!res.ok) {
  alert(data.message || "Something went wrong");
  return;
}

alert(data.resetLink || data.message);
  };

  return (
    <div className="flex flex-col gap-4 w-80 mx-auto mt-20">
      <h2 className="text-xl font-bold">Forgot Password</h2>
      <input
        className="border p-2"
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2"
        onClick={handleSubmit}
      >
        Send Reset Link
      </button>
    </div>
  );
}