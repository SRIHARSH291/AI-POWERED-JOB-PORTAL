import { useEffect, useState } from "react";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function MyPostJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs/");
      setJobs(res.data.results || res.data);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  const deleteJob = (id) => {
    toast((t) => (
        <div className="flex flex-col items-center gap-3 p-2">
        
        <p className="text-black font-bold">
            Are you sure you want to delete?
        </p>

        <div className="flex gap-3">

            {/* YES BUTTON */}
            <button
            onClick={async () => {
                try {
                await API.delete(`/jobs/${id}/`);
                toast.dismiss(t.id);
                toast.success("Deleted ✅");
                fetchJobs();
                } catch {
                toast.dismiss(t.id);
                toast.error("Delete failed ❌");
                }
            }}
            className="px-3 py-1 text-sm font-bold bg-[#0000003b] text-red-500 border-black border-2 hover:bg-red-500 hover:text-black rounded"
            >
            Yes
            </button>

            {/* NO BUTTON */}
            <button
            onClick={() => toast.dismiss(t.id)}
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

  const toggleStatus = async (job) => {
    try {
      await API.patch(`/jobs/${job.id}/`, {
        status: job.status === "open" ? "closed" : "open"
      });

      toast.success("Status updated 🔄");
      fetchJobs();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  return (
    <MainLayout>
      <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">                      

        <div className="grid md:grid-cols-3 gap-6">
        <p></p>
        <h1 className="text-4xl items-center text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mb-10">POSTED JOBS</h1>
        <p></p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white/5 p-5 border-2 border-cyan-400 rounded-xl 
                        hover:bg-[#0000003b] transition hover:scale-[1.02] 
                        flex flex-col justify-between"
            >

              {/* TITLE */}
              <h2 className="text-lg sm:text-xl break-words leading-snug w-full font-bold hover:scale-105 drop-shadow-[0_0_5px_rgba(34,211,238,1)]  text-black rounded-xl font-bold text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400">
                {job.title}
              </h2>

              <p className="mt-1 text-gray-400 text-sm break-words text-center">🏢 {job.company_name || job.company}  | 📍{job.location}</p>

              {/* BADGES */}
              <div className="flex flex-wrap justify-center gap-2 mt-3 text-center">
                <span className="text-xs px-2 py-1 bg-black/40 text-cyan-300 rounded">
                  {job.job_type}
                </span>

                <span className="text-xs px-2 py-1 bg-blue-500/20 text-white-300 rounded">
                  {job.experience}
                </span>

                <span className={`text-xs px-2 py-1 rounded ${
                  job.status === "open"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}>
                  {job.status.toUpperCase()}
                </span>
              </div>

              {/* APPLICANTS */}
              <p className="text-sm text-white mt-3">
                👥 Applicants: <span className="text-cyan-500 font-bold">{job.applicant_count}</span>
              </p>

              {/* ACTIONS */}
              <div className="mt-5 flex flex-wrap justify-center gap-2">

                <button
                  onClick={() => navigate(`/recruiterjobdetails/${job.id}`)}
                  className="px-2 py-1 text-xs sm:text-sm font-bold rounded border-2 border-black bg-green-500/20 text-green-500 hover:border-cyan-400 hover:bg-green-500/80 hover:text-black"
                >
                  VIEW
                </button>
                
                <button
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                  className="px-2 py-1 text-xs sm:text-sm font-bold rounded border-2 border-black bg-blue-500/20 text-blue-500 hover:border-cyan-400 hover:bg-blue-500/80 hover:text-black"
                >
                  EDIT
                </button>

                <button
                  onClick={() => deleteJob(job.id)}
                  className="px-2 py-1 text-xs sm:text-sm font-bold rounded border-2 border-black bg-red-500/20 text-red-500 hover:border-cyan-400 hover:bg-red-500/80 hover:text-black"
                >
                  DELETE
                </button>

                <button
                  onClick={() => toggleStatus(job)}
                  className="px-2 py-1 text-xs sm:text-sm font-bold rounded border-2 border-black bg-purple-500/20 text-purple-500 hover:border-cyan-400 hover:bg-purple-500/80 hover:text-black"
                >
                  STATUS
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

export default MyPostJobs;