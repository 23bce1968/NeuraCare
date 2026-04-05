import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User, Heart, MapPin, Briefcase, Languages, Phone, Save,
  ChevronRight, Shield, Sparkles,
} from "lucide-react";

const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STEPS = [
  { label: "Personal", fields: ["age", "gender", "bloodGroup"] },
  { label: "Work & Location", fields: ["location", "occupation", "language"] },
  { label: "Emergency", fields: ["emergencyContact"] },
];

function WorkerProfileForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    age: "", gender: "", bloodGroup: "",
    location: "", occupation: "", language: "",
    emergencyContact: "",
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/worker/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/page");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    return STEPS[step].fields.every((f) => form[f] !== "");
  };

  const name = localStorage.getItem("loggedInUser") || "there";

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className={`relative w-full max-w-lg transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xl shadow-emerald-500/30">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Hey {name.split(" ")[0]}, let's set you up
          </h1>
          <p className="text-gray-500 text-xs mt-1 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Your data is encrypted and secure
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-4 px-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1 w-full rounded-full transition-all duration-500 ${
                i <= step ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gray-200"
              }`} />
              <span className={`text-[11px] font-medium transition-colors ${
                i <= step ? "text-emerald-600" : "text-gray-400"
              }`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-emerald-900/5">

          {/* Step 1 — Personal */}
          {step === 0 && (
            <div className="space-y-3 animate-fadeSlide">
              <div>
                <h2 className="text-base font-bold text-gray-800">Personal Details</h2>
                <p className="text-xs text-gray-400">Basic info for your health profile</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-emerald-500" /> Age
                </label>
                <input type="number" name="age" value={form.age} onChange={handleChange}
                  placeholder="e.g. 28" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-emerald-500" /> Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDERS.map((g) => (
                    <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                      className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        form.gender === g
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/10"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <Heart size={13} className="text-red-400" /> Blood Group
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((b) => (
                    <button key={b} type="button" onClick={() => setForm({ ...form, bloodGroup: b })}
                      className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.bloodGroup === b
                          ? "border-red-400 bg-red-50 text-red-600 shadow-md shadow-red-500/10"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Work & Location */}
          {step === 1 && (
            <div className="space-y-3 animate-fadeSlide">
              <div>
                <h2 className="text-base font-bold text-gray-800">Work & Location</h2>
                <p className="text-xs text-gray-400">Where you work and what you speak</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-blue-500" /> Location
                </label>
                <input type="text" name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Ernakulam, Kerala" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-amber-500" /> Occupation
                </label>
                <input type="text" name="occupation" value={form.occupation} onChange={handleChange}
                  placeholder="e.g. Electrician, Plumber, Driver" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <Languages size={13} className="text-purple-500" /> Languages
                </label>
                <input type="text" name="language" value={form.language} onChange={handleChange}
                  placeholder="e.g. Malayalam, Tamil, Hindi" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white transition-all" />
              </div>
            </div>
          )}

          {/* Step 3 — Emergency */}
          {step === 2 && (
            <div className="space-y-3 animate-fadeSlide">
              <div>
                <h2 className="text-base font-bold text-gray-800">Emergency Contact</h2>
                <p className="text-xs text-gray-400">Who should we contact in an emergency?</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <Phone size={13} className="text-red-500" /> Phone Number
                </label>
                <input type="tel" name="emergencyContact" value={form.emergencyContact} onChange={handleChange}
                  placeholder="e.g. 9876543210" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white transition-all" />
              </div>

              {/* Summary preview */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                <h3 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Profile Summary
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">Age:</span> <span className="font-medium text-gray-800">{form.age || "—"}</span></div>
                  <div><span className="text-gray-500">Gender:</span> <span className="font-medium text-gray-800">{form.gender || "—"}</span></div>
                  <div><span className="text-gray-500">Blood:</span> <span className="font-medium text-gray-800">{form.bloodGroup || "—"}</span></div>
                  <div><span className="text-gray-500">Location:</span> <span className="font-medium text-gray-800">{form.location || "—"}</span></div>
                  <div><span className="text-gray-500">Work:</span> <span className="font-medium text-gray-800">{form.occupation || "—"}</span></div>
                  <div><span className="text-gray-500">Language:</span> <span className="font-medium text-gray-800">{form.language || "—"}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-5">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">
                Back
              </button>
            )}

            {step < 2 ? (
              <button type="button" onClick={() => canProceed() && setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-40 disabled:shadow-none transition-all flex items-center justify-center gap-2">
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button type="submit" disabled={saving || !canProceed()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-40 disabled:shadow-none transition-all flex items-center justify-center gap-2">
                <Save size={18} />
                {saving ? "Saving..." : "Save & Continue"}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-3">
          NeuraCare — Your health, your control
        </p>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeSlide { animation: fadeSlide 0.35s ease-out; }
      `}</style>
    </div>
  );
}

export default WorkerProfileForm;