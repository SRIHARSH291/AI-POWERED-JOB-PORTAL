import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import Tilt from "react-parallax-tilt";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();



  useEffect(() => {
    API.get("/admin/stats/")
      .then(res => setStats(res.data))
      .catch(() => window.location.href = "/login");
  }, []);

  return (
    <MainLayout>
      <div className="w-full mb-5 mt-5 p-6 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

      <h1 className="text-4xl sm:text-3xl md:text-4xl text-center mx-auto w-full max-w-[350px] text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:scale-105 hover:bg-[#0000003b] transition-all duration-300 font-bold mt-5 mb-10">
       🛠 ADMIN PANAL 🛠
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        
      <button onClick={() => navigate("/admin/users")}>
      <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
        <div 
        className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40">
          <h2>Total Users</h2>
          <p className="text-5xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">{stats.total_users || 0}</p>
        </div>
      </Tilt>
      </button>

      <button onClick={() => navigate("/admin/jobs")}>
      <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
        <div className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40">
          <h2>Total Jobs</h2>
          <p className="text-5xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">{stats.total_jobs || 0}</p>
        </div>
      </Tilt>
      </button>

      <button onClick={() => navigate("/admin/applications")}>
      <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.3}
                    scale={1.05}
                    transitionSpeed={2000}
                  >
        <div className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40">
          <h2>Total Applications</h2>
          <p className="text-5xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">{stats.applications || 0}</p>
        </div>
      </Tilt>
      </button>

      </div>
      
     {/* 🔥 CHART */}
      <div className="font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 shadow-lg px-6 py-4 justify-between items-center mt-10 rounded-2xl">
        <h2 className="text-2xl font-bold hover:scale-105 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">Platform Analytics</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.chart || []}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value"
                  fill="#00ddffbf"
                  radius={[0, 100, 0, 0]}
                  isAnimationActive
                  animationDuration={5555} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;