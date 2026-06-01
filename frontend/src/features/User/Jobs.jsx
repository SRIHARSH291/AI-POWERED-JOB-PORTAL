import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../../components/layout/MainLayout";
import { useLocation } from "react-router-dom";
import { CompanyLogos } from "../../utils/CompanyLogos";
import toast from "react-hot-toast";

function Jobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [scores, setScores] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  
  const [job, setJob] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_name, setcompany_name] = useState("");
  const [skill, setSkill] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [defaultResume, setDefaultResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const locationHook = useLocation();
  const navigate = useNavigate();

  // ✅ FETCH JOBS (NO CHANGE)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs/");
        setJobs(res.data.results || res.data || []);
      } catch (error) {
        if (error.response?.status === 401) {
        toast.error("Please Login First 🔐");         
        window.location.href = "/login";
        } else {
          toast.error("Failed to Load Jobs ❌");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
  (query ? job.title?.toLowerCase().includes(query.toLowerCase()) : true) &&
  (location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true) &&
  (company_name ? (job.company_name || job.company || "").toLowerCase().includes(company_name.toLowerCase()) : true) &&
  (skill ? (job.skills || "").toLowerCase().includes(skill.toLowerCase()) : true) &&
  (type ? job.job_type === type : true)
);

  // DEFAULT RESUME
  useEffect(() => {
    API.get("/profile/resume/")
      .then(res => setDefaultResume(res.data.resume))
      .catch(() => {});
  }, []);

  // MULTIPLE RESUMES
  useEffect(() => {
    API.get("/resumes/")
      .then(res => setResumes(res.data))
      .catch(() => {});
  }, []);

  // APPLY
  const applyToJob = async (jobId) => {
    if (appliedJobs.includes(jobId)) return toast("Already Applied ⚠");

    const resumeToUse = resumeFile || selectedResume || defaultResume;
    if (!resumeToUse) return toast("Upload/Select Resume");

    try {
      const formData = new FormData();
      formData.append("job", jobId);
      formData.append("resume", resumeFile || resumeToUse);

      await API.post("/applications/", formData);
      setAppliedJobs(prev => [...prev, jobId]);

      toast.success("Applied Successfully 🚀");
    } catch {
      toast.error("Failed To Apply")
    }
  };

  // FETCH APPLIED
  useEffect(() => {
    API.get("/applications/")
      .then(res => setAppliedJobs(res.data.map(a => a.job)))
      .catch(() => {});
  }, []);

  // QUICK APPLY
  const quickApply = async (jobId) => {
    if (appliedJobs.includes(jobId)) return toast("Already Applied ⚠");

    try {
      setLoadingId(jobId);
      await API.post("/applications/quick-apply/", { job: jobId });
      setAppliedJobs(prev => [...prev, jobId]);
      toast("Applied Instantly ⚡");
    } catch {
      toast("Quick Apply Failed");
    } finally {
      setLoadingId(null);
    }
  };

  // AI SCORE
  const getAIScore = async (jobId) => {
    try {
      const res = await API.post("/ai/match-score/", { job_id: jobId });
      setScores(prev => ({ ...prev, [jobId]: res.data.score }));
    } catch {
      toast.error("AI Failed 🤖");
    }
  };

  // SAVED JOBS
  useEffect(() => {
    API.get("/saved-jobs/")
      .then(res => setSavedJobs(res.data.map(j => j.id)))
      .catch(() => {});
  }, []);

  const toggleSaveJob = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/save_job/`);
      setSavedJobs(prev =>
        prev.includes(jobId)
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId]
      );
    } catch {
      toast.error("Save Failed ❌");
    }
  };


  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const q = params.get("q");

    if (q) {
      setQuery(q);
      
      // 🔥 AUTO SEARCH CALL
      API.get("/job-search/", {
        params: { q }
      })
      .then(res => setJobs(res.data))
      .catch(() => {});
    }
  }, [locationHook.search]);


  // SEARCH API (KEEPED SAME)
  const searchJobs = async () => {
    try {
      const res = await API.get("/job-search/", {
        params: {
          q: query || "",
          location: location || "",
          skill: skill || "",
          company: company_name || "", 
        },
      });

      setJobs(res.data || []);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
      toast.error("Search Failed ❌");    
    }
  };

  useEffect(() => {
    searchJobs();
  }, [query, location, skill, type, company_name]);

  return (
<MainLayout>

  <div className="mb-8 mt-10 px-4">
  
  <div className="w-full mt-5 h-[1px] bg-white/20"></div>

        {/* 🔍 SEARCH UI (NO CHANGE) */}
        <div className="grid md:grid-cols-5 text-cyan-500 border-cyan-400 mt-6 gap-10 mb-6">
          <input
            placeholder="Search Job..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 border rounded-3xl bg-black text-cyan-500 hover:bg-[#363636] border-cyan-400 focus:outline-none focus:ring-0 focus:border-cyan-400"
          />

          <input
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded rounded-3xl bg-black text-cyan-500 hover:bg-[#363636] border-cyan-400"
          />
 
          <select 
          onChange={(e) => setType(e.target.value)} className="p-2 border rounded-3xl bg-black text-cyan-500 hover:bg-[#363636] border-cyan-400 focus:outline-none focus:ring-0">
            
            <option className="bg-black" value="Full Time">Full Time</option>
            <option className="bg-black" value="Part Time">Part Time</option>
            <option className="bg-black" value="Internship">Internship</option>
            <option className="bg-black" value="Contract">Contract</option>
          </select>

          <input 
          placeholder="Company..." 
          value={company_name}
          onChange={(e) => setcompany_name(e.target.value)} 
          className="p-2 border rounded-3xl bg-black text-cyan-500 hover:bg-[#363636] border-cyan-400 focus:outline-none focus:ring-0 focus:border-cyan-400" 
          />

          <input
            placeholder="Skills..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="p-2 border rounded rounded-3xl bg-black text-cyan-500 hover:bg-[#363636] border-cyan-400"
          />
        </div>

        <div className="mb-4 text-black font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-sm">
          🔍 <span className="text-green-500 font-bold">{filteredJobs.length}</span> Results For<span className="text-green-500 font-bold"> "{query || location || company_name || skill || "All"}"</span>
        </div>
    
    <div className="w-full mt-5 h-[1px] bg-white/20"></div>

        
      <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

      <div className="grid md:grid-cols-3 gap-6">
        <p></p>
        <h1 className="text-4xl items-center text-center w-80 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mb-5">JOBS</h1>
        <p></p>
      </div>

        {/* JOB LIST */}
        {filteredJobs.length === 0 ? (
          <div className="text-center mt-10 text-gray-400">
            ❌ No Jobs Found For Your Search
          </div>
        ) : (
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
        {filteredJobs.map((job) => {
        
          const companyLogo = CompanyLogos(job.company_name || job.company);
            
          return (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white/10 hover:drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000003b] p-1 rounded-lg border border-cyan-400/40 cursor-pointer flex flex-col items-center text-center gap-2 
           hover:scale-[1.02] transition"
            >

              <div className="flex justify-center mb-1">
              <img
                      src={companyLogo}
                      alt="logo"
                      className="w-16 h-16 bg-white rounded-full border border-cyan-400 object-contain"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${job.company_name || job.company}`;
                      }}
                    />
              </div>

              <h3 className="text-l sm:text-base font-bold break-words text-black">
                {job.title}
              </h3>

              <p className="text-gray-300 text-sm">
                🏢{job.company_name || job.company} | 📍{job.location}
              </p>

              <p className="text-xs text-cyan-400">
                💡 {job.skills}
              </p>

              <span className="text-green-400 text-xs">
                {job.job_type}
              </span>

              <p className="text-yellow-400 text-sm">
                💰 {job.salary}
              </p>
            </div>
          );
        })}
        </div>

      )}
      </div>
    </div>
    </MainLayout>
  );
}

export default Jobs;