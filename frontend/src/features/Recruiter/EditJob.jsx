import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function EditJob() {
  const { id } = useParams();

  const [job, setJob] = useState({
    title: "",
    company_name: "",
    description: "",
    location: "",
    salary: "",
    experience: "",
    job_type: ""
  });

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
            job_type: data.job_type || ""
        });

        } catch (err) {
        console.log("ERROR:", err.response?.data);
        toast.error("Failed to load job");
        }
    };

    if (id) fetchJob();  

    }, [id]);

  const handleChange = (e) => {
    setJob({
        ...job,
        [e.target.name]: e.target.value
    });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await API.patch(`/jobs/${id}/`, job);
        toast.success("Job Updated ✅");
    } catch (err) {
        console.log(err.response?.data);
        toast.error("Update failed ❌");
    }
    };

    if (!job.title) {
        return <p className="text-white p-6">Loading job Data...</p>;
    }

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

        <button className="mt-5 px-5 py-2 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000000b] border-2 transition text-black border-cyan-400 bg-white/10 text-black hover:border-black hover:text-cyan-400">Update Job</button>

      </motion.form>
      </div>
    </MainLayout>
  );
}

export default EditJob;