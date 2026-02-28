import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!email.trim()) {    // validation
      toast.error("Please enter email");
      return;
    }
    if (!password.trim()) {    // validation
      toast.error("Please enter password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);  // 👈 add this
      localStorage.setItem("name", res.data.user.name);  // 👈 add this
      toast.success("Logged in successfully 🚀");
      navigate("/dashboard");

    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Login failed";

      if (backendMessage === "Invalid credentials") {
        toast(
          (t) => (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-xl border border-white/20 backdrop-blur-lg w-72">

              <div className="font-semibold mb-2">
                User doesn’t exist
              </div>

              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/register");
                }}
                className="text-sm underline hover:text-gray-200 transition"
              >
                Sign up now →
              </button>

            </div>
          ),
          {
            duration: 4000,
            position: "top-right",
          }
        );
      } else {
        toast.error(backendMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 overflow-hidden">

      {/* Floating Bubbles - No Blur */}
      <div className="absolute w-40 h-40 bg-gradient-to-br from-blue-300/60 to-cyan-400/50 rounded-full top-16 left-20 animate-float shadow-xl"></div>
      <div className="absolute w-56 h-56 bg-gradient-to-br from-indigo-300/60 to-blue-500/50 rounded-full bottom-20 right-20 animate-floatSlow shadow-2xl"></div>
      <div className="absolute w-32 h-32 bg-gradient-to-br from-cyan-300/60 to-blue-400/50 rounded-full bottom-32 left-1/3 animate-float shadow-lg"></div>

      {/* Glass Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-[420px] text-white animate-fadeIn">

        <h2 className="text-4xl font-bold mb-6 text-center tracking-wide">
          Sign In
        </h2>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-200">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-8 relative">
          <label className="block text-sm mb-2 text-gray-200">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] cursor-pointer text-sm text-gray-200 hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <p className="text-right text-sm text-gray-200 -mt-4 mb-6">
  <span
    className="underline cursor-pointer hover:text-white"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </span>
</p>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-100 transition duration-300 disabled:opacity-70"
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></span>
          )}
          Login
        </button>

        <p className="mt-8 text-sm text-center text-gray-200">
          Don’t have an account?{" "}
          <span
            className="underline cursor-pointer hover:text-white"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }

          @keyframes floatSlow {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-35px); }
            100% { transform: translateY(0px); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out;
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-floatSlow {
            animation: floatSlow 10s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}