import { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Heart,
  X,
  TrafficCone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onClose, onSignupRedirect }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const DURATION = 350; // 🔥 faster & snappier

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);

    setTimeout(() => {
      onClose();
    }, DURATION);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      console.log("Login with:", { email, password });
      try {
        let response = await axios.post('http://localhost:8000/auth/login', { email, password });
        console.log(response);
        const { message, success, jwtToken, Email, name, isVerified, role } = response.data;
        
        if (success && isVerified) {
          localStorage.setItem("token", jwtToken);
          localStorage.setItem("loggedInUser", name);
          localStorage.setItem("emailId", Email);
          localStorage.setItem("role", role);
        
          // Trigger the exit animation and close the modal
          handleClose(); 
          
          // Add a slight delay so the modal animation finishes before switching pages
          if(role==='doctor'){
            setTimeout(() => {
              navigate("/page");
            }, DURATION); 
          }
          else if(role==='worker'){
            setTimeout(() => {
              navigate("/page");
            }, DURATION); 
          }
          else if(role==='admin'){
            setTimeout(() => {
              navigate("/page");
            }, DURATION); 
          }
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center p-4
        transition-all duration-[350ms] ease-out
        ${
          isAnimating
            ? "bg-black/30 backdrop-blur-sm opacity-100"
            : "bg-black/0 backdrop-blur-0 opacity-0"
        }
      `}
    >
      {/* Background blobs */}
      <div
        className={`
          absolute inset-0 overflow-hidden pointer-events-none
          transition-opacity duration-[350ms]
          ${isAnimating ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div
        className={`
          relative w-full max-w-sm sm:max-w-md
          bg-white rounded-3xl shadow-2xl
          overflow-hidden
          transform transition-all duration-[350ms] ease-out
          ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-6"
          }
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="
            absolute top-3 right-3 sm:top-4 sm:right-4 z-20
            p-2 rounded-xl
            text-gray-400 hover:text-gray-600
            hover:bg-gray-100
            transition-all duration-200
            hover:rotate-90 hover:scale-110
            active:scale-95
          "
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-slate-500" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl mb-4 shadow-lg">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 fill-emerald-600" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign in to continue to MigraHealth
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:outline-none focus:bg-white transition
                    ${
                      errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 bg-gray-50 focus:outline-none focus:bg-white transition
                    ${
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              <span className="flex items-center justify-center gap-2">
                Sign In <ArrowRight size={18} />
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={onSignupRedirect}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
