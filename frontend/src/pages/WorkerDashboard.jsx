import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  User, Heart, Calendar, Clock, Phone, MapPin, Activity,
  Stethoscope, Plus, X, LogOut, FileText, Pill, Mail,
  Thermometer, Droplets, Wind, ChevronRight, AlertCircle,
  Bell, Shield, Sparkles, TrendingUp, ChevronDown, Lock, Unlock
} from "lucide-react";

const API = "http://localhost:8000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

/* ─── Animated wrapper for staggered reveals ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
}

export default function WorkerDashboard() {
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => { fetchAll(); setTimeout(() => setMounted(true), 50); }, []);

  // Fetch consent status on load
  useEffect(() => {
    const fetchConsent = async () => {
      try {
        const res = await axios.get(`${API}/worker/consent`, { headers: authHeader() });
        setConsent(res.data.consent?.shareWithAdmin || false);
      } catch (err) { console.error(err); }
    };
    fetchConsent();
  }, []);

  const toggleConsent = () => setShowConsentModal(true);

  const confirmConsent = async () => {
    setShowConsentModal(false);
    const newVal = !consent;
    setConsentLoading(true);
    try {
      const res = await axios.patch(`${API}/worker/consent`, { shareWithAdmin: newVal }, { headers: authHeader() });
      setConsent(res.data.consent.shareWithAdmin);
    } catch (err) { console.error(err); }
    finally { setConsentLoading(false); }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profileRes, apptRes, recordsRes, doctorsRes] = await Promise.all([
        axios.get(`${API}/worker/profile`, { headers: authHeader() }),
        axios.get(`${API}/worker/appointments`, { headers: authHeader() }),
        axios.get(`${API}/worker/health-records`, { headers: authHeader() }),
        axios.get(`${API}/worker/doctors`, { headers: authHeader() }),
      ]);
      setProfile(profileRes.data);
      setAppointments(apptRes.data);
      setHealthRecords(recordsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); window.location.href = "/"; }
    } finally { setLoading(false); }
  };

  const nextAppt = appointments
    .filter(a => new Date(a.date) >= new Date() && a.status !== "cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const daysUntilNext = nextAppt
    ? Math.ceil((new Date(nextAppt.date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const hasAnyAppointment = appointments.length > 0;
  const userName = localStorage.getItem("loggedInUser") || "User";

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <Heart className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/10 relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-teal-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className={`bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:scale-110 transition-transform duration-300">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">NeuraCare</span>
              <p className="text-[10px] text-gray-400 -mt-0.5">Worker Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all group">
              <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
              {appointments.filter(a => a.status === "pending").length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                {userName[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors duration-300 group">
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 relative">

        {/* Welcome + Next appointment */}
        <Reveal delay={100}>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{userName.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's your health overview for today</p>
          </div>
        </Reveal>

        {nextAppt && (
          <Reveal delay={200}>
            <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 sm:p-5 text-white shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-shadow duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    Next appointment {daysUntilNext === 0 ? "today!" : `in ${daysUntilNext} day${daysUntilNext > 1 ? "s" : ""}`}
                  </p>
                  <p className="text-white/80 text-xs mt-0.5">
                    Dr. {nextAppt.doctorId?.name} · {new Date(nextAppt.date).toLocaleDateString()} · {nextAppt.timeSlot}
                  </p>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shrink-0">{nextAppt.status}</span>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tabs */}
        <Reveal delay={300}>
          <div className="flex gap-1 bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-1.5 mb-6 overflow-x-auto shadow-sm">
            {[
              { id: "overview", label: "My Profile", icon: User },
              { id: "records", label: "Health Records", icon: FileText },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "doctors", label: "Find Doctors", icon: Stethoscope },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap flex-1 justify-center transition-all duration-300
                  ${tab === id ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* ════════ OVERVIEW ════════ */}
        {tab === "overview" && profile && (
          <div className="space-y-4">
            {/* Quick stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Visits", value: healthRecords.length, icon: Activity, gradient: "from-emerald-500 to-teal-600", shadow: "emerald" },
                { label: "Upcoming", value: appointments.filter(a => ["pending","confirmed"].includes(a.status)).length, icon: Calendar, gradient: "from-blue-500 to-cyan-600", shadow: "blue" },
                { label: "Active Issues", value: healthRecords.filter(r => ["active","ongoing"].includes(r.status)).length, icon: AlertCircle, gradient: "from-amber-500 to-orange-600", shadow: "amber" },
                { label: "Health Score", value: "Good", icon: TrendingUp, gradient: "from-violet-500 to-purple-600", shadow: "violet" },
              ].map((stat, i) => (
                <Reveal key={i} delay={400 + i * 100}>
                  <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-default">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${stat.shadow}-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Profile cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: "Age", value: `${profile.age} years`, icon: User, color: "emerald" },
                { label: "Gender", value: profile.gender, icon: User, color: "blue" },
                { label: "Blood Group", value: profile.bloodGroup, icon: Droplets, color: "red" },
                { label: "Location", value: profile.location, icon: MapPin, color: "violet" },
                { label: "Occupation", value: profile.occupation, icon: Activity, color: "amber" },
                { label: "Language", value: profile.language, icon: Wind, color: "cyan" },
              ].map((card, i) => (
                <Reveal key={i} delay={500 + i * 80}>
                  <ProfileCard {...card} />
                </Reveal>
              ))}
            </div>

            {/* Emergency + Security */}
            <Reveal delay={900}>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/60 rounded-2xl p-4 hover:shadow-lg transition-all duration-500 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform duration-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Emergency Contact</p>
                      <p className="text-gray-900 font-bold">{profile.emergencyContact}</p>
                    </div>
                  </div>
                </div>
                <div className={`border rounded-2xl p-4 hover:shadow-lg transition-all duration-500 group ${consent ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-500 group-hover:scale-110 ${consent ? "bg-emerald-500" : "bg-gray-400"}`}>
                        {consent ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${consent ? "text-emerald-500" : "text-gray-400"}`}>Data Consent</p>
                        <p className="text-sm text-gray-700">{consent ? "Shared with admin & AI" : "Private — not shared"}</p>
                      </div>
                    </div>
                    <button onClick={toggleConsent} disabled={consentLoading}
                      className={`relative w-14 h-7 rounded-full shrink-0 transition-colors duration-300 ${consent ? "bg-emerald-500" : "bg-gray-300"} ${consentLoading ? "opacity-50" : ""}`}>
                      <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${consent ? "left-[1.625rem]" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {/* ════════ HEALTH RECORDS ════════ */}
        {tab === "records" && (
          <div>
            {!hasAnyAppointment ? (
              <Reveal delay={400}>
                <EmptyStateCard icon={AlertCircle} title="No health records yet"
                  subtitle="Book a doctor first to get health records"
                  action={<button onClick={() => setTab("doctors")} className="mt-4 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">Find a Doctor</button>} />
              </Reveal>
            ) : healthRecords.length === 0 ? (
              <Reveal delay={400}><EmptyStateCard icon={FileText} title="No health records uploaded by your doctor yet" /></Reveal>
            ) : (
              <div className="space-y-3">
                {healthRecords.map((record, i) => (
                  <Reveal key={record._id} delay={400 + i * 100}>
                    <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                            record.diagnosisSeverity === "severe" || record.diagnosisSeverity === "critical"
                              ? "bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/25"
                              : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25"
                          }`}>
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-900">{record.diagnosis || "No diagnosis yet"}</span>
                              {record.diagnosisSeverity && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${severityColor(record.diagnosisSeverity)}`}>
                                  {record.diagnosisSeverity}
                                </span>
                              )}
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${record.type === "hospital" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                                {record.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Dr. {record.doctorId?.name} · {new Date(record.createdAt).toLocaleDateString()}</p>
                            {record.symptoms?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {record.symptoms.slice(0, 4).map((s, j) => (
                                  <span key={j} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s}</span>
                                ))}
                                {record.symptoms.length > 4 && <span className="text-[10px] text-gray-400">+{record.symptoms.length - 4} more</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <button onClick={() => setSelectedRecord(record)}
                          className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:gap-1.5">
                          View <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════ APPOINTMENTS ════════ */}
        {tab === "appointments" && (
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <Reveal delay={400}>
                <EmptyStateCard icon={Calendar} title="No appointments yet" subtitle="Browse available doctors and book your first appointment"
                  action={<button onClick={() => setTab("doctors")} className="mt-4 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">Find a Doctor</button>} />
              </Reveal>
            ) : (
              appointments.map((appt, i) => (
                <Reveal key={appt._id} delay={400 + i * 100}>
                  <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 flex items-center gap-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">Dr. {appt.doctorId?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(appt.date).toDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.timeSlot}</span>
                      </p>
                      {appt.reason && <p className="text-xs text-gray-400 mt-1 truncate">{appt.reason}</p>}
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 ${apptStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        )}

        {/* ════════ FIND DOCTORS ════════ */}
        {tab === "doctors" && (
          <div>
            {!hasAnyAppointment && (
              <Reveal delay={350}>
                <div className="mb-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 rounded-2xl px-4 py-3 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700">Book a doctor below to get started. Your health records will appear once a doctor uploads them after your appointment.</p>
                </div>
              </Reveal>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.length === 0 ? (
                <div className="col-span-3"><Reveal delay={400}><EmptyStateCard icon={Stethoscope} title="No verified doctors available yet" /></Reveal></div>
              ) : (
                doctors.map((doc, i) => (
                  <Reveal key={doc._id} delay={400 + i * 120}>
                    <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          {doc.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Dr. {doc.name}</p>
                          <p className="text-xs text-gray-400">ID: {doc.doctorId}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 relative">
                        <p className="text-xs text-gray-500 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" />{doc.email}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" />{doc.phone}</p>
                      </div>
                      <button onClick={() => setBookingDoctor(doc)}
                        className="relative mt-auto w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                        <Plus className="w-4 h-4" /> Book Appointment
                      </button>
                    </div>
                  </Reveal>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {bookingDoctor && <BookingModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} onBooked={() => { setBookingDoctor(null); fetchAll(); setTab("appointments"); }} />}
      {selectedRecord && <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}

      {/* ── Consent Modal ── */}
      {showConsentModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 anim-overlay" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden anim-modal">
            {/* Top accent */}
            <div className={`h-1.5 ${consent ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`} />

            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                  consent
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30"
                }`}>
                  {consent
                    ? <Lock className="w-8 h-8 text-white" />
                    : <Unlock className="w-8 h-8 text-white" />
                  }
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">
                {consent ? "Disable Data Sharing?" : "Enable Data Sharing?"}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 text-center leading-relaxed mb-5">
                {consent
                  ? "Your health data will become fully private. Admin will not be able to view your records and your data will be excluded from AI health analysis."
                  : "Your anonymized health data will be shared with the admin for public health monitoring and AI-powered insights. Your personal identity remains protected."
                }
              </p>

              {/* What changes */}
              <div className={`rounded-xl p-3 mb-5 ${consent ? "bg-amber-50" : "bg-emerald-50"}`}>
                <p className={`text-xs font-bold mb-2 ${consent ? "text-amber-700" : "text-emerald-700"}`}>What this means:</p>
                <div className="space-y-1.5">
                  {(consent
                    ? ["Admin cannot view your health records", "Your data excluded from AI insights", "Full privacy for your health data"]
                    : ["Admin can view anonymized health data", "Your data helps detect disease outbreaks", "Identity stays protected & encrypted"]
                  ).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${consent ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <p className={`text-xs ${consent ? "text-amber-700" : "text-emerald-700"}`}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button onClick={() => setShowConsentModal(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 active:scale-[0.97] transition-all">
                  Cancel
                </button>
                <button onClick={confirmConsent}
                  className={`flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all ${
                    consent
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/25"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25"
                  }`}>
                  {consent ? "Yes, Disable" : "Yes, Enable"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global animations */}
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
        .anim-modal { animation: modalIn 0.35s ease-out forwards; }
        .anim-overlay { animation: overlayIn 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
}

/* ══════════════════ BOOKING MODAL ══════════════════ */
function BookingModal({ doctor, onClose, onBooked }) {
  const today = new Date().toISOString().split("T")[0];
  const timeSlots = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"];
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBook = async () => {
    if (!date || !slot) { setError("Please select a date and time slot."); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/worker/appointments`, { doctorId: doctor._id, date, timeSlot: slot, reason }, { headers: authHeader() });
      onBooked();
    } catch (err) { setError(err.response?.data?.message || "Booking failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 anim-overlay" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 anim-modal">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Book Appointment</h2>
            <p className="text-sm text-gray-400">Dr. {doctor.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 hover:rotate-90 transition-all duration-300"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Select Date</label>
            <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Select Time Slot</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(t => (
                <button key={t} onClick={() => setSlot(t)}
                  className={`text-xs py-2.5 rounded-xl border-2 font-medium transition-all duration-300
                    ${slot === t ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/20 scale-[1.05]" : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"}`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Reason (optional)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Briefly describe your concern..." rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white resize-none" />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          <button onClick={handleBook} disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-300">
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ RECORD DETAIL MODAL ══════════════════ */
function RecordDetailModal({ record, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 anim-overlay" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto anim-modal">
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="font-bold text-gray-900">Health Record</h2>
            <p className="text-xs text-gray-400">Dr. {record.doctorId?.name} · {new Date(record.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 hover:rotate-90 transition-all duration-300"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-5">
          <Section title="Diagnosis">
            <p className="text-sm font-bold text-gray-800">{record.diagnosis || "—"}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {record.diagnosisSeverity && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${severityColor(record.diagnosisSeverity)}`}>{record.diagnosisSeverity}</span>}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${record.type === "hospital" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{record.type}</span>
            </div>
          </Section>

          {record.symptoms?.length > 0 && (
            <Section title="Symptoms">
              <div className="flex flex-wrap gap-1.5">{record.symptoms.map((s, i) => <span key={i} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full">{s}</span>)}</div>
            </Section>
          )}

          {record.vitals && Object.values(record.vitals).some(Boolean) && (
            <Section title="Vitals">
              <div className="grid grid-cols-2 gap-2">
                {record.vitals.temperature && <VitalBox label="Temperature" value={`${record.vitals.temperature}°F`} icon={Thermometer} />}
                {record.vitals.bp && <VitalBox label="Blood Pressure" value={record.vitals.bp} icon={Activity} />}
                {record.vitals.pulse && <VitalBox label="Pulse" value={`${record.vitals.pulse} bpm`} icon={Heart} />}
                {record.vitals.spo2 && <VitalBox label="SpO2" value={`${record.vitals.spo2}%`} icon={Wind} />}
                {record.vitals.weight && <VitalBox label="Weight" value={`${record.vitals.weight} kg`} icon={User} />}
                {record.vitals.bmi && <VitalBox label="BMI" value={record.vitals.bmi} icon={Activity} />}
              </div>
            </Section>
          )}

          {record.medications?.length > 0 && (
            <Section title="Medications">
              <div className="space-y-2">{record.medications.map((m, i) => (
                <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><Pill className="w-3.5 h-3.5 text-emerald-500" />{m.name}</p>
                  {(m.dosage || m.frequency || m.duration) && <p className="text-xs text-gray-500 mt-0.5">{[m.dosage, m.frequency, m.duration].filter(Boolean).join(" · ")}</p>}
                </div>
              ))}</div>
            </Section>
          )}

          {record.labResults?.length > 0 && (
            <Section title="Lab Results">
              {record.labResults.map((l, i) => (
                <div key={i} className={`rounded-xl px-3 py-2.5 mb-2 ${l.isAbnormal ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                  <p className="text-sm font-semibold text-gray-800">{l.testName}</p>
                  <p className="text-xs text-gray-500">Result: {l.result}{l.normalRange ? ` (Normal: ${l.normalRange})` : ""}</p>
                  {l.isAbnormal && <p className="text-xs text-red-600 font-medium mt-0.5">⚠ Abnormal</p>}
                </div>
              ))}
            </Section>
          )}

          {record.notes && <Section title="Doctor's Notes"><p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{record.notes}</p></Section>}
          {record.followUpDate && <Section title="Follow-up"><p className="text-sm text-gray-700 font-medium">{new Date(record.followUpDate).toDateString()}</p>{record.followUpNotes && <p className="text-xs text-gray-500 mt-1">{record.followUpNotes}</p>}</Section>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ HELPER COMPONENTS ══════════════════ */

function ProfileCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    emerald: { bg: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20" },
    blue: { bg: "from-blue-500 to-cyan-600", shadow: "shadow-blue-500/20" },
    red: { bg: "from-red-500 to-rose-600", shadow: "shadow-red-500/20" },
    violet: { bg: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20" },
    amber: { bg: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20" },
    cyan: { bg: "from-cyan-500 to-teal-600", shadow: "shadow-cyan-500/20" },
  };
  const c = colorMap[color] || colorMap.emerald;
  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 flex items-center gap-3 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
      <div className={`w-10 h-10 bg-gradient-to-br ${c.bg} rounded-xl flex items-center justify-center text-white shadow-lg ${c.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm font-bold text-gray-900 capitalize">{value || "—"}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>{children}</div>;
}

function VitalBox({ label, value, icon: Icon }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 flex items-center gap-2 border border-gray-100">
      <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
      <div><p className="text-[10px] text-gray-400">{label}</p><p className="text-sm font-bold text-gray-800">{value}</p></div>
    </div>
  );
}

function EmptyStateCard({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-8 h-8 text-gray-300" /></div>
      <p className="text-sm font-bold text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">{subtitle}</p>}
      {action}
    </div>
  );
}

function severityColor(s) {
  return { mild: "bg-green-100 text-green-700", moderate: "bg-yellow-100 text-yellow-700", severe: "bg-orange-100 text-orange-700", critical: "bg-red-100 text-red-700" }[s] || "bg-gray-100 text-gray-600";
}
function apptStatusColor(s) {
  return { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700", completed: "bg-blue-100 text-blue-700", cancelled: "bg-red-100 text-red-700" }[s] || "bg-gray-100 text-gray-600";
}