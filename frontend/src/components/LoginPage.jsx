import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart, X, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onClose, onSignupRedirect }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const DURATION = 350;

  // Lock body scroll on mount, unlock on unmount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsAnimating(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => { document.body.style.overflow = ""; onClose(); }, DURATION);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    const newErrors = { email: "", password: "" };

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/auth/login", { email, password });
        const { success, jwtToken, Email, name, isVerified, role } = response.data;

        if (success && isVerified) {
          localStorage.setItem("token", jwtToken);
          localStorage.setItem("loggedInUser", name);
          localStorage.setItem("emailId", Email);
          localStorage.setItem("role", role);
          handleClose();
          setTimeout(() => navigate("/page"), DURATION);
        }
      } catch (error) {
        setLoginError(error.response?.data?.message || "Login failed. Please try again.");
      } finally { setIsLoading(false); }
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-[350ms] ease-out ${isAnimating ? "bg-black/40 backdrop-blur-md opacity-100" : "bg-black/0 backdrop-blur-0 opacity-0"}`}>

      {/* Background blobs */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />
      </div>

      {/* Card */}
      <div className={`relative w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-[350ms] ease-out ${isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`}>

        {/* Close */}
        <button onClick={handleClose} aria-label="Close modal"
          className="absolute top-3 right-3 z-20 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95">
          <X className="w-5 h-5" />
        </button>

        {/* Top gradient */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25 hover:scale-110 hover:rotate-3 transition-all duration-500">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-white">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to continue to NeuraCare</p>
          </div>

          {/* Error banner */}
          {loginError && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 animate-shake">
              <X className="w-3.5 h-3.5 shrink-0" />
              {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); setLoginError(""); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50/50 text-sm focus:outline-none focus:bg-white transition-all duration-300 ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"}`}
                  placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); setLoginError(""); }}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 bg-gray-50/50 text-sm focus:outline-none focus:bg-white transition-all duration-300 ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"}`}
                  placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2">
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-5 text-sm text-gray-500">
            Don't have an account?{" "}
            <button onClick={onSignupRedirect} className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors">
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Shake animation for error */}
      <style>{`
        @keyframes shake { 0%,100% { transform:translateX(0); } 20%,60% { transform:translateX(-4px); } 40%,80% { transform:translateX(4px); } }
        .animate-shake { animation: shake 0.4s ease-out; }
      `}</style>
    </div>
  );
}