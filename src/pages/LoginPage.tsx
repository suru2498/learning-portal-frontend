import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { startAutoLogoutTimer } from "../utils/autoLogout";

type LoginMode = "password" | "emailOtp" | "mobileOtp";
type OtpStep = "send" | "verify";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<LoginMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("send");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= PASSWORD LOGIN ================= */
  const handlePasswordLogin = async () => {
    if (!email.trim()) return toast.error("Enter email");
    if (!password.trim()) return toast.error("Enter password");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      startAutoLogoutTimer();

      toast.success("Logged in successfully 🚀");
      navigate("/dashboard");

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND EMAIL OTP ================= */
  const handleSendEmailOtp = async () => {
    if (!email.trim()) return toast.error("Enter email");

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-email-otp`,
        { email }
      );

      toast.success("OTP sent to email 📩");
      setOtpStep("verify");

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY EMAIL OTP ================= */
  const handleVerifyEmailOtp = async () => {
    if (!otp.trim()) return toast.error("Enter OTP");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verify-email-otp`,
        { email, otp }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      startAutoLogoutTimer();
      toast.success("Logged in 🚀");
      navigate("/dashboard");

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND MOBILE OTP ================= */
  const handleSendMobileOtp = async () => {
  if (!phone.trim()) return toast.error("Enter mobile number");

  // Remove non-digits
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length !== 10) {
    return toast.error("Enter valid 10 digit mobile number");
  }

  const formattedPhone = `+91${cleaned}`;

  try {
    setLoading(true);

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/send-mobile-otp`,
      { phone: formattedPhone }
    );

    toast.success("OTP sent to mobile 📱");
    setOtpStep("verify");

  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed");
  } finally {
    setLoading(false);
  }
};

  /* ================= VERIFY MOBILE OTP ================= */
  const handleVerifyMobileOtp = async () => {
  if (!otp.trim()) return toast.error("Enter OTP");

  const cleaned = phone.replace(/\D/g, "");
  const formattedPhone = `+91${cleaned}`;

  try {
    setLoading(true);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/verify-mobile-otp`,
      { phone: formattedPhone, otp }
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("name", res.data.user.name);

    startAutoLogoutTimer();
    toast.success("Logged in 🚀");
    navigate("/dashboard");

  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 overflow-hidden">

      {/* Floating Bubbles */}
      <div className="absolute w-40 h-40 bg-gradient-to-br from-blue-300/60 to-cyan-400/50 rounded-full top-16 left-20 animate-float shadow-xl"></div>
      <div className="absolute w-56 h-56 bg-gradient-to-br from-indigo-300/60 to-blue-500/50 rounded-full bottom-20 right-20 animate-floatSlow shadow-2xl"></div>
      <div className="absolute w-32 h-32 bg-gradient-to-br from-cyan-300/60 to-blue-400/50 rounded-full bottom-32 left-1/3 animate-float shadow-lg"></div>

      {/* Glass Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-[420px] text-white animate-fadeIn">

        <h2 className="text-4xl font-bold mb-6 text-center">
          Sign In
        </h2>

        {/* MODE TOGGLE */}
        <div className="flex mb-6 bg-white/20 rounded-xl p-1">
          {["password", "emailOtp", "mobileOtp"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setMode(item as LoginMode);
                setOtpStep("send");
                setOtp("");
              }}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === item
                  ? "bg-white text-blue-700 font-semibold"
                  : "text-white"
              }`}
            >
              {item === "password"
                ? "Password"
                : item === "emailOtp"
                ? "Email OTP"
                : "Mobile OTP"}
            </button>
          ))}
        </div>

        {/* PASSWORD MODE */}
        {mode === "password" && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl bg-white/20 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-white/20 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="text-right text-sm text-gray-200 mb-4">
              <span
                className="underline cursor-pointer hover:text-white"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </p>

            <button
              onClick={handlePasswordLogin}
              disabled={loading}
              className="w-full bg-white text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </>
        )}

        {/* EMAIL OTP MODE */}
        {mode === "emailOtp" && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl bg-white/20 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {otpStep === "send" ? (
              <button
                onClick={handleSendEmailOtp}
                disabled={loading}
                className="w-full bg-white text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 rounded-xl bg-white/20 mb-4 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={handleVerifyEmailOtp}
                  disabled={loading}
                  className="w-full bg-white text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </>
            )}
          </>
        )}

        {/* MOBILE OTP MODE */}
        {mode === "mobileOtp" && (
          <>
            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full p-3 rounded-xl bg-white/20 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {otpStep === "send" ? (
              <button
                onClick={handleSendMobileOtp}
                disabled={loading}
                className="w-full bg-white text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 rounded-xl bg-white/20 mb-4 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={handleVerifyMobileOtp}
                  disabled={loading}
                  className="w-full bg-white text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </>
            )}
          </>
        )}

        {/* REGISTER LINK */}
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
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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