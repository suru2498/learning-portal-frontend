import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface DecodedToken {
  exp: number;
}

let logoutTimer: any;
let warningTimer: any;

export const startAutoLogoutTimer = () => {
  clearLogoutTimer(); // ✅ clear old timers first

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded: DecodedToken = jwtDecode(token);

    const expiryTime = decoded.exp * 1000;
    const remainingTime = expiryTime - Date.now();

    if (remainingTime <= 0) {
      forceLogout();
      return;
    }

    const warningTime = remainingTime - 60000;

    if (warningTime > 0) {
      warningTimer = setTimeout(() => {
        toast("⚠️ Session expires in 1 minute", { duration: 5000 });
      }, warningTime);
    }

    logoutTimer = setTimeout(() => {
      toast.error("Session expired");
      forceLogout();
    }, remainingTime);

  } catch {
    forceLogout();
  }
};

export const forceLogout = () => {
  clearLogoutTimer(); // ✅ clear timers
  localStorage.clear();
  window.location.href = "/";
};

export const clearLogoutTimer = () => {
  if (logoutTimer) clearTimeout(logoutTimer);
  if (warningTimer) clearTimeout(warningTimer);
};