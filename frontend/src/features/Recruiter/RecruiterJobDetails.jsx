import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "framer-motion";
import toast from "react-hot-toast";  
import { CompanyLogos } from "../../utils/CompanyLogos";

function RecruiterJobDetails() {
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const company = useState("");

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

  // APPLY
  const applyToJob = async (jobId) => {
    if (appliedJobs.includes(jobId)) {
      return toast.error("Already applied ⚠️");
    }

    const resumeToUse = resumeFile || selectedResume || defaultResume;

    if (!resumeToUse) {
      return toast.error("Upload or Select Resume 📄");
    }

    const loadingToast = toast.loading("Applying...");

    try {
      const formData = new FormData();
      formData.append("job", jobId);
      formData.append("resume", resumeToUse);

      await API.post("/applications/", formData);

      setAppliedJobs(prev => [...prev, jobId]);

      toast.dismiss(loadingToast);
      toast.success("Application Submitted ✅");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Apply Failed ❌");
    }
  };


  // QUICK APPLY
  const quickApply = async (jobId) => {
  if (appliedJobs.includes(jobId)) {
    return toast.error("Already applied ⚠️");
  }

  const resumeToUse = resumeFile || selectedResume || defaultResume;

  if (!resumeToUse) {
    return toast.error("Upload/select resume first 📄");
  }

  setLoadingId(jobId);
  const loadingToast = toast.loading("Quick applying ⚡...");

  try {
    const formData = new FormData();
    formData.append("job", jobId);
    formData.append("resume", resumeToUse);

    await API.post("/applications/", formData); // ✅ NOT quick-apply endpoint

    setAppliedJobs(prev => [...prev, jobId]);

    toast.dismiss(loadingToast);
    toast.success("Applied instantly ⚡");
  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error(err.response?.data?.error || "Quick Apply Failed ❌");
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
      <div className="p-6 max-w-4xl mx-auto">

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
            AI Verified Company •  {job.company_name || job.company}
          </p>
        </div>

          <div className="grid grid-cols-5 w-full items-center mt-5 text-sm font-bold p-1 rounded-xl bg-white/2 backdrop-blur-md border border-cyan-400/30">

          <div>
            <p className="mr-12 drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-black"> {job.company_name || job.company}</p>
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

                    <div className="bg-black/80 text-cyan-400 p-6 rounded-2xl w-80">

                    <h2 className="text-xl font-bold mb-4">
                        Recruiter Information
                    </h2>

                    <p>
                      <strong>Name:</strong>{" "}
                      {job?.recruiter_details?.first_name} {job?.recruiter_details?.last_name}
                    </p>               
                    <p><strong>Email:</strong> {job?.recruiter_details?.email}</p>

                    <button
                        onClick={() => setShowRecruiter(false)}
                        className="mt-4 bg-red-500/50 px-4 py-2 rounded-lg text-white"
                    >
                        Close
                    </button>

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
</motion.div>
      </div>
    </MainLayout>
  );
}

export default RecruiterJobDetails;