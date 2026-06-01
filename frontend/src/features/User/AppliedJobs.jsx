import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { motion } from "framer-motion";
import Loader from "../../components/ui/Loader";
import Tilt from "react-parallax-tilt";
import ErrorBox from "../../components/ui/ErrorBox";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CompanyLogos } from "../../utils/CompanyLogos";


function AppliedJobs() {
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const company = useState("");
  const [jobsMap, setJobsMap] = useState({});
  const navigate = useNavigate();

  // Analytics
  const total = applications.length;
  const selected = applications.filter(a => a.status?.toLowerCase() === "shortlisted").length;
  const rejected = applications.filter(a => a.status?.toLowerCase() === "rejected").length;

  const responseRate = total ? Math.round(((selected + rejected) / total) * 100) : 0;
  const successRate = total ? Math.round((selected / total) * 100) : 0;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/");
        setApplications(res.data.results || res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load applied jobs");

        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs/");
        
        // convert array → map {id: job}
        const map = {};
        (res.data.results || res.data).forEach(job => {
          map[job.id] = job;
        });

        setJobsMap(map);
      } catch (err) {
        console.log("Jobs fetch failed");
      }
    };

    fetchJobs();
  }, []);

  const steps = ["applied", "reviewed", "shortlisted", "interview", "offer", "hired"];
  const getStepIndex = (status) => {
    if (status === "rejected") return 1; // stop early
    return steps.indexOf(status?.toLowerCase());
  };

  // 🔍 Filter
  const filteredApps = applications.filter(app =>
    filter === "All"
      ? true
      : app.status?.toLowerCase() === filter.toLowerCase()
  );


  // ❌ Withdraw
  const handleWithdraw = (id) => {

    const confirmToast = toast((t) => (
      <div className="text-center">

        <p className="font-bold mb-2 text-black">
          Withdraw this Application?
        </p>

        <div className="flex justify-center gap-3">

          {/* YES */}
          <button
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                await API.delete(`/applications/${id}/`);

                setApplications(prev =>
                  prev.filter(app => app.id !== id)
                );

                toast.success("Application Withdrawn ❌");
              } catch (err) {
                console.log(err);
                toast.error("Failed to Withdraw ❌");
              }
            }}
            className="px-3 py-1 text-sm font-bold bg-[#0000003b] text-red-500 border-black border-2 hover:bg-red-500 hover:text-black rounded"
          >
            Yes
          </button>

          {/* NO */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast("Cancelled", { icon: "👍" });
            }}
            className="px-3 py-1 text-sm font-bold bg-[#0000003b] text-green-500 border-black border-2 hover:bg-green-500 hover:text-black rounded"
          >
            No
          </button>

        </div>

      </div>
    ), {
      duration: 5000,
    });
  };

  if (loading) return <Loader />;

  return (  
    <MainLayout>
      <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4">
    <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">  

          {/* ✅ TITLE */}
      <div className="grid md:grid-cols-3 gap-6">
          <p></p>
          <h1 className="text-4xl items-center w-80 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mb-6 text-center">
          APPLIED JOBS
          </h1>
          <p></p>
      </div>


          {/* ✅ ANALYTICS */}
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-center">

            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
            <div className="bg-white/5 p-4 border border-cyan-400/40">
              <p className="text-cyan-400 text-sm">Total Jobs Applied</p>
              <p className="text-2xl font-bold hover:scale-125 hover:text-cyan-400 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold">{total}</p>
            </div>
            </Tilt>   

            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
            <div className="bg-white/5 p-4 border border-cyan-400/40">
              <p className="text-cyan-400 text-sm">Response Rate</p>
              <p className="text-2xl font-bold hover:scale-125 text-black drop-shadow-[0_0_5px_rgba(168,85,247,1)] hover:text-purple-500">{responseRate}%</p>
            </div>
            </Tilt>

            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.3}
              scale={1.05}
              transitionSpeed={2000}
            >
            <div className="bg-white/5 p-4 border border-cyan-400/40">
              <p className="text-cyan-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold hover:scale-125 text-black drop-shadow-[0_0_5px_rgba(34,197,94,1)] hover:text-green-400">{successRate}%</p>
            </div>
            </Tilt>
          </div>

          {/* ✅ FILTERS */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {["All", "Applied", "Shortlisted", "Interview", "Offer", "Hired", "Rejected", "Pending"].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1 font-bold rounded-full border text-sm transition
                  ${filter === tab
                    ? "bg-[#0000003b] border-cyan-400 text-cyan-400"
                    : "hover:text-black border-cyan-400/30 hover:bg-cyan-400"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && <ErrorBox message={error} />}
      

        
          {/* ✅ EMPTY STATE */}
          {filteredApps.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-gray-400 text-lg">
                Apply to jobs to track them here
              </p>
              <button
                onClick={() => navigate("/jobs")}
                className="mt-4 px-4 py-2 hover:bg-cyan-400/20 border border-cyan-400/40 bg-black/20 rounded"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            
            
            <div className="mt-6 grid md:grid-cols-3 gap-4">
            {filteredApps.map((app, index) => {

            const jobId = app.job?.id || app.job;
            const jobData = app.job?.title 
            ? app.job 
            : jobsMap[jobId];

            const companyLogo = CompanyLogos(jobData?.company_name);

            return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white/10 hover:shadow-[0_0_5px_rgba(34,211,238,1)] 
                            hover:bg-[#0000003b] p-3 rounded-lg border border-cyan-400/40 
                            cursor-pointer flex flex-col items-center text-center gap-2 
                            hover:scale-[1.02] transition"
                >

                  {/* LOGO */}
                  <div className="flex justify-center">
                    <img
                      src={companyLogo}
                      alt="logo"
                      className="w-16 h-16 bg-white rounded-full border border-cyan-400 object-contain"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${companyLogo}`;
                      }}
                    />
                  </div>

                  {/* TITLE */}
                  <h2 className="text-sm sm:text-base font-bold text-cyan-400 break-words">
                    {jobData?.title || "Job"}
                  </h2>

                  {/* COMPANY */}
                  <p className="text-white text-sm break-words">
                    🏢 {jobData?.company_name || "Company"} | 📍 {jobData?.location}
                  </p>

                  <p className="text-xs text-gray-400">
                    Applied on: {new Date(app.applied_at).toLocaleDateString()}
                  </p>

                  {/* STATUS */}
                  <span className={`text-xs px-2 py-1 rounded-full font-bold
                    ${app.status?.toLowerCase() === "applied" && "bg-blue-500 text-black"}
                    ${app.status?.toLowerCase() === "reviewed" && "bg-yellow-500 text-black"}
                    ${app.status?.toLowerCase() === "shortlisted" && "bg-orange-500 text-black"}
                    ${app.status?.toLowerCase() === "interview" && "bg-purple-500 text-black"}
                    ${app.status?.toLowerCase() === "offer" && "bg-pink-500 text-black"}
                    ${app.status?.toLowerCase() === "hired" && "bg-green-500 text-black"}
                    ${app.status?.toLowerCase() === "rejected" && "bg-red-500 text-black"}
                  `}>
                    {app.status
                      ? app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()
                      : ""}
                  </span>
                  
                  {/* 🔥 ANIMATED PROGRESS BAR */}
                  <div className="mt-3 w-full">

                    {/* BAR */}
                    <div className="flex gap-1">
                      {steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          className={`h-2 w-full rounded 
                            ${app.status === "rejected"
                              ? "bg-red-400 shadow-[0_0_5px_rgba(239,68,68,1)]"
                              : i <= getStepIndex(app.status)
                                ? "bg-green-400 shadow-[0_0_5px_rgba(34,197,94,1)]"
                                : "bg-gray-700"
                            }`}
                        />
                      ))}
                    </div>

                    {/* LABELS */}
                    <div className="flex gap-1 text-[10px] mt-1 text-red-500">
                      {steps.map((step, i) => (
                        <div key={i} className="w-full text-center">
                          <span
                            className={`capitalize 
                              ${i <= getStepIndex(app.status) ? "text-green-400" : ""}
                            `}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (!jobId) return alert("Invalid job ❌");
                        navigate(`/jobs/${jobId}`);
                      }}
                      className="px-3 py-1 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-green-500 hover:text-black rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        if (!app?.id || !app?.job) {
                          alert("Invalid data ❌");
                          return;
                        }
                        navigate(`/chat/${app.id}/${app.recruiter_id}`);
                      }}
                      className="px-3 py-1 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-blue-500 hover:text-black rounded"
                    >
                      Chat
                    </button>

                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="px-3 py-1 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-red-500 hover:text-black rounded"
                    >
                      Withdraw
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
         )}
    </div>
    </div>
  </MainLayout>
  );
}

export default AppliedJobs;