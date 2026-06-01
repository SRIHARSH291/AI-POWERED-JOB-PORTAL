import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import UserDashboard from "../User/UserDashboard";
import RecruiterDashboard from "../Recruiter/RecruiterDashboard";
import AdminDashboard from "../Admin/AdminDashboard";

function DashboardRouter() {

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const storedRole = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedRole && storedRole !== "undefined") {
      setRole(storedRole);
      setLoading(false);
      return;
    }

    API.get("/auth/profile/")
      .then(res => {
        const userRole = res.data.user_type;
        setRole(userRole);
        localStorage.setItem("role", userRole);
      })
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // ✅ LOADING UI
  if (loading) {
    return <p className="text-white p-6">Loading dashboard...</p>;
  }

  // ❌ Safety fallback
  if (!role) {
    return <p className="text-white p-6">Unauthorized</p>;
  }

  // ✅ ROLE BASED ROUTING
  if (role === "job_seeker") return <UserDashboard />;
  if (role === "recruiter") return <RecruiterDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return <p className="text-white p-6">Invalid role</p>;
  
}



export default DashboardRouter;