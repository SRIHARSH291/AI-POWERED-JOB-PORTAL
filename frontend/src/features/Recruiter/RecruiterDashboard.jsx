import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import Applicant from "../../assets/Applicant.png";
import PostJob from "../../assets/PostJob.png";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const Card = ({ title, value }) => (
  <div className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40">
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="text-5xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">{value || 0}</p>
  </div>
);

function RecruiterDashboard() {
  
  const [data, setData] = useState({});
  const [chart, setChart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    API.get("/recruiter/dashboard/")
      .then(res => {
        setData(res.data);
        setChart(res.data.chart || []);
      });
  }, []);


  const getGreeting = () => {
      const hour = new Date().getHours();

      if (hour < 12) return "Good Morning ☀️";
      if (hour < 18) return "Good Afternoon 🌤";
      return "Good Evening 🌙";
    };

  const navigate = useNavigate();


  return (
    
    <MainLayout>
    <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">
      <div className="items-center justify-between">

        {/* GREETING */}
          <h1 className="text-xl drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-cyan-200 font-bold">
           {getGreeting()}
          </h1>
          
          <h1 className="text-xl text-cyan-200 drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold"> Welcome Back , {" "} <span className="hover:scale-110 drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-cyan-800/50 font-bold text-black">{user?.username || "User"} </span> 👋
          </h1>
      </div>


      {/* STATS CARDS */}
        <div className="grid md:grid-cols-3 mt-10 gap-6">
          
          <button onClick={() => navigate("/my-jobs")}>
            <Tilt
                  glareEnable={true}
                  glareMaxOpacity={0.3}
                  scale={1.05}
                  transitionSpeed={2000}
                >
                  <Card title="TOTAL JOBS POSTED" value={data.total_jobs_posted} />
                  
            </Tilt>
          </button>
        
            <Tilt
                  glareEnable={true}
                  glareMaxOpacity={0.3}
                  scale={1.05}
                  transitionSpeed={2000}
                >
                <Card title="SHORTLISTED CANDIDATES" value={data.shortlisted || 0} />
            </Tilt>


          <button onClick={() => navigate("/applicants")}>
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
              <Card title="TOTAL APPLICANTS" value={data.total_applications_received} />
            </Tilt>
          </button>
        </div>


        {/*QUICK ACTIONS*/}
        <div className="mt-10 grid md:grid-cols-3 gap-9">
          <button
              onClick={() => navigate("/applicants")}
              className="bg-white/5 font-bold text-lg hover:shadow-lg hover:scale-105 hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 rounded-2xl"
              >
                <div className="flex mb-2 justify-center">
                <img
                  src={Applicant}
                  alt="applicant"
                  className="w-12 h-12"
                /> 
                </div>
              MANAGE APPLICANTS
          </button>
        
          <button
              onClick={() => navigate("/profile")}
              className="bg-white/5 font-bold text-lg hover:shadow-lg hover:scale-105 hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 rounded-2xl"
          >
              <div className="flex mb-2 justify-center">
                <img
                  src={
                    user?.profile_picture_url
                      ? user.profile_picture_url
                      : `https://ui-avatars.com/api/?name=${user?.username || "User"}`
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full drop-shadow-[0_0_5px_rgba(34,211,238,1)] border-1 border-black"
                />
              </div>
              UPDATE PROFILE
          </button>
        
          <button 
          onClick={() => navigate("/post-job")}
          className="bg-white/5 font-bold text-lg hover:shadow-lg hover:scale-105 hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 rounded-2xl">
                <div className="flex mb-2 justify-center">
                <img
                  src={PostJob}
                  alt="postjob"
                  className="w-12 h-12 drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
                /> 
                  </div>
                POST MORE JOB
            </button> 
        </div>



      {/* GRAPH */}
        <h3 className="text-cyan-400 font-bold text-xl mt-10">APPLICATIONS OVERVIEW</h3>
    <div className="h-[350px] bg-white/10 border border-cyan-400/60 mt-2 mb-10 rounded-xl">
                  <ResponsiveContainer className={"mt-3 p-3"}>
                    <BarChart data={chart} style={{ background: "transparent" }}>
                    <XAxis dataKey="name" stroke="#00e1ffb4" />
                      <YAxis stroke="#00e1ffb4" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#00000037",
                          border: "1px solid #22d3ee",
                          color: "#000000",
                        }}
                      />
                      <Bar
                      dataKey="applications"
                      fill="#00ddffbf"
                      radius={[0, 100, 0, 0]}
                      isAnimationActive
                      animationDuration={5555}
                      />
                    </BarChart>
                  </ResponsiveContainer>
    </div>
                </div>
    </MainLayout>
  );
}

export default RecruiterDashboard;