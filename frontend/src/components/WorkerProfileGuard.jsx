import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function WorkerProfileGuard({ children }) {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.get("http://localhost:8000/worker/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Profile exists → allow dashboard
        setChecked(true);
      } catch (err) {
        if (err.response?.status === 404) {
          // No profile → redirect to form
          navigate("/worker/complete-profile");
        } else if (err.response?.status === 401) {
          navigate("/?login");
        }
      }
    };
    checkProfile();
  }, [navigate]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}

export default WorkerProfileGuard;