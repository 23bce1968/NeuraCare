import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  BrainCircuit,
} from "lucide-react";

function Adminpage() {
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* 🔥 Fetch doctors based on tab */
  const getDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = "";

      if (activeTab === "pending")
        url = "http://localhost:8000/admin/pending-doctors";
      else if (activeTab === "approved")
        url = "http://localhost:8000/admin/approved-doctors";
      else url = "http://localhost:8000/admin/rejected-doctors";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors(res.data);
    } catch (err) {
      navigate("/?login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, [activeTab]);

  /* 🔥 Approve */
  const approveDoctor = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:8000/admin/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getDoctors();
  };

  /* 🔥 Reject */
  const rejectDoctor = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:8000/admin/reject/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getDoctors();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      
      {/* 🌊 Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-blue-100 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-blue-600 mb-8 flex items-center gap-2">
          <ShieldCheck /> Admin
        </h2>

        <nav className="space-y-3">
          {[
            { id: "pending", label: "Pending Doctors", icon: Clock },
            { id: "approved", label: "Approved", icon: CheckCircle },
            { id: "rejected", label: "Rejected", icon: XCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeTab === item.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          {/* ⭐ AI Insights Button */}
          <button
            onClick={() => navigate("/admin/ai-insights")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-indigo-600 hover:bg-indigo-50 transition"
          >
            <BrainCircuit size={18} />
            AI Insights
          </button>
        </nav>
      </div>

      {/* 🌊 Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-700 mb-6 capitalize">
          {activeTab} Healthcare Providers
        </h1>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-white animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && doctors.length === 0 && (
          <p className="text-gray-500">No doctors found</p>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition"
            >
              <h2 className="font-semibold text-lg">{doc.name}</h2>
              <p className="text-sm text-gray-500">{doc.email}</p>
              <p className="text-sm text-gray-500">{doc.phone}</p>

              {activeTab === "pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => approveDoctor(doc._id)}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectDoctor(doc._id)}
                    className="flex-1 py-2 border border-red-400 text-red-500 rounded-xl"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Adminpage;