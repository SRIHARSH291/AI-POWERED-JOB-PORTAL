import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";
import jobIcon from "../../assets/Job-Tag.png";
import Resume from "../../assets/resume1.png";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";


// NEW UI COMPONENTS
import Loader from "../../components/ui/Loader";
import SkeletonCard from "../../components/ui/SkeletonCard";
import ErrorBox from "../../components/ui/ErrorBox";

function UserDashboard() {

  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
  });

  
  const [darkMode, setDarkMode] = useState(true);
  const [profileData, setProfileData] = useState({});                                           
  const [recommendations, setRecommendations] = useState([]);
  const safeRecommendations = Array.isArray(recommendations)
    ? recommendations
    : [];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});

  const fetched = useRef(false);
  
  useEffect(() => {

    if (fetched.current) return;

    fetched.current = true;

    const fetchData = async () => {

      try {

        const apps = await API.get("/applications/");
        const saved = await API.get("/saved-jobs/");
        const prof = await API.get("/profile/");

        let rec = { data: { results: [] } };
        
        try {

          rec = await API.get("/recommended/");

          console.log("FULL RECOMMENDATION RESPONSE:");
          console.log(rec);
          console.log(rec.data);
          console.log(Array.isArray(rec.data));
          console.log(rec.data.results);
          
          } catch (err) {

          console.log("Recommendation failed", err);

        }

        setStats({
          applied: (apps.data.results || apps.data || []).length,
          saved: (saved.data.results || saved.data || []).length,
        });

        setProfileData(prof.data.job_seeker_profile || {});

        console.log("FINAL RECOMMENDATIONS:", rec.data);

        console.log("RAW REC DATA:", rec.data);

        let finalRecommendations = [];

        if (Array.isArray(rec.data)) {

          finalRecommendations = rec.data;

        } else if (Array.isArray(rec.data.results)) {

          finalRecommendations = rec.data.results;

        } else if (Array.isArray(rec.data.data)) {

          finalRecommendations = rec.data.data;

        }

        console.log("FINAL RECOMMENDATIONS:", finalRecommendations);

        console.log("SETTING RECOMMENDATIONS:", finalRecommendations);

        console.log(
          "TYPE:",
          typeof finalRecommendations,
          Array.isArray(finalRecommendations),
          finalRecommendations
        );

        setRecommendations(finalRecommendations);

        setUser(prof.data);

      } catch (err) {

        console.log("Dashboard Error:", err);

        if (err.response?.status === 401) {

          localStorage.clear();

          window.location.href = "/login";

        } else {

          setError("Failed to load dashboard");
        }

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, []);

  const strength = Math.min(100, Math.floor(profileData.ai_score || 50 / 2 ));

  const matchedSkillsArr = (profileData.matched_skills || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const missingSkillsArr = (profileData.missing_skills || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {

    const res = await API.patch("/profile/", formData);

    setProfileData(res.data.job_seeker_profile || {});                                            
    setUser(res.data);

    alert("Resume uploaded successfully! ✅");

    } catch (err) {
      console.log(err);
      alert("Upload failed ❌");
    }
  };



  const getGreeting = () => {
      const hour = new Date().getHours();

      if (hour < 12) return "Good Morning ☀️";
      if (hour < 18) return "Good Afternoon 🌤";
      return "Good Evening 🌙";
    };


    const navigate = useNavigate();


  // ✅ GLOBAL LOADER
  if (loading) return <Loader />;

  const chartData =  [
      {
        name: "Matched",
        value: profileData.matched_skills
          ? profileData.matched_skills.split(",").length
          : 0,
      },
      {
        name: "Missing",
        value: profileData.missing_skills
          ? profileData.missing_skills.split(",").length
          : 0,
      },
    ];


    const getMatchLabel = (score) => {
                  if (score >= 75) return "🔥 High Match";
                  if (score >= 60) return "✅ Good Match";
                  if (score >= 40) return "⚠ Moderate Match";
                  return "❌ Low Match";
                };


  const COLORS = ["#00ff1e3e", "#ff000045"];

  const pieData = [
    {
      name: "Matched",
      value: profileData.matched_skills
        ? profileData.matched_skills.split(",").length
        : 0,
    },
    {
      name: "Missing",
      value: profileData.missing_skills
        ? profileData.missing_skills.split(",").length
        : 0,
    },
  ];


  return (
<MainLayout>
  <div className="w-full mb-5 mt-5 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">
 <div className="w-full mb-6 min-h-screen overflow-x-hidden px-4">

      <div className="items-center justify-between mt-16">

        {/* LEFT: GREETING */}
          <h1 className="text-xl drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-cyan-200 font-bold">
           {getGreeting()}
          </h1>
          
          <h1 className="text-xl text-cyan-200 drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold"> Welcome Back , {" "} <span className="hover:scale-110 drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-cyan-800/50 font-bold text-black">{user.username || "User"} </span> 👋
          </h1>
      </div>

      {/* PROGRESS */}
        <div>
          {/* TEXT */}
          <p className="text-center mt-6 text-l hover:scale-110 drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-cyan-800/50 font-bold text-black hover:text-cyan-400">
            PROFILE STRENGTH: {" "}
            <CountUp
            end={Number(profileData?.ai_score || 0)}
            duration={3}
          />%
          </p>

          {/* BAR BACKGROUND */}
          <div className="bg-white/20 h-4 mb-6 rounded-2xl drop-shadow-[0_0_5px_rgba(34,211,238,1)] overflow-hidden">
          
            {/* ANIMATED BAR */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Number(profileData?.ai_score || 0)}%` }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="h-full rounded-2xl 
                        bg-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all duration-700"
            />
          </div>
        </div>


      {/* ✅ ERROR UI */}
      {error && <ErrorBox message={error} />}

      {/* STATS */}
      <div className="grid md:grid-cols-3 mt-5 gap-9 text-center">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
          <button onClick={() => navigate("/applied-jobs")}>
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
            <div className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40">
              <h2>JOBS APPLIED</h2>
              <p className="text-5xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
                {stats.applied}
              </p>
            </div>
            </Tilt>
          </button>

          <button onClick={() => navigate("/saved")}>
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
            <div className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40">
              <h2>SAVED JOBS</h2>
              <p className="text-5xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
                {stats.saved}
              </p>
            </div>
            </Tilt>
          </button>
          
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
            <div className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40">
              <h2>PROFILE SCORE</h2>
              <p className="text-5xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
                <CountUp
                  end={Number(profileData?.ai_score || 0)}
                  duration={3}
                />%
              </p>
            </div>
            </Tilt>
          </>
        )}
      </div>

        {!profileData?.resume_url && (
          <p className="text-yellow-400 mt-2 text-center">
            ⚠ Upload resume to get AI insights
          </p>
        )}
        
      {/*QUICK ACTIONS*/}
      <div className="mt-10 grid md:grid-cols-3 gap-9">

        <button
          onClick={() => navigate("/jobs")}
          className="bg-white/5 font-bold text-lg hover:shadow-lg hover:scale-105 hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 rounded-2xl"
        >
        <div className="flex justify-center">
        <img
          src={jobIcon}
          alt="job"
          className="w-12 h-12 drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
        /> 
        </div>
          APPLY JOBS
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="bg-white/5 font-bold text-lg hover:shadow-lg hover:scale-105 hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 rounded-2xl"
        >
        <div className="flex justify-center">
          <img
            src={
              user.profile_picture_url ||
              `https://ui-avatars.com/api/?name=${user.username}`
            }
            alt="profile"
            className="w-12 h-12 rounded-full drop-shadow-[0_0_5px_rgba(34,211,238,1)] border-2 border-black"
          />
        </div>
            UPDATE PROFILE
        </button>


        <label className="bg-white/5 font-bold text-lg hover:shadow-lg hover:scale-105 hover:shadow-cyan-400/50 text-cyan-200 backdrop-blur-xl border border-black border-2 p-11 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 rounded-2xl">
        <div className="flex justify-center">
        <img
          src={Resume}
          alt="resume"
          className="w-12 h-12 drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
        /> 
          </div>
          UPLOAD RESUME
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
          className="hidden"
          />
        </label>
      </div>


      {/* AI INSIGHTS */}
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}

        className="font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 shadow-lg px-6 py-4 justify-between items-center mt-10 rounded-2xl"
        >
    

      
        {/* TITLE */}
        <h2 className="text-2xl font-bold text-cyan-500 text-center mb-6">
          💎 AI PROFILE INSIGHTS 💎
        </h2>

        {/* 🔥 SCORE GAUGE */}
          <div className="flex flex-col items-center mb-6">
            
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45"
                  stroke="#e3d7d7a2"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45"
                  stroke="#000000"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={
                    2 * Math.PI * 45 * (1 - (profileData?.ai_score || 0) / 100)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-cyan-400">
                {Math.min(100, Number(profileData?.ai_score || 0))}%
              </div>
            </div>

            <p className="mt-2 text-lg text-cyan-300">Profile Strength</p>
          </div>
          <p className="text-sm text-yellow-400 font-semibold">
            {profileData.ai_score >= 80
              ? "🔥 Excellent Profile"
              : profileData.ai_score >= 60
              ? "⚡ Good Profile"
              : "⚠ Needs Improvement"}
          </p>
          {/* SKILLS TEXT */}
          <div className="text-center space-y-2 mb-6">
            <p className="text-[#1aff00]">
              ✔ Strong Skills ({matchedSkillsArr.length}):{" "}
              {matchedSkillsArr.slice(0, 3).join(", ") || "None"}
            </p>

            <p className="text-[#ff0000]">
              ✖ Improve Skills ({missingSkillsArr.length}):{" "}
              {missingSkillsArr.slice(0, 3).join(", ") || "None"}
            </p>

            <p className="text-[#ffee00] font-semibold">
              💡 {
                  profileData.ai_feedback ||
                  (profileData.ai_score >= 80
                    ? "Your Profile is Strong. Start Applying to Premium Jobs"
                    : profileData.ai_score >= 60
                    ? "You're close! Improve Missing Skills to Boost Chances"
                    : "Focus on Skills & Resume to Increase Your Score")
                  }
            </p>
          </div>

          {/* 🔥 CHARTS SECTION */}
          <div className="mt-10 mb-10 grid md:grid-cols-2 gap-80">

            {/* BAR CHART */}
            <div className="h-[250px] bg-white/10 border border-cyan-400/60 rounded-xl">
              <ResponsiveContainer>
                <BarChart data={chartData} style={{ background: "transparent" }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />                  
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
                  dataKey="value"
                  fill="#00ddffbf"
                  radius={[0, 100, 0, 0]}
                  isAnimationActive
                  animationDuration={5555}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* PIE CHART */}
            <div className="h-[250px] bg-white/10 border border-cyan-400/60 rounded-xl flex items-center justify-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={80}
                    animationDuration={5555}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
            <p className="text-center text-2xl text-cyan-600 mt-5 mb-5">
              " AI Analyzed Your Resume and Found {" "} ['<span className="text-[#1aff00]" >{matchedSkillsArr.length}</span>'] Strong Skills and {" "} ['<span className="text-[#ff0000]">{missingSkillsArr.length}</span>'] Areas to Improve "
            </p>

          {/* 🔥 SKILL PROGRESS */}
          <div className="mt-20">
            <h3 className="text-cyan-300 font-bold text-xl mb-4 text-center">
             SKILL STRENGTH
            </h3>

            {matchedSkillsArr
            .filter(s => s.trim() !== "")
            .map((skill, index) => {

              // AI-based dynamic strength
              const base = profileData.ai_score || 50;

              // give variation per skill
              const variation = (index * 7) % 20;

              // higher if matched, lower if missing
              const isMissing = missingSkillsArr.includes(skill);

              const skillStrength = Math.min(
                100,
                isMissing
                  ? base - 20 - variation   // weaker skill
                  : base + variation        // stronger skill
              );

              return (
                <div key={index} className="mb-3">

                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.trim()}</span>
                    <span className="font-bold text-cyan-400">
                      {skillStrength}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 h-2 rounded">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skillStrength}%` }}
                      transition={{ duration: 1 }}
                      className="h-2 rounded bg-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)]"
                    />
                  </div>

                </div>
              );
          })}
          </div>

          {/* AI SUGGESTIONS */}
          <div className="mt-10">
            <h3 className="text-cyan-300 font-bold text-xl text-center mb-4">
             AI SUGGESTIONS
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              
              {[
                  // Skill-based suggestions (top 2 missing)
                  ...missingSkillsArr.slice(0, 2).map(skill => `Learn ${skill} to boost your profile`),

                  // Application behavior
                  stats.applied < 5 && "Apply to more Jobs to Increase Hiring Chances",
                  stats.applied > 20 && "Focus on Quality Applications Instead of Quantity",

                  // Resume intelligence
                  !profileData.resume_url && "Upload Resume for AI-powered Recommendations",
                  profileData.resume_url && "Update Resume Regularly to Stay Relevant",

                  // Profile strength
                  (profileData.ai_score || 0) < 50 && "Your Profile is Weak — Urgent Skill Improvement Needed",
                  (profileData.ai_score || 0) >= 50 && (profileData.ai_score || 0) < 80 && "You're close! Improve a Few Skills to Reach Top Tier",
                  (profileData.ai_score || 0) >= 80 && "Great profile! Start Targeting High-Paying Roles",

                  // Smart job targeting
                  recommendations.length === 0 && "No AI matches found — improve Resume keywords",
                  recommendations.length > 5 && "You Have Strong Matches — Apply Now Before Competition",

                  // Skill diversity
                  matchedSkillsArr.length < 3 && "Add More Skills to Increase Job Opportunities",

                ].filter(Boolean).slice(0, 6).map((tip, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 p-4 rounded-xl border border-cyan-400/20 
                  hover:shadow-cyan-400/40 hover:shadow-lg transition text-center"
                >
                  <p className="text-yellow-400">💡</p>
                  <p className="text-cyan-200 mt-2">{tip}</p>
                </motion.div>
              ))}

            </div>
          </div>


          {/* JOB MATCH PREVIEW */}
          <div className="mt-10">
            <h3 className="text-cyan-400 font-bold text-3xl text-center mb-2">
              JOB MATCH PREVIEW
            </h3>

            <p className="text-cyan-200 text-sm text-center mb-8">
              Based on Your Resume & Skills
            </p>

            <div className="space-y-6">
              {safeRecommendations
              .filter(job =>
                job &&
                job.title &&
                Number(job.match_score || 0) > 0
              )
              .slice(0, 5).map((job) => {
                const score = Number(job.match_score || 0);

                let barColor = "from-red-500 to-red-400";
                let badgeColor = "text-red-400";

                if (score >= 80) {
                  barColor = "from-green-400 to-green-500";
                  badgeColor = "text-green-400";
                } else if (score >= 60) {
                  barColor = "from-yellow-400 to-yellow-500";
                  badgeColor = "text-yellow-400";
                } else if (score >= 40) {
                  barColor = "from-cyan-400 to-blue-500";
                  badgeColor = "text-cyan-400";
                }

                return (
                  <div
                    key={job.id}
                    className="bg-gray-900/70 border border-cyan-500/20 rounded-xl p-4 shadow-lg"
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-bold text-lg">
                          {job.title}
                        </h4>
                        <p className="text-gray-400 text-left text-sm">
                          {job.company_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-400">
                          {score.toFixed(2)}%
                        </p>
                        <p className={`text-sm font-semibold ${badgeColor}`}>
                          {job.match_level}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-gray-500 drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-3 rounded-full bg-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)]`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    {/* Skills Summary */}
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <span className="text-green-400">
                        ✅ {job.matched_skills?.length || 0} Matching Skills
                      </span>

                      <span className="text-red-400">
                        ❌ {job.missing_skills?.length || 0} Missing Skills
                      </span>
                    </div>

                    {/* AI Suggestion */}
                    {job.suggestion && (
                      <p className="text-xs text-gray-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        💡 {job.suggestion}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
      </motion.div> 


      {/* RECOMMENDATIONS */}
      <div className="bg-white/5 font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50 text-cyan-400 backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 shadow-lg px-6 py-4 justify-between items-center mt-10 mb-7 rounded-2xl">
        <h1 className="text-2xl font-bold text-cyan-500 text-center mb-4">
        ✦ AI RECOMMENDED JOBS ✦
        </h1>

        <p className="text-xs text-cyan-200">
           《 Match Based On Your Resume 》
        </p>

        {safeRecommendations.length === 0 ? (
          <p className="text-cyan-300 text-center">
            No Recommendations Yet
          </p>
        ) : (
        safeRecommendations
        .filter(job =>
          job &&
          job.title &&
          Number(job.match_score) > 0
        )
        .map(job => (          
        <div
            onClick={() => {
                              if (!job.id) return alert("Invalid job ❌");
                              navigate(`/jobs/${job.id}`);
                            }}
              key={job.id || Math.random()}
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 border-b cursor-pointer py-2"
            >
              <div>
                <p className="text-cyan-300 text-left font-bold">{job.title}</p>
                <p className="text-sm text-left text-gray-400">
                  {job.company_name}
                </p>
              </div>

            <div>
              <span
                className={`font-bold text-left ${
                  job.match_score >= 75
                    ? "text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,1)]"
                    : job.match_score >= 60
                    ? "text-cyan-500 drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
                    : job.match_score >= 40
                    ? "text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,1)]"
                    : "text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,1)]"
                }`}
              >
                {
                  Number(job.match_score || 0) <= 1
                    ? (Number(job.match_score) * 100).toFixed(2)
                    : Number(job.match_score).toFixed(2)
                }%              
              </span>
            </div>

            <div>  
              <p className="text-xs text-right text-cyan-300">
                {job.reason || getMatchLabel(job.match_score)}
              </p>
            </div>
          </div>
          ))
        )}
      </div>
  </div>     
  </div>
</MainLayout>
  );
}

export default UserDashboard;