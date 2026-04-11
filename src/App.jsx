import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import DashboardPage from "./components/Dashboardpage";
import LandingPage from "./components/landingpage";
import GettingStartedPage from "./components/sdkpage"
function DashboardRoute() {
  // Handle OAuth callback params
  const params = new URLSearchParams(window.location.search);
  const accessToken  = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  const user         = params.get("user");

  if (accessToken)  localStorage.setItem("token", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  if (user) {
    try { localStorage.setItem("user", decodeURIComponent(user)); } catch {}
  }
  if (accessToken || refreshToken) {
    window.history.replaceState({}, document.title, "/dashboard");
  }

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return <DashboardPage />;
}

function LandingRoute() {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

function LoginRoute() {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Entry point — landing page (redirects to /dashboard if logged in) */}
        <Route path="/"          element={<LandingRoute />} />

        {/* Login — also redirects to /dashboard if already logged in */}
        <Route path="/login"     element={<LoginRoute />} />

        {/* Dashboard — redirects to / if not logged in */}
        <Route path="/dashboard" element={<DashboardRoute />} />

        {/* SDK docs */}
        <Route path="/sdk"       element={<GettingStartedPage />} />

        {/* Catch-all → landing */}
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}