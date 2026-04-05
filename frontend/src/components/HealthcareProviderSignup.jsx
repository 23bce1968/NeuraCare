import { useEffect, useState } from "react";
import { Stethoscope, Mail, Phone, IdCard, ArrowRight, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function HealthcareProviderSignup({ onClose, onSignin }) {

  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    doctorName: "",
    email: "",
    phone: "",
    doctorId: "",
    password: "",
    role: "doctor",
  });

  const [errors, setErrors] = useState({
    doctorName: "",
    email: "",
    phone: "",
    doctorId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors = { doctorName: "", email: "", phone: "", doctorId: "", password: "" };
    let ok = true;

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = "Doctor name is required";
      ok = false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email required";
      ok = false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "10-digit phone required";
      ok = false;
    }
    if (formData.doctorId.trim().length < 5) {
      newErrors.doctorId = "Doctor ID too short";
      ok = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:8000/auth/signup/doctor", {
        name: formData.doctorName,
        email: formData.email,
        phone: formData.phone,
        doctorId: formData.doctorId,
        password: formData.password,
        role: formData.role,
      });

      setPopup({
        show: true,
        type: "success",
        message: "Registration successful! Your account will be verified within 24-48 hours.",
      });

      setTimeout(() => handleClose(), 3000);

    } catch (error) {
      setPopup({
        show: true,
        type: "error",
        message: error?.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ================= POPUP TOAST ================= */}
      {popup.show && (
        <div className="fixed top-5 right-5 z-[99999]">
          <div
            className={`
              bg-white shadow-2xl border rounded-2xl p-4 w-[320px]
              ${popup.type === "success" ? "border-blue-200" : "border-red-200"}
            `}
          >
            <div className="flex items-start gap-3">
              {popup.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold text-sm ${popup.type === "success" ? "text-blue-600" : "text-red-500"}`}>
                  {popup.type === "success" ? "Registration Successful" : "Registration Failed"}
                </h3>
                <p className="text-xs text-gray-600 mt-1">{popup.message}</p>
              </div>
              <button
                onClick={() => setPopup({ show: false, message: "", type: "success" })}
                className="text-gray-400 hover:text-gray-600 shrink-0 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Auto-close progress bar on success */}
            {popup.type === "success" && (
              <div className="mt-3 h-1 rounded-full bg-blue-100 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ animation: "shrink 3s linear forwards" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= OVERLAY ================= */}
      <div
        className={`fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center
          px-3 sm:px-0 transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* ================= CARD ================= */}
        <div
          className={`
            relative w-full max-w-xl
            bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden
            transition-all duration-300 ease-out
            ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition"
          >
            ✕
          </button>

          {/* Top Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600" />

          {/* ================= CONTENT ================= */}
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="text-center mb-5 sm:mb-6">
              <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-blue-100">
                <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Healthcare Provider</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Join NeuraCare as a medical professional</p>
            </div>

            {/* ================= FORM ================= */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Doctor Name"
                  placeholder="Dr. John Smith"
                  icon={<Stethoscope />}
                  value={formData.doctorName}
                  error={errors.doctorName}
                  onChange={(v) => handleChange("doctorName", v)}
                />
                <Input
                  label="Email Address"
                  placeholder="doctor@hospital.com"
                  icon={<Mail />}
                  value={formData.email}
                  error={errors.email}
                  onChange={(v) => handleChange("email", v)}
                />
                <Input
                  label="Phone Number"
                  placeholder="10-digit phone number"
                  icon={<Phone />}
                  value={formData.phone}
                  error={errors.phone}
                  onChange={(v) => handleChange("phone", v.replace(/\D/g, ""))}
                />
                <Input
                  label="Doctor ID / License"
                  placeholder="MD12345 or LIC-2024-001"
                  icon={<IdCard />}
                  value={formData.doctorId}
                  error={errors.doctorId}
                  onChange={(v) => handleChange("doctorId", v.toUpperCase())}
                />
              </div>

              {/* Password */}
              <div className="mt-3 sm:mt-4">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`
                      w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.password ? "border-red-400" : "border-gray-300"}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Note */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>Note:</strong> Your account will be verified within 24-48 hours after registration.
              </p>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => { onClose(); setTimeout(onSignin, 250); }}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar keyframe */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  );
}

/* ================= INPUT ================= */
function Input({ label, placeholder, icon, value, onChange, error }) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">{icon}</div>
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full pl-10 pr-3 py-2 sm:py-2.5 rounded-xl border text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-400" : "border-gray-300"}
          `}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}