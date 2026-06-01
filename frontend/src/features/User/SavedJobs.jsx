import { useEffect, useState } from "react";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { CompanyLogos } from "../../utils/CompanyLogos";

function SavedJobs() {

  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();
  const company = useState("");
  const [jobId] = useState("");

  useEffect(() => {
    API.get("/saved-jobs/")
      .then(res => setJobs(res.data))
      .catch(() => console.log("Error loading saved jobs"));
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(query.toLowerCase()) &&
    job.location?.toLowerCase().includes(location.toLowerCase()) &&
    job.skills?.toLowerCase().includes(skill.toLowerCase()) &&
    job.experience?.toLowerCase().includes(skill.toLowerCase()) &&
    (type ? job.job_type === type : true)
  );

  // SEARCH API (KEEPED SAME)
  const searchJobs = async () => {
    try {
      const res = await API.get("/job-search/", {
        params: {
          q: query || "",
          location: location || "",
          skill: skill || "",
        },
      });

      setJobs(res.data || []);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
      alert("Search failed");
    }
  };

  const toggleSaveJob = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/save_job/`);
      setSavedJobs(prev =>
        prev.includes(jobId)
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId]
      );
    } catch {
      alert("Save failed");
    }
  };

  return (
    <MainLayout>

    <div className="mb-8 mt-10 px-4">
  
     <div className="w-full mt-5 h-[1px] bg-white/20"></div>

        {/* 🔍 SEARCH UI (NO CHANGE) */}
        <div className="grid md:grid-cols-4 text-cyan-500 border-cyan-400 mt-6 gap-10 mb-6">
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

            <option className="bg-black">All Jobs</option>
            <option className="bg-black" value="Full Time">Full Time</option>
            <option className="bg-black" value="Part Time">Part Time</option>
            <option className="bg-black" value="Internship">Internship</option>
            <option className="bg-black" value="Contract">Contract</option>
          </select>

          <input
            placeholder="Skills..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="p-2 border rounded rounded-3xl bg-black text-cyan-500 hover:bg-[#363636] border-cyan-400"
          />
        </div>

    
    <div className="w-full mt-5 h-[1px] bg-white/20"></div>

      
      <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

      <div className="grid md:grid-cols-3 gap-6">
        <p></p>
        <h1 className="text-4xl items-center w-80 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mb-5">SAVED JOBS</h1>
        <p></p>
      </div>

        {/* JOB LIST */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {jobs.length === 0 ? (
                <p className="col-span-5 text-white text-xl font-bold text-center">
                   🚫  NO SAVED JOBS YET  🚫 
                </p>
            ) : (
            jobs.map(job => {

          // ✅ FIXED COMPANY (PER JOB)
          const companyLogo = CompanyLogos(job.company_name || job.company);
      
            return (
              <div
                key={job.id}
                onClick={() => {
                  if (!job.id) return alert("Invalid job ❌");
                  navigate(`/jobs/${job.id}`);
                }}
                className="bg-white/10 hover:drop-shadow-[0_0_5px_rgba(34,211,238,1)] 
                          hover:bg-[#0000003b] p-3 rounded-lg border border-cyan-400/40 
                          cursor-pointer flex flex-col items-center text-center gap-2 
                          hover:scale-[1.02] transition"
              >

                {/* ✅ LOGO */}
                <div className="flex justify-center">
                  <img
                      src={companyLogo}
                      alt="logo"
                      className="w-16 h-16 bg-white rounded-full border border-cyan-400 object-contain"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${job.company_name || job.company}`;
                      }}
                  />
                </div>

                <h3 className="text-sm sm:text-base font-bold break-words text-black">
                  {job.title}
                </h3>

                <p className="text-gray-300 text-sm break-words">
                  🏢 {job.company_name || job.company} | 📍 {job.location || ""}
                </p>

                <p className="text-xs text-cyan-400 break-words">
                  💡 {job.skills}
                </p>

                <p className="text-gray-400 text-xs">
                  Experience: {job.experience}
                </p>

                <span className="text-green-400 text-xs">
                  {job.job_type}
                </span>

                <p className="text-yellow-400 text-sm">
                  💰 {job.salary}
                </p>
              </div>
            );
          })
        )}
        </div>
      
      </div>
      </div> 
    </MainLayout>
  );
}

export default SavedJobs;