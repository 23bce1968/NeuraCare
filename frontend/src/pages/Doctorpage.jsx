import { useState, useEffect } from "react";
import axios from "axios";
import {
  Stethoscope, Users, FileText, LogOut, Heart, X, Plus,
  Calendar, Clock, User, Phone, ChevronDown, ChevronUp,
  Activity, Pill, FlaskConical, CheckCircle, AlertTriangle,
  Bell, HeartPulse, Shield, TrendingUp, Search
} from "lucide-react";

const API = "http://localhost:8000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div className={`transition-all duration-700 ease-out ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>{children}</div>;
}

/* ─── Doctor SVG Logo ─── */
const DocLogo = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
    <defs><linearGradient id="dg" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
    <rect width="48" height="48" rx="14" fill="url(#dg)" />
    <rect x="21" y="14" width="6" height="20" rx="3" fill="white" opacity="0.9" />
    <rect x="14" y="21" width="20" height="6" rx="3" fill="white" opacity="0.9" />
  </svg>
);

export default function Doctorpage() {
  const [tab, setTab] = useState("patients");
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordForm, setRecordForm] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if appointment date+time has passed
  const hasApptPassed = (appt) => {
    const apptDate = new Date(appt.date);
    const now = new Date();
    // Parse timeSlot like "03:00 PM"
    if (appt.timeSlot) {
      const [time, period] = appt.timeSlot.split(" ");
      let [hours, mins] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      apptDate.setHours(hours, mins, 0, 0);
    }
    return now >= apptDate;
  };

  useEffect(() => { fetchAll(); setTimeout(() => setMounted(true), 50); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, recRes] = await Promise.all([
        axios.get(`${API}/doctor/appointments`, { headers: authHeader() }),
        axios.get(`${API}/doctor/health-records`, { headers: authHeader() }),
      ]);
      setAppointments(apptRes.data);
      setHealthRecords(recRes.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); window.location.href = "/"; }
    } finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/doctor/appointments/${id}`, { status }, { headers: authHeader() });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const doctorName = localStorage.getItem("loggedInUser") || "Doctor";
  const pending = appointments.filter(a => a.status === "pending").length;
  const confirmed = appointments.filter(a => a.status === "confirmed").length;
  const todayAppts = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length;

  const filteredAppts = appointments.filter(a =>
    a.workerId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecords = healthRecords.filter(r =>
    r.workerId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/10 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <Stethoscope className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/10 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className={`bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hover:scale-110 hover:rotate-3 transition-all duration-500"><DocLogo /></div>
            <div>
              <span className="font-bold text-gray-900 text-sm">NeuraCare</span>
              <p className="text-[10px] text-blue-500 font-semibold -mt-0.5">Doctor Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all group">
              <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
              {pending > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                {doctorName[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Dr. {doctorName}</span>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors group">
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 relative">

        {/* Welcome */}
        <Reveal delay={100}>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Dr. {doctorName.split(" ")[0]}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's your practice overview for today</p>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Patients", value: appointments.length, icon: Users, gradient: "from-blue-500 to-cyan-600", shadow: "blue" },
            { label: "Pending Review", value: pending, icon: Clock, gradient: "from-amber-500 to-orange-600", shadow: "amber" },
            { label: "Today's Visits", value: todayAppts, icon: Calendar, gradient: "from-violet-500 to-purple-600", shadow: "violet" },
            { label: "Records Filed", value: healthRecords.length, icon: FileText, gradient: "from-emerald-500 to-teal-600", shadow: "emerald" },
          ].map((s, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <div className={`w-10 h-10 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${s.shadow}-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Pending alert banner */}
        {pending > 0 && (
          <Reveal delay={600}>
            <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">{pending} appointment{pending > 1 ? "s" : ""} awaiting your confirmation</p>
                  <p className="text-white/80 text-xs mt-0.5">Review and confirm or cancel pending appointments</p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tabs + Search */}
        <Reveal delay={700}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-1 bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-1.5 flex-1 shadow-sm">
              {[
                { id: "patients", label: "Patients", icon: Users },
                { id: "records", label: "Health Records", icon: FileText },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 justify-center transition-all duration-300
                    ${tab === id ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search patients..."
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all w-full sm:w-56" />
            </div>
          </div>
        </Reveal>

        {/* ════════ PATIENTS TAB ════════ */}
        {tab === "patients" && (
          <div className="space-y-3">
            {filteredAppts.length === 0 ? (
              <Reveal delay={800}><EmptyStateCard icon={Users} title="No patients found" /></Reveal>
            ) : filteredAppts.map((appt, i) => {
              const isExp = expandedId === appt._id;
              const profile = appt.workerProfile;
              const recordFiled = healthRecords.some(r => r.appointmentId === appt._id || r.workerId?._id === appt.workerId?._id);

              return (
                <Reveal key={appt._id} delay={800 + i * 80}>
                  <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
                        {appt.workerId?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{appt.workerId?.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${apptStatusColor(appt.status)}`}>{appt.status}</span>
                          {recordFiled && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" /> Filed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(appt.date).toDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.timeSlot}</span>
                        </p>
                        {appt.reason && <p className="text-xs text-gray-400 mt-0.5 truncate">{appt.reason}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {appt.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(appt._id, "confirmed")}
                              className="text-xs px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:scale-[1.05] active:scale-[0.95] transition-all duration-300">
                              Confirm
                            </button>
                            <button onClick={() => updateStatus(appt._id, "cancelled")}
                              className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100 transition-all">
                              Cancel
                            </button>
                          </>
                        )}
                        {appt.status === "confirmed" && !recordFiled && (
                          hasApptPassed(appt) ? (
                            <button onClick={() => setRecordForm(appt)}
                              className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Record
                            </button>
                          ) : (
                            <span className="text-[10px] px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg font-medium flex items-center gap-1" title="Available after appointment time">
                              <Clock className="w-3 h-3" /> Upcoming
                            </span>
                          )
                        )}
                        <button onClick={() => setExpandedId(isExp ? null : appt._id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                          {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded profile */}
                    <div className={`overflow-hidden transition-all duration-500 ${isExp ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30 px-4 py-3">
                        {profile ? (
                          <>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Profile</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                              <Detail label="Age" value={profile.age ? `${profile.age} yrs` : null} />
                              <Detail label="Gender" value={profile.gender} />
                              <Detail label="Blood Group" value={profile.bloodGroup} />
                              <Detail label="Occupation" value={profile.occupation} />
                              <Detail label="Location" value={profile.location} />
                              <Detail label="Language" value={profile.language} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-red-400" />
                              <span className="font-semibold text-gray-600">Emergency:</span> {profile.emergencyContact}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Patient has not completed their profile yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* ════════ RECORDS TAB ════════ */}
        {tab === "records" && (
          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <Reveal delay={800}><EmptyStateCard icon={FileText} title="No health records found" /></Reveal>
            ) : filteredRecords.map((record, i) => (
              <Reveal key={record._id} delay={800 + i * 80}>
                <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                        record.diagnosisSeverity === "severe" || record.diagnosisSeverity === "critical"
                          ? "bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/20"
                          : "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/20"
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{record.workerId?.name}</p>
                          {record.diagnosisSeverity && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${severityColor(record.diagnosisSeverity)}`}>
                              {record.diagnosisSeverity}
                            </span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(record.status)}`}>{record.status}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5 font-medium">{record.diagnosis}</p>
                        <p className="text-xs text-gray-400">{new Date(record.createdAt).toDateString()}</p>
                      </div>
                    </div>
                  </div>
                  {record.symptoms?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {record.symptoms.map((s, j) => (
                        <span key={j} className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {record.medications?.length > 0 && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Pill className="w-3 h-3 text-emerald-500" />
                        {record.medications.map(m => m.name).join(", ")}
                      </p>
                    )}
                    {record.vitals && Object.values(record.vitals).some(Boolean) && (
                      <div className="flex gap-2 flex-wrap">
                        {record.vitals.temperature && <VitalPill label="Temp" value={`${record.vitals.temperature}°F`} />}
                        {record.vitals.bp && <VitalPill label="BP" value={record.vitals.bp} />}
                        {record.vitals.pulse && <VitalPill label="Pulse" value={`${record.vitals.pulse}bpm`} />}
                        {record.vitals.spo2 && <VitalPill label="SpO2" value={`${record.vitals.spo2}%`} />}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Record form modal */}
      {recordForm && (
        <HealthRecordModal appointment={recordForm} onClose={() => setRecordForm(null)}
          onSaved={() => { setRecordForm(null); fetchAll(); setTab("records"); }} />
      )}

      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .anim-modal { animation: modalIn 0.35s ease-out forwards; }
      `}</style>
    </div>
  );
}

/* ══════════════════ HEALTH RECORD MODAL ══════════════════ */
function HealthRecordModal({ appointment, onClose, onSaved }) {
  const [form, setForm] = useState({
    symptoms: "", diagnosis: "", diagnosisSeverity: "",
    vitals: { temperature: "", bp: "", pulse: "", spo2: "", weight: "", height: "" },
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    labResults: [],
    notes: "", followUpDate: "", followUpNotes: "", type: "hospital", status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setVital = (k, v) => setForm(f => ({ ...f, vitals: { ...f.vitals, [k]: v } }));
  const setMed = (i, k, v) => setForm(f => { const m = [...f.medications]; m[i] = { ...m[i], [k]: v }; return { ...f, medications: m }; });
  const addMed = () => setForm(f => ({ ...f, medications: [...f.medications, { name: "", dosage: "", frequency: "", duration: "" }] }));
  const removeMed = i => setForm(f => ({ ...f, medications: f.medications.filter((_, idx) => idx !== i) }));
  const setLab = (i, k, v) => setForm(f => { const l = [...f.labResults]; l[i] = { ...l[i], [k]: v }; return { ...f, labResults: l }; });
  const addLab = () => setForm(f => ({ ...f, labResults: [...f.labResults, { testName: "", result: "", normalRange: "", isAbnormal: false }] }));
  const removeLab = i => setForm(f => ({ ...f, labResults: f.labResults.filter((_, idx) => idx !== i) }));

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const handleSubmit = async () => {
    if (!form.diagnosis.trim()) { setError("Diagnosis is required."); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/doctor/health-record`, {
        workerId: appointment.workerId._id, appointmentId: appointment._id,
        symptoms: form.symptoms.split(",").map(s => s.trim()).filter(Boolean),
        diagnosis: form.diagnosis, diagnosisSeverity: form.diagnosisSeverity || undefined,
        vitals: form.vitals, medications: form.medications.filter(m => m.name.trim()),
        labResults: form.labResults.filter(l => l.testName.trim()),
        notes: form.notes, followUpDate: form.followUpDate || undefined,
        followUpNotes: form.followUpNotes, type: form.type, status: form.status,
      }, { headers: authHeader() });
      onSaved();
    } catch (err) { setError(err.response?.data?.message || "Failed to save record."); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto anim-modal">
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10 rounded-t-3xl">
          <div>
            <h2 className="font-black text-gray-900">New Health Record</h2>
            <p className="text-xs text-gray-400">Patient: {appointment.workerId?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 hover:rotate-90 transition-all duration-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Diagnosis */}
          <FormSection title="Diagnosis" icon={Activity}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Symptoms (comma separated)</label>
                <input placeholder="fever, cough, headache" value={form.symptoms} onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Diagnosis *</label>
                <input placeholder="e.g. Viral Fever" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Severity</label>
                <select value={form.diagnosisSeverity} onChange={e => setForm(f => ({ ...f, diagnosisSeverity: e.target.value }))} className={`${inputCls} bg-white capitalize`}>
                  <option value="">Select...</option>
                  {["mild","moderate","severe","critical"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={`${inputCls} bg-white capitalize`}>
                  {["hospital","self-report","teleconsult","emergency"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={`${inputCls} bg-white capitalize`}>
                  {["active","recovered","ongoing","referred"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </FormSection>

          {/* Vitals */}
          <FormSection title="Vitals" icon={HeartPulse}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Temperature (°F)", key: "temperature", ph: "98.6" },
                { label: "Blood Pressure", key: "bp", ph: "120/80" },
                { label: "Pulse (bpm)", key: "pulse", ph: "72" },
                { label: "SpO2 (%)", key: "spo2", ph: "98" },
                { label: "Weight (kg)", key: "weight", ph: "65" },
                { label: "Height (cm)", key: "height", ph: "170" },
              ].map(v => (
                <div key={v.key}>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{v.label}</label>
                  <input placeholder={v.ph} value={form.vitals[v.key]} onChange={e => setVital(v.key, e.target.value)} className={inputCls} />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Medications */}
          <FormSection title="Medications" icon={Pill}>
            <div className="space-y-3">
              {form.medications.map((med, i) => (
                <div key={i} className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-3 border border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Name", key: "name", ph: "Paracetamol" },
                      { label: "Dosage", key: "dosage", ph: "500mg" },
                      { label: "Frequency", key: "frequency", ph: "Twice daily" },
                      { label: "Duration", key: "duration", ph: "5 days" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5 block">{f.label}</label>
                        <input placeholder={f.ph} value={med[f.key]} onChange={e => setMed(i, f.key, e.target.value)} className={inputCls} />
                      </div>
                    ))}
                  </div>
                  {form.medications.length > 1 && (
                    <button onClick={() => removeMed(i)} className="text-[11px] text-red-500 hover:underline mt-2 font-medium">Remove</button>
                  )}
                </div>
              ))}
              <button onClick={addMed} className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700 transition-colors">
                <Plus className="w-3 h-3" /> Add Medication
              </button>
            </div>
          </FormSection>

          {/* Lab Results */}
          <FormSection title="Lab Results" icon={FlaskConical}>
            <div className="space-y-3">
              {form.labResults.map((lab, i) => (
                <div key={i} className="bg-gradient-to-r from-gray-50 to-cyan-50/30 rounded-xl p-3 border border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Test Name", key: "testName", ph: "CBC" },
                      { label: "Result", key: "result", ph: "12.5 g/dL" },
                      { label: "Normal Range", key: "normalRange", ph: "12-16 g/dL" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5 block">{f.label}</label>
                        <input placeholder={f.ph} value={lab[f.key]} onChange={e => setLab(i, f.key, e.target.value)} className={inputCls} />
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-5">
                      <input type="checkbox" checked={lab.isAbnormal} onChange={e => setLab(i, "isAbnormal", e.target.checked)} className="w-4 h-4 accent-red-500 rounded" />
                      <label className="text-xs text-gray-600">Abnormal</label>
                    </div>
                  </div>
                  <button onClick={() => removeLab(i)} className="text-[11px] text-red-500 hover:underline mt-2 font-medium">Remove</button>
                </div>
              ))}
              <button onClick={addLab} className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700 transition-colors">
                <Plus className="w-3 h-3" /> Add Lab Result
              </button>
            </div>
          </FormSection>

          {/* Notes */}
          <FormSection title="Notes & Follow-up" icon={Calendar}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Follow-up Date</label>
                <input type="date" value={form.followUpDate} onChange={e => setForm(f => ({ ...f, followUpDate: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Follow-up Notes</label>
                <input placeholder="Review after course" value={form.followUpNotes} onChange={e => setForm(f => ({ ...f, followUpNotes: e.target.value }))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Doctor Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Additional observations..." rows={3}
                  className={`${inputCls} resize-none`} />
              </div>
            </div>
          </FormSection>

          {error && <p className="text-sm text-red-500 font-medium bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? "Saving..." : "Save Health Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ HELPERS ══════════════════ */

function FormSection({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Detail({ label, value }) {
  return <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p><p className="text-sm font-semibold text-gray-800 capitalize">{value || "—"}</p></div>;
}

function VitalPill({ label, value }) {
  return <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">{label}: {value}</span>;
}

function EmptyStateCard({ icon: Icon, title }) {
  return (
    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-8 h-8 text-gray-300" /></div>
      <p className="text-sm font-bold text-gray-500">{title}</p>
    </div>
  );
}

function severityColor(s) {
  return { mild: "bg-green-100 text-green-700", moderate: "bg-yellow-100 text-yellow-700", severe: "bg-orange-100 text-orange-700", critical: "bg-red-100 text-red-700" }[s] || "bg-gray-100 text-gray-600";
}
function statusColor(s) {
  return { active: "bg-blue-100 text-blue-700", recovered: "bg-green-100 text-green-700", ongoing: "bg-yellow-100 text-yellow-700", referred: "bg-purple-100 text-purple-700" }[s] || "bg-gray-100 text-gray-600";
}
function apptStatusColor(s) {
  return { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700", completed: "bg-blue-100 text-blue-700", cancelled: "bg-red-100 text-red-700" }[s] || "bg-gray-100 text-gray-600";
}