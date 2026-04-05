import { useState, useEffect } from "react";
import axios from "axios";
import { Shield, Lock, Unlock, CheckCircle, Info, X } from "lucide-react";

const API = "http://localhost:8000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export default function ConsentManager() {
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValue, setPendingValue] = useState(null);

  useEffect(() => { fetchConsent(); }, []);

  const fetchConsent = async () => {
    try {
      const res = await axios.get(`${API}/worker/consent`, { headers: authHeader() });
      setConsent(res.data.consent?.shareWithAdmin || false);
      setLastUpdated(res.data.consent?.updatedAt);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleToggleClick = (newVal) => {
    setPendingValue(newVal);
    setShowConfirm(true);
  };

  const confirmToggle = async () => {
    setShowConfirm(false);
    setToggling(true);
    try {
      const res = await axios.patch(`${API}/worker/consent`, { shareWithAdmin: pendingValue }, { headers: authHeader() });
      setConsent(res.data.consent.shareWithAdmin);
      setLastUpdated(res.data.consent.updatedAt);
    } catch (err) { console.error(err); }
    finally { setToggling(false); }
  };

  if (loading) return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-12 bg-gray-100 rounded-xl" />
    </div>
  );

  return (
    <>
      {/* ── Consent Card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
            consent ? "bg-emerald-500" : "bg-gray-400"
          }`}>
            {consent ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Data Consent</h3>
            <p className="text-[11px] text-gray-400">You control who sees your data</p>
          </div>
        </div>

        {/* Toggle row */}
        <div className={`rounded-xl p-4 border ${consent ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Shield className={`w-5 h-5 shrink-0 ${consent ? "text-emerald-600" : "text-gray-400"}`} />
              <div>
                <p className="text-sm font-semibold text-gray-800">Share with Admin & AI</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {consent ? "Your data is used for public health insights" : "Your data is private and not shared"}
                </p>
              </div>
            </div>

            <button onClick={() => handleToggleClick(!consent)} disabled={toggling}
              className={`relative w-14 h-7 rounded-full shrink-0 transition-colors duration-300 ${consent ? "bg-emerald-500" : "bg-gray-300"} ${toggling ? "opacity-50" : ""}`}>
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${consent ? "left-[1.625rem]" : "left-0.5"}`}>
                {toggling
                  ? <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  : consent
                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    : <Lock className="w-3 h-3 text-gray-400" />
                }
              </div>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 ${consent ? "bg-emerald-50" : "bg-amber-50"}`}>
          <Info className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${consent ? "text-emerald-500" : "text-amber-500"}`} />
          <p className={`text-[11px] leading-relaxed ${consent ? "text-emerald-700" : "text-amber-700"}`}>
            {consent
              ? "Your anonymized health data helps improve public health monitoring and AI-powered disease detection."
              : "Your health data is fully private. Admin cannot view your records and data is excluded from AI analysis."}
          </p>
        </div>
        {lastUpdated && (
          <p className="text-[10px] text-gray-400 mt-2 text-right">Last updated: {new Date(lastUpdated).toLocaleDateString()}</p>
        )}
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative" style={{ animation: "cmIn 0.25s ease-out" }}>
            {/* Close */}
            <button onClick={() => setShowConfirm(false)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="text-center mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                pendingValue ? "bg-emerald-500" : "bg-amber-500"
              }`}>
                {pendingValue
                  ? <Unlock className="w-7 h-7 text-white" />
                  : <Lock className="w-7 h-7 text-white" />
                }
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {pendingValue ? "Enable Data Sharing?" : "Disable Data Sharing?"}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
              {pendingValue
                ? "Your anonymized health data will be shared with the admin for public health monitoring and AI-powered insights. Your personal identity remains protected."
                : "Your health data will become fully private. Admin will not be able to see your records and your data will be excluded from AI analysis."}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={confirmToggle}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  pendingValue ? "bg-emerald-500 shadow-emerald-500/25" : "bg-amber-500 shadow-amber-500/25"
                }`}>
                {pendingValue ? "Yes, Enable" : "Yes, Disable"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cmIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
    </>
  );
}