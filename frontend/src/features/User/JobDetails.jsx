import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "framer-motion";
import toast from "react-hot-toast";     
import { CompanyLogos } from "../../utils/CompanyLogos";
import { useNavigate } from "react-router-dom";


function JobDetails() {
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const company = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [scores, setScores] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [defaultResume, setDefaultResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedResume, setSelectedResume] = useState("");
  const noResume = !resumeFile && !selectedResume && !defaultResume;
  const [showRecruiter, setShowRecruiter] = useState(false);
  const finalResume = resumeFile || selectedResume || defaultResume; 
  
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_name, setcompany_name] = useState("");
  const [skill, setSkill] = useState("");
  const navigate = useNavigate();


  // FETCH JOB
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}/`);
        setJob(res.data);
      } catch {
        alert("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // OTHER FETCHES
  useEffect(() => {
    API.get("/profile/resume/")
      .then(res => setDefaultResume(res.data.resume))
      .catch(() => {});
  }, []);

  useEffect(() => {
    API.get("/resumes/")
      .then(res => setResumes(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    API.get("/applications/")
      .then(res => setAppliedJobs(res.data.map(a => a.job)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    API.get("/saved-jobs/")
      .then(res => setSavedJobs(res.data.map(j => j.id)))
      .catch(() => {});
  }, []);

  const contactRecruiter = async () => {
    await API.post("/jobs/contact/", {
      email: job.recruiter_email,
      message: "I'm Interested in This Job."
    });

    toast.success("Message Sent 🚀");
  };

  // APPLY
  const applyToJob = async (jobId) => {
    if (appliedJobs.includes(jobId)) {
      return toast.error("Already applied ⚠️");
    }

    const loadingToast = toast.loading("Applying...");

    try {
      const formData = new FormData();
      formData.append("job", jobId);

      // New uploaded file
      if (resumeFile instanceof File) {
        formData.append("resume", resumeFile);
      }
      // Existing saved resume URL
      else if (selectedResume) {
        formData.append("resume_url", selectedResume);
      }
      // Default resume URL
      else if (defaultResume) {
        formData.append("resume_url", defaultResume);
      }
      // No resume available
      else {
        toast.dismiss(loadingToast);
        return toast.error("Upload or Select Resume 📄");
      }

      await API.post("/applications/", formData);

      setAppliedJobs((prev) => [...prev, jobId]);

      toast.dismiss(loadingToast);
      toast.success("Application Submitted ✅");
    } catch (err) {
      console.log("APPLY ERROR:", err.response?.data || err);

      toast.dismiss(loadingToast);
      toast.error(
        err.response?.data?.error ||
        "Apply Failed ❌"
      );
    }
  };


  const filteredJobs = jobs.filter((job) =>
    (query ? job.title?.toLowerCase().includes(query.toLowerCase()) : true) &&
    (location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true) &&
    (company_name ? (job.company_name || job.company || "").toLowerCase().includes(company_name.toLowerCase()) : true) &&
    (skill ? (job.skills || "").toLowerCase().includes(skill.toLowerCase()) : true) &&
    (type ? job.job_type === type : true)
  );
  
  // QUICK APPLY
  const quickApply = async (jobId) => {
    if (appliedJobs.includes(jobId)) {
      return toast.error("Already applied ⚠️");
    }

    setLoadingId(jobId);
    const loadingToast = toast.loading("Quick applying ⚡...");

    try {
      const formData = new FormData();
      formData.append("job", jobId);

      if (resumeFile instanceof File) {
        formData.append("resume", resumeFile);
      } else if (selectedResume) {
        formData.append("resume_url", selectedResume);
      } else if (defaultResume) {
        formData.append("resume_url", defaultResume);
      } else {
        toast.dismiss(loadingToast);
        setLoadingId(null);
        return toast.error("Upload or Select Resume 📄");
      }

      await API.post("/applications/", formData);

      setAppliedJobs((prev) => [...prev, jobId]);

      toast.dismiss(loadingToast);
      toast.success("Applied Instantly ⚡");
    } catch (err) {
      console.log("QUICK APPLY ERROR:", err.response?.data || err);

      toast.dismiss(loadingToast);
      toast.error(
        err.response?.data?.error ||
        "Quick Apply Failed ❌"
      );
    } finally {
      setLoadingId(null);
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

  // LOADING
  if (loading) {
    return (
      <MainLayout>
        <p className="text-center text-cyan-400 mt-40">Loading...</p>
      </MainLayout>
    );
  }

  // SAFE GUARD
  if (!job) {
    return (
      <MainLayout>
        <p className="text-center text-cyan-400 mt-10">
          Loading job details...
        </p>
      </MainLayout>
    );
  }

          // ✅ FIXED COMPANY (PER JOB)
          const companyLogo = CompanyLogos(job.company_name || job.company);
  

  return (
    <MainLayout>
      <div className="min-h-screen mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-cyan-400/30 p-6 rounded-2xl shadow-lg"
        >

        <div className="flex flex-col items-center text-center">

          <div className="w-[150px] h-[150px] bg-white mb-4 border rounded-full border-cyan-400 flex items-center justify-center overflow-hidden">
            <img
                src={companyLogo}
                alt="logo"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${job.company_name || job.company}`;
                }}
              />
          </div>

          <h1 className="text-5xl font-bold mb-2 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
            {job?.title}
          </h1>
          <p className="text-cyan-300 mt-2 text-sm">
            AI Verified Company • {job.company_name || job.company}
          </p>
        </div>

        <div className="grid grid-cols-5 w-full items-center mt-5 text-sm font-bold p-1 rounded-xl bg-white/2 backdrop-blur-md border border-cyan-400/30">

          <div>
            <p className="mr-12 drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-black">{job.company_name || job.company}</p>
          </div>
          
          <div>
            <p className="text-blue-400">{job?.location}</p>
          </div>

          <div>
            <p
              onClick={() => setShowRecruiter(true)}
              className="text-black cursor-pointer hover:scale-110 drop-shadow-[0_0_5px_rgba(239,68,68,1)]"
              >
              {job?.recruiter_details?.username || "Recruiter"}
            </p>
          </div>

          <div>
              <p className="text-green-400">{job?.job_type}</p>
          </div>
    
          <div>
              <p>{job?.salary}</p>
          </div>

          {showRecruiter && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-black/80 text-cyan-400 p-6 rounded-2xl w-80 border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              
              <h2 className="text-xl font-bold mb-4 text-center">
                Recruiter Information
              </h2>

              <p>
                <strong>Name:</strong>{" "}
                {job?.recruiter_details?.first_name}{" "}
                {job?.recruiter_details?.last_name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {job?.recruiter_details?.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {job?.recruiter_details?.phone_no}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                {/* View Profile Button */}
                <button
                  onClick={() => {
                    navigate(
                      `/recruiter-profile/${job?.recruiter_details?.id}`
                    );
                    setShowRecruiter(false);
                  }}
                  className="flex-1 bg-cyan-500/20 border border-cyan-400
                            text-cyan-300 px-4 py-2 rounded-lg
                            hover:bg-cyan-500/30"
                >
                  View Profile
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShowRecruiter(false)}
                  className="flex-1 bg-red-500/20 border border-red-400
                            text-red-300 px-4 py-2 rounded-lg
                            hover:bg-red-500/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        </div>


        {/* DESCRIPTION */}

            <h2 className="mt-10 text-3xl font-bold text-cyan-400 mb-6 text-center">
              Job Description
            </h2>

          <div className="mt-5 max-w-4xl mx-auto text-left mb-5 p-4 rounded-xl bg-white/2 backdrop-blur-md border border-cyan-400/30">
            {job?.description
              ?.split("➤") // split sections
              .filter(section => section.trim() !== "")
              .map((section, index) => {
                
                const lines = section.split("●").filter(l => l.trim() !== "");
                const title = lines[0]; // first line = section title
                const points = lines.slice(1); // rest = bullets

                return (
                  <div key={index} className="mb-6">

                    {/* SECTION TITLE */}
                    <h3 className="text-lg font-bold text-black mb-2">
                      ➤ {title.replace(":-", "").trim()}
                    </h3>

                    {/* BULLETS */}
                    <ul className="space-y-2 pl-6">
                      {points.map((point, i) => (
                        <li key={i} className="flex gap-2 text-gray-300">
                          <span className="text-black">●</span>
                          <span>{point.trim()}</span>
                        </li>
                      ))}
                    </ul>

                  </div>
                );
              })}
          </div>

          {/* EXTRA FIELDS (OPTIONAL) */}
          {job.requirements && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-cyan-300 mb-2">
                Requirements
              </h2>
              <p className="text-gray-300">{job.requirements}</p>
            </div>
          )}

          {job.skills && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-cyan-300 mb-2">
                Skills
              </h2>
              <p className="text-gray-300">{job.skills}</p>
            </div>
          )}


          {/* RESUME */}
          <div className="grid md:grid-cols-1 mt-10 ml-60 mr-60 bg-white/10 p-4 backdrop-blur-lg border border-white/20 rounded-2xl">
            <h2 className="text-lg font-bold text-[#4d6bff] text-center mb-4">
              Resume Manager
            </h2>

            {/* Hidden File Input */}
            <input
              type="file"
              id="resumeUpload"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />

            {/* Custom Upload Button */}
            <label
              htmlFor="resumeUpload"
              className="cursor-pointer bg-white/5 font-bold text-cyan-300 backdrop-blur-xl
                        border border-cyan-400 p-3 text-center rounded-xl
                        transition duration-300 hover:bg-[#0000003b]
                        hover:shadow-lg hover:shadow-cyan-400/50"
            >
              {resumeFile ? "Replace Resume" : "Upload Resume"}
            </label>

            {/* Selected File Name */}
            {resumeFile && (
              <p className="bg-white/5 font-bold mt-3 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] backdrop-blur-xl border border-cyan-400 p-2 text-center rounded-xl">
                {resumeFile.name}
              </p>
            )}

            {/* Existing Resumes Dropdown */}
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="mt-4 bg-white/10 border border-white/20 p-3 rounded-xl w-full text-white"
            >
              <option value="" className="text-black">
                Select Resume
              </option>

              {resumes.map((r) => (
                <option
                  key={r.id}
                  value={r.file}
                  className="text-black"
                >
                  {r.name}
                </option>
              ))}
            </select>
          </div>


          <div className="grid grid-cols-4 gap-4 mt-10 mb-5">

                <button
                  onClick={() => applyToJob(job.id)}
                  className="bg-white/20 hover:bg-[#0000003b] hover:text-cyan-400 border-2 border-black hover:border-cyan-400 font-bold text-black px-4 py-2 rounded-lg"
                >
                  {appliedJobs.includes(job.id) ? "Applied" : "Apply"}
                </button>

                <button
                  disabled={noResume}
                  onClick={() => quickApply(job.id)}
                  className={`hover:text-cyan-400 border-2 border-black hover:border-cyan-400 font-bold text-black px-4 py-2 rounded-lg
                    ${noResume 
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-white/20 hover:bg-[#0000003b] hover:text-cyan-400 border-black hover:border-cyan-400"
                    }`}
                >
                  {loadingId === job.id ? "Applying..⏳" : "Quick Apply"}
                </button>


                <button
                  onClick={() => {
                    if (!job.recruiter_details?.email) {
                      return toast.error("Recruiter email not available ❌");
                    }

                    window.location.href = `mailto:${job.recruiter_details.email}`;
                  }}
                  className="bg-white/20 hover:bg-[#0000003b] hover:text-cyan-400 border-2 border-black hover:border-cyan-400 font-bold text-black px-4 py-2 rounded-lg"
                >
                  Contact Recruiter
                </button>

                <motion.button
                  whileTap={{ scale: 1.2 }}
                  onClick={() => toggleSaveJob(job.id)}
                  className="bg-white/20 hover:bg-[#0000003b] border-2 border-black hover:border-cyan-400  px-4 py-2 rounded-lg"
                >
                  {savedJobs.includes(job.id) ? "❤️" : "🤍"}
                </motion.button>

                {/* SCORE */}
              {scores[job.id] && (
                <div className="mt-3">
                  <p className="text-[#4d6bff]">
                    {scores[job.id]}%
                  </p>
                  <div className="w-full bg-white/20 h-2 rounded">
                    <div
                      className="bg-[#0017ff] h-2 rounded"
                      style={{ width: `${scores[job.id]}%` }}
                    />
                  </div>
                </div>
              )}

              </div>        
</motion.div>
      </div>
    </MainLayout>
  );
}

export default JobDetails;