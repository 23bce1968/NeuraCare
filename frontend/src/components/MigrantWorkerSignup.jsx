import { useEffect, useState } from "react";
import { User, Mail, Phone, Shield, ArrowRight, Check, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Pass onSuccess={() => navigate('/workerpage')} from the parent component
export default function MigrantWorkerSignup({ onClose, onSignin, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp:"",
    role: "worker",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setIsAnimating(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Validate only the pre-OTP fields
  const validateDetails = () => {
    const newErrors = { name: "", email: "", phone: "", password: "", otp: "" };
    let ok = true;

    if (formData.name.trim().length < 2) {
      newErrors.name = "Enter a valid name";
      ok = false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
      ok = false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "10-digit number required";
      ok = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  // Phase 1: Send all details to backend, trigger OTP
  const handleSendOTP = async () => {
    if (!validateDetails()) return;

    setIsSendingOtp(true);
    try {
      await axios.post("http://localhost:8000/auth/signup/worker", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      setOtpSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send OTP. Try again.";
      setErrors((prev) => ({ ...prev, email: msg }));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Phase 2: Verify OTP and navigate
  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
  
    if (formData.otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      return;
    }
  
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/auth/signup/verify-email", {
        email: formData.email,
        verificationCode: formData.otp,
      });
  
      handleClose();
      onSignin?.(); // 🔥 redirect to login
  
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Invalid OTP. Please try again.";
      setErrors((prev) => ({ ...prev, otp: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        bg-black/40 backdrop-blur-sm
        flex items-center justify-center
        px-3
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`
          relative w-full max-w-sm
          bg-white rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-300 ease-out
          ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          ✕
        </button>

        {/* Top Gradient */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Worker Signup</h1>
            <p className="text-xs text-gray-600">Create your MigraHealth account</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-5">
            <StepDot active label="1" done={otpSent} />
            <div className={`flex-1 h-0.5 rounded ${otpSent ? "bg-emerald-500" : "bg-gray-200"}`} />
            <StepDot active={otpSent} label="2" done={false} />
          </div>
          <p className="text-center text-xs text-gray-500 -mt-3 mb-4">
            {otpSent ? "Step 2: Verify your email OTP" : "Step 1: Fill in your details"}
          </p>

          {/* Form */}
          <form onSubmit={handleVerifyAndSignup} className="space-y-3">
            {/* ── Phase 1 fields ── */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              icon={<User className="w-4 h-4" />}
              value={formData.name}
              error={errors.name}
              disabled={otpSent}
              onChange={(v) => handleChange("name", v)}
            />

            <Input
              label="Email Address"
              placeholder="your.email@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              error={errors.email}
              disabled={otpSent}
              onChange={(v) => handleChange("email", v)}
            />

            <Input
              label="phone Number"
              placeholder="10-digit phone number"
              icon={<Phone className="w-4 h-4" />}
              value={formData.phone}
              error={errors.phone}
              disabled={otpSent}
              onChange={(v) => handleChange("phone", v.replace(/\D/g, ""))}
            />

            {/* Password with show/hide toggle */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Password</label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={otpSent}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`
                    w-full pl-10 pr-10 py-2 rounded-xl border text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                    ${errors.password ? "border-red-400" : "border-gray-300"}
                    ${otpSent ? "bg-gray-100" : ""}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* ── Phase 1 CTA — Send OTP ── */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isSendingOtp}
                className="w-full mt-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSendingOtp ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending OTP…
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Send OTP
                  </>
                )}
              </button>
            )}

            {/* ── Phase 2: OTP field + Signup button ── */}
            {otpSent && (
              <>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-700">
                  OTP sent to <span className="font-semibold">{formData.email}</span>. Check your inbox.
                </div>

                <Input
                  label="Verification OTP"
                  placeholder="Enter 6-digit OTP"
                  icon={<Shield className="w-4 h-4" />}
                  value={formData.otp}
                  error={errors.otp}
                  onChange={(v) => handleChange("otp", v.replace(/\D/g, "").slice(0, 6))}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setFormData((p) => ({ ...p, otp: "" }));
                    setErrors((p) => ({ ...p, otp: "" }));
                  }}
                  className="w-full text-xs text-gray-500 hover:text-emerald-600 underline"
                >
                  ← Go back and edit details
                </button>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="text-center mt-4 text-xs text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => {
                onClose();
                setTimeout(onSignin, 250);
              }}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step dot indicator ── */
function StepDot({ active, done, label }) {
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
        ${done ? "bg-emerald-500 border-emerald-500 text-white"
          : active ? "border-emerald-500 text-emerald-600 bg-white"
          : "border-gray-300 text-gray-400 bg-white"}`}
    >
      {done ? <Check className="w-3.5 h-3.5" /> : label}
    </div>
  );
}

/* ── Reusable Input ── */
function Input({ label, placeholder, icon, value, onChange, error, disabled }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700 mb-1 block">{label}</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">{icon}</div>
        <input
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full pl-10 pr-3 py-2 rounded-xl border text-sm
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            ${error ? "border-red-400" : "border-gray-300"}
            ${disabled ? "bg-gray-100" : ""}
          `}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}