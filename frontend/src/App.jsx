import { useState } from "react";
import LandingPage from "./components/LandingPage";
import SignupRoleModal from "./components/SignupRoleModal";
import LoginPage from "./components/LoginPage";
import MigrantWorkerSignup from "./components/MigrantWorkerSignup";
import HealthcareProviderSignup from "./components/HealthcareProviderSignup";
import WorkerProfileGuard from "./components/WorkerProfileGuard";
import WorkerProfileForm from "./components/WorkerProfileForm";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WorkerDashboard from "./pages/WorkerDashboard";
import Adminpage from "./pages/Adminpage";
import Doctorpage from "./pages/Doctorpage";

function App() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeSignupRole, setActiveSignupRole] = useState(null);

  const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoginOpen(false);

      if (role === "worker") {
        return (
          <WorkerProfileGuard>
            <WorkerDashboard />
          </WorkerProfileGuard>
        );
      } else if (role === "doctor") {
        return <Doctorpage />;
      } else if (role === "admin") {
        return <Adminpage />;
      }
    } else {
      return <Navigate to="/?login" />;
    }
  };

  return (
    <BrowserRouter>
      {/* --- Modals Stay Outside Routes --- */}
      <SignupRoleModal
        open={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSelectRole={(role) => {
          setIsSignupOpen(false);
          setTimeout(() => setActiveSignupRole(role), 350);
        }}
      />

      {isLoginOpen && (
        <LoginPage
          onClose={() => setIsLoginOpen(false)}
          onSignupRedirect={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }}
        />
      )}

      {activeSignupRole === "worker" && (
        <MigrantWorkerSignup
          onClose={() => setActiveSignupRole(null)}
          onSignin={() => {
            setActiveSignupRole(null);
            setTimeout(() => setIsLoginOpen(true), 300);
          }}
        />
      )}

      {activeSignupRole === "doctor" && (
        <HealthcareProviderSignup
          onClose={() => setActiveSignupRole(null)}
          onSignin={() => {
            setActiveSignupRole(null);
            setTimeout(() => setIsLoginOpen(true), 300);
          }}
        />
      )}

      {/* --- Routes --- */}
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onSignupClick={() => {
                setIsSignupOpen(true);
                setIsLoginOpen(false);
              }}
              onLoginClick={() => {
                setIsLoginOpen(true);
                setIsSignupOpen(false);
              }}
              setIsLoginOpen={setIsLoginOpen}
            />
          }
        />
        <Route path="/page" element={<PrivateRoute />} />
        <Route path="/worker/complete-profile" element={<WorkerProfileForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;