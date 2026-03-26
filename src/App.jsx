import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import DashboardPage from "./components/Dashboardpage";

function DashboardRoute() {
  // Read token from URL synchronously — before any render decision is made
  const params   = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");

  if (urlToken) {
    // Persist it and clean the URL immediately
    localStorage.setItem("token", urlToken);
    window.history.replaceState({}, document.title, "/dashboard");
  }

  const token = urlToken || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem("token")
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<Login />} />

        {/* Handles both /dashboard and /dashboard?token=JWT */}
        <Route path="/dashboard" element={<DashboardRoute />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}