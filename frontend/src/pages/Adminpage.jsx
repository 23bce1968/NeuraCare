import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, CheckCircle, Clock, BrainCircuit,
  Menu, X, LogOut, MapPin, AlertTriangle, TrendingUp,
  Activity, Users, Loader2, RefreshCw, Lightbulb,
  BarChart3, ChevronRight,
} from "lucide-react";

const TABS = [
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle },
  { id: "ai", label: "AI Insights", icon: BrainCircuit },
];

const API = "http://localhost:8000/admin";
const SEV_COLORS = { mild: "#34d399", moderate: "#fbbf24", severe: "#f97316", critical: "#ef4444" };

/* ── Pure CSS Bar Chart ── */
const BarChartCSS = ({ data, dataKey, labelKey, color = "#6366f1", horizontal = false }) => {
  const max = Math.max(...data.map((d) => d[dataKey]), 1);
  if (horizontal) {
    return (
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-24 truncate text-right">{d[labelKey]}</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d[dataKey] / max) * 100}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-bold text-gray-700 w-8">{d[dataKey]}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2 h-44">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-gray-600">{d[dataKey]}</span>
          <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: "100%" }}>
            <div className="w-full rounded-t-lg transition-all duration-700" style={{ height: `${(d[dataKey] / max) * 100}%`, backgroundColor: color, marginTop: "auto" }} />
          </div>
          <span className="text-[10px] text-gray-500 truncate w-full text-center">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Pure CSS Line Chart ── */
const LineChartCSS = ({ data, dataKey, labelKey }) => {
  const max = Math.max(...data.map((d) => d[dataKey]), 1);
  const h = 160;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1 || 1)) * 100,
    y: 100 - (d[dataKey] / max) * 100,
    val: d[dataKey],
    label: d[labelKey],
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${points[points.length - 1]?.x || 0} 100 L ${points[0]?.x || 0} 100 Z`;

  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#6366f1" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-gray-400">{d[labelKey]}</span>
        ))}
      </div>
    </div>
  );
};

/* ── Pure CSS Donut Chart ── */
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  const segments = data.map((d) => {
    const pct = (d.value / total) * 100;
    const seg = { ...d, pct, offset };
    offset += pct;
    return seg;
  });
  const colors = ["#34d399", "#fbbf24", "#f97316", "#ef4444"];

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {segments.map((s, i) => (
            <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={colors[i % colors.length]}
              strokeWidth="5" strokeDasharray={`${s.pct} ${100 - s.pct}`} strokeDashoffset={-s.offset}
              className="transition-all duration-700" />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{total}</span>
          <span className="text-[10px] text-gray-400">Total</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-xs text-gray-600 capitalize">{s.name}</span>
            <span className="text-xs font-bold text-gray-800 ml-auto">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════ MAIN COMPONENT ══════════════════════ */

function Adminpage() {
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("emailId");
    navigate("/?login");
  };

  const getDoctors = async () => {
    if (activeTab === "ai") return;
    try {
      setLoading(true);
      const res = await axios.get(`${API}/${activeTab}-doctors`, { headers });
      setDoctors(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/?login");
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAIInsights = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      const res = await axios.get(`${API}/getInsights`, { headers });
      if (res.data.message === "AI parsing failed") setAiError("AI returned invalid data. Try again.");
      else setAiData(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/?login");
      else setAiError("Failed to fetch insights.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ai") { if (!aiData) getAIInsights(); }
    else getDoctors();
  }, [activeTab]);

  const approveDoctor = async (id) => { await axios.put(`${API}/approve/${id}`, {}, { headers }); getDoctors(); };
  const rejectDoctor = async (id) => { await axios.delete(`${API}/reject/${id}`, { headers }); getDoctors(); };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {sidebar && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebar(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between p-5">
          <h2 className="text-lg font-bold text-blue-600 flex items-center gap-2"><ShieldCheck size={22} /> Admin Panel</h2>
          <button onClick={() => setSidebar(false)} className="lg:hidden"><X size={20} /></button>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === t.id
                  ? t.id === "ai" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <button onClick={handleSignout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebar(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu size={22} /></button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{activeTab === "ai" ? "AI Health Insights" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Providers`}</h1>
          {activeTab === "ai" ? (
            <button onClick={getAIInsights} disabled={aiLoading}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition">
              <RefreshCw size={16} className={aiLoading ? "animate-spin" : ""} /> Refresh
            </button>
          ) : (
            <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600">{doctors.length}</span>
          )}
        </header>

        <div className="p-4 sm:p-8">

          {/* ═══ AI INSIGHTS ═══ */}
          {activeTab === "ai" ? (
            aiLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 size={40} className="animate-spin text-indigo-500" />
                <p className="text-gray-500 text-sm">Analyzing health records with AI...</p>
              </div>
            ) : aiError ? (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{aiError}</p>
                <button onClick={getAIInsights} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">Try Again</button>
              </div>
            ) : aiData ? (
              <div className="space-y-6">

                {/* Summary */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3"><BrainCircuit size={24} /><h2 className="text-lg font-bold">AI Health Summary</h2></div>
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-3xl">{aiData.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{aiData.totalCases || "—"} Total Cases</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{aiData.highRiskAreas?.length || 0} Risk Zones</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{aiData.alerts?.length || 0} Alerts</span>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {aiData.alerts?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Alerts</h3>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {aiData.alerts.map((a, i) => (
                        <div key={i} className={`rounded-xl p-4 border-l-4 ${
                          a.severity === "high" ? "bg-red-50 border-red-500" : a.severity === "medium" ? "bg-amber-50 border-amber-500" : "bg-emerald-50 border-emerald-500"
                        }`}>
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={18} className={a.severity === "high" ? "text-red-500" : a.severity === "medium" ? "text-amber-500" : "text-emerald-500"} />
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{a.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{a.description}</p>
                              <span className={`inline-block mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                a.severity === "high" ? "bg-red-200 text-red-700" : a.severity === "medium" ? "bg-amber-200 text-amber-700" : "bg-emerald-200 text-emerald-700"
                              }`}>{a.severity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Charts Row 1 */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-indigo-500" /><h3 className="font-bold text-gray-800">Disease Trend</h3></div>
                    {aiData.trend?.length > 0 ? <LineChartCSS data={aiData.trend} dataKey="cases" labelKey="day" /> : <p className="text-sm text-gray-400 text-center py-8">No trend data</p>}
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4"><Activity size={18} className="text-orange-500" /><h3 className="font-bold text-gray-800">Severity Breakdown</h3></div>
                    {aiData.severityStats?.length > 0 ? <DonutChart data={aiData.severityStats} /> : <p className="text-sm text-gray-400 text-center py-8">No severity data</p>}
                  </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4"><MapPin size={18} className="text-blue-500" /><h3 className="font-bold text-gray-800">Cases by Location</h3></div>
                    {aiData.locationData?.length > 0 ? <BarChartCSS data={aiData.locationData} dataKey="cases" labelKey="location" horizontal color="#6366f1" /> : <p className="text-sm text-gray-400 text-center py-8">No location data</p>}
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4"><Users size={18} className="text-teal-500" /><h3 className="font-bold text-gray-800">Age Distribution</h3></div>
                    {aiData.ageGroupStats?.length > 0 ? <BarChartCSS data={aiData.ageGroupStats} dataKey="cases" labelKey="group" color="#14b8a6" /> : <p className="text-sm text-gray-400 text-center py-8">No age data</p>}
                  </div>
                </div>

                {/* High Risk + Top Diagnoses */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4"><MapPin size={18} className="text-red-500" /><h3 className="font-bold text-gray-800">High Risk Areas</h3></div>
                    <div className="space-y-3">
                      {(aiData.highRiskAreas || []).map((area, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                            area.riskLevel === "high" ? "bg-red-500" : area.riskLevel === "medium" ? "bg-amber-500" : "bg-emerald-500"
                          }`}>{area.cases}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{area.location}</p>
                            <p className="text-xs text-gray-500">{area.topDiagnosis}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                            area.riskLevel === "high" ? "bg-red-100 text-red-600" : area.riskLevel === "medium" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                          }`}>{area.riskLevel}</span>
                        </div>
                      ))}
                      {(!aiData.highRiskAreas || aiData.highRiskAreas.length === 0) && <p className="text-sm text-gray-400 text-center py-4">No risk areas</p>}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4"><BarChart3 size={18} className="text-purple-500" /><h3 className="font-bold text-gray-800">Top Diagnoses</h3></div>
                    <div className="space-y-3">
                      {(aiData.topDiagnoses || []).map((d, i) => {
                        const maxC = Math.max(...(aiData.topDiagnoses || []).map((x) => x.count), 1);
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{d.name}</span>
                              <span className="text-xs font-bold text-gray-500">{d.count}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${(d.count / maxC) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                      {(!aiData.topDiagnoses || aiData.topDiagnoses.length === 0) && <p className="text-sm text-gray-400 text-center py-4">No data</p>}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {aiData.recommendations?.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                    <div className="flex items-center gap-2 mb-4"><Lightbulb size={18} className="text-amber-600" /><h3 className="font-bold text-gray-800">AI Recommendations</h3></div>
                    <div className="space-y-2">
                      {aiData.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-3">
                          <ChevronRight size={16} className="text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null

          ) : (
            /* ═══ DOCTOR TABS ═══ */
            <>
              {loading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white border border-gray-200 animate-pulse" />)}
                </div>
              ) : doctors.length === 0 ? (
                <p className="text-center text-gray-400 py-20">No {activeTab} doctors found.</p>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {doctors.map((doc) => (
                    <div key={doc._id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {doc.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-semibold text-gray-800 truncate">{doc.name}</h2>
                          <p className="text-xs text-gray-400 truncate">{doc.email}</p>
                        </div>
                      </div>
                      {doc.phone && <p className="text-sm text-gray-500 mb-3">{doc.phone}</p>}
                      {activeTab === "pending" && (
                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                          <button onClick={() => approveDoctor(doc._id)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">Approve</button>
                          <button onClick={() => rejectDoctor(doc._id)} className="flex-1 py-2 border-2 border-red-200 hover:bg-red-50 text-red-500 text-sm font-semibold rounded-xl transition">Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Adminpage;