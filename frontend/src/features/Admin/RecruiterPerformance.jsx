import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

function RecruiterPerformance() {
  const [data, setData] = useState({
    leaderboard: [],
    chart: []
  });

  useEffect(() => {
    API.get("/admin/recruiters-performance/")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🧠 AI SCORE CALCULATION
  const getScore = (jobs, apps) => {
    if (jobs === 0) return 0;
    return Math.min(100, Math.round((apps / jobs) * 10));
  };

  return (
    <MainLayout>
      <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

        {/* TITLE */}
        <h2 className="text-4xl sm:text-3xl md:text-4xl text-center mx-auto w-full max-w-[800px] text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:scale-105 hover:bg-[#0000003b] transition-all duration-300 font-bold mt-5 mb-10">
          🏆 RECRUITER PERFOMANCE DASHBOARD 🏆
        </h2>

        {/* LEADERBOARD */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {(data?.leaderboard || []).map((r, i) => {

            const medals = ["🥇", "🥈", "🥉"];
            const score = getScore(r.jobs_posted, r.applications);

            return (
              <div
                key={i}
                className={`p-5 rounded-xl border-2 transition hover:scale-105 
                ${i === 0 ? "border-yellow-400 shadow-yellow-400/40 shadow-lg" :
                  i === 1 ? "border-gray-300 shadow-gray-300/40 shadow-lg" :
                  i === 2 ? "border-orange-400 shadow-orange-400/40 shadow-lg" :
                  "border-cyan-400"}
                bg-black/40`}
              >

                <div className="flex items-center justify-between">
                  
                  {data.leaderboard.length === 0 && (
                    <p className="text-center text-gray-400 mt-10">
                      No recruiter data available 🚫
                    </p>
                  )}

                  {/* 👤 USER */}
                  <div className="flex items-center gap-4">
                    
                    <img
                      src={r.profile_picture || "https://via.placeholder.com/80"}
                      className="w-20 h-20 mx-auto mb-3 rounded-full drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
                      alt=""
                    />  

                    <div className="text-left">
                      <p className="text-lg text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold mb-2">
                        {medals[i] || "⭐"} {r.first_name} {r.last_name}
                      </p>

                      <p className="text-sm text-gray-400">
                        User ID: @{r.username}
                      </p>

                      <p className="text-sm text-gray-300">
                        Jobs: {r.jobs_posted}
                      </p>

                      <p className="text-sm text-gray-300">
                        Applications: {r.applications}
                      </p>
                    </div>
                  </div>

                  {/* SCORE */}
                  <div className="text-center">
                    <p className="text-xl drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-cyan-400 font-bold mb-2">
                       {r.company_name}
                    </p>

                    <p className="text-xs text-gray-400">Score</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {score}
                    </p>
                  </div>

                </div>

                {/* PROGRESS BAR */}
                <div className="mt-4 h-2 bg-gray-700 rounded">
                  <div
                    className="h-2 bg-cyan-400 rounded"
                    style={{ width: `${score}%` }}
                  />
                </div>

              </div>
            );
          })}
        </div>

        {/* GRAPH SECTION */}
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
          Hiring Performance Overview
        </h2>

        <div className="bg-black/40 p-6 rounded-xl border border-cyan-400 shadow-lg">

            {data.chart?.length === 0 ? (
              <p className="text-center text-gray-400">No performance data</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.chart} margin={{ left: 20, right: 20 }}>
                  <XAxis 
                      dataKey="name" 
                      interval={0}
                      tick={{ fontSize: 12}}
                  />
                  
                  <YAxis domain={[0, 51]} ticks={[0,5,10,15,20,25,30,35,40,45,50]} />
                  
                  <Tooltip />
                  <Bar dataKey="applications" 
                  fill="#00ddffbf" 
                  radius={[0,100,0,0]} 
                  animationDuration={5555}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

        </div>

      </div>
    </MainLayout>
  );
}

export default RecruiterPerformance;