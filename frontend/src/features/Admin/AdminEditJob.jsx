import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



function AdminEditJob() {
    const navigate = useNavigate();
    const user = useState();
    const { id } = useParams();

  const [job, setJob] = useState({
    title: "",
    company_name: "",
    description: "",
    location: "",
    salary: "",
    experience: "",
    job_type: "",
    recruiter:"",
  });

  const [recruiters, setRecruiters] = useState([]);

  const fetchRecruiters = async () => {
    try {
        const res = await API.get("/admin/users/");

        const recruitersOnly = res.data.filter(
        (u) => u.user_type === "recruiter"
        );

        setRecruiters(recruitersOnly);
    } catch (err) {
        console.log("Recruiter fetch error:", err);
        toast.error("Failed to load recruiters");
    }
    };
  
  useEffect(() => {
    const fetchJob = async () => {
        try {
        console.log("Fetching job ID:", id);

        const res = await API.get(`/jobs/${id}/`);

        console.log("API DATA:", res.data);

        const data = res.data;

        setJob({
            title: data.title || "",
            company_name: data.company_name || "",
            description: data.description || "",
            location: data.location || "",
            salary: data.salary || "",
            experience: data.experience || "",
            job_type: data.job_type || "",
            recruiter: data.recruiter || "",
        });

        } catch (err) {
        console.log("ERROR:", err.response?.data);
        toast.error("Failed to Load Job");
        }
    };

    if (id) {
    fetchJob();
    fetchRecruiters();
  } 

    }, [id]);


  const handleChange = (e) => {
    setJob({
        ...job,
        [e.target.name]: e.target.value
    });
    };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!job.experience) {
        toast.error("Please Select Experience.");
        return;
    }

    if (!job.job_type) {
        toast.error("Please Select Job Type.");
        return;
    }

    if (!job.recruiter) {
        toast.error("Please Select Recruiter.");
        return;
    }

    try {
        const payload = {
        ...job,
        recruiter: Number(job.recruiter), // send recruiter ID as integer
        };

        console.log("Submitting payload:", payload);

        await API.patch(`/jobs/${id}/`, payload);

        toast.success("Job Updated Successfully ✅");

        setTimeout(() => {
        navigate("/admin/jobs");
        }, 1500);

    } catch (err) {
        console.log("FULL ERROR:", err);
        console.log("BACKEND ERROR:", err.response?.data);

        const errors = err.response?.data;

        // Show first field error cleanly
        if (errors && typeof errors === "object") {
        const firstKey = Object.keys(errors)[0];

        if (
            firstKey &&
            Array.isArray(errors[firstKey]) &&
            errors[firstKey].length > 0
        ) {
            toast.error(errors[firstKey][0]);
            return;
        }

        if (errors.detail) {
            toast.error(errors.detail);
            return;
        }
        }

        toast.error("Update Failed ❌");
    }
    };

  return (
    <MainLayout>
        <div className="flex flex-col items-center justify-center w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 mb-5"
      >

        <h1 className="text-4xl items-center w-full text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mb-5">EDIT JOB</h1>
      

          <input  
          name="title" 
          value={job.title}
          onChange={handleChange} 
          className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]" 
          />

          <input 
          name="company_name" 
          value={job.company_name}
          onChange={handleChange} 
          className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]" 
          />

          <textarea 
          name="description" 
          value={job.description}
          onChange={handleChange} 
          className="input w-full h-[200px] p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]" 
          />

          <input 
          name="location" 
          value={job.location}
          onChange={handleChange} 
          className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]" 
          />
          
          <input 
          name="salary" 
          value={job.salary}
          onChange={handleChange} 
          className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]" 
          />

          <select 
          name="experience" 
          onChange={handleChange}
          value={job.experience}
          className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]">
            <option value="">Select Experience</option>
            <option value="0-1 years">0 - 1 Years</option>
            <option value="1-3 years">1 - 3 Years</option>
            <option value="3-5 years">3 - 5 Years</option>
            <option value="5+ years">5 + Years</option>
          </select>

          <select 
            name="job_type" 
            onChange={handleChange}
            value={job.job_type}
            className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600"
          >
            <option value="">Select Job Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        

        <h1 className="text-4xl items-center w-full text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mt-10 mb-5">EDIT RECRUITER</h1>

          <select
            name="recruiter"
            value={job.recruiter}
            onChange={handleChange}
            className="w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border-2 border-cyan-600"
          >
            <option value="">Select Recruiter</option>

            {recruiters.map((r) => (
              <option key={r.id} value={r.id}>
                {r.first_name} {r.last_name} ({r.username})
              </option>
            ))}
          </select>

        <button
            type="submit"
            className="mt-5 px-5 py-2 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000000b]
            border-2 transition text-black border-cyan-400 bg-white/10
            hover:border-black hover:text-cyan-400"
            >
            Update Job
        </button>

      </motion.form>
      </div>
    </MainLayout>
  );
}

export default AdminEditJob;