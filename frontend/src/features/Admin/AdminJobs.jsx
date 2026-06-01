import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CompanyLogos } from "../../utils/CompanyLogos";


function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [company_name, setcompany_name] = useState("");
  const [skill, setSkill] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    API.get("/admin/jobs/")
      .then(res => setJobs(res.data));
  }, []);

  const toggleJobStatus = async (id) => {
    try {
      const res = await API.patch(`/admin/block-job/${id}/`);

      const newStatus = res.data?.status; // safe

      if (!newStatus) {
        toast.error("Invalid response from server");
        return;
      }

      setJobs(prev =>
        prev.map(j =>
          j.id === id ? { ...j, status: newStatus } : j
        )
      );

      toast.success(
        newStatus === "closed"
          ? "🚫 Job Closed"
          : "✅ Job Reopened" 
      );

    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to Update Job");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    (query ? job.title?.toLowerCase().includes(query.toLowerCase()) : true) &&
    (location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true) &&
    (company_name ? (job.company_name || job.company || "").toLowerCase().includes(company_name.toLowerCase()) : true) &&
    (skill ? (job.skills || "").toLowerCase().includes(skill.toLowerCase()) : true) &&
    (type ? job.job_type === type : true)
  );

  return (
  <MainLayout>
    <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">
    
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
     
             
              
             <h1 className="text-4xl sm:text-3xl md:text-4xl text-center mx-auto w-full max-w-[300px] text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:scale-105 hover:bg-[#0000003b] transition-all duration-300 font-bold mt-5 mb-10">MANAGE JOBS</h1>
     
             {/* JOB LIST */}
             {filteredJobs.length === 0 ? (
               <div className="text-center mt-10 text-gray-400">
                 ❌ No Jobs Found For Your Search
               </div>
             ) : (
               
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
               
             {filteredJobs.map((job) => {
             // ✅ FIXED COMPANY (PER JOB)
                       
             const companyLogo = CompanyLogos(job.company_name || job.company);
             
                 
               return (
                <Tilt
                key={job.id}
                glareEnable={true}
                glareMaxOpacity={0.3}
                scale={1.05}
                transitionSpeed={2000}
                >
                 <div
                   className="bg-white/10 hover:drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000003b] p-4 border-2 border-cyan-400/40 flex flex-col items-center text-center gap-2 hover:scale-[1.02] transition"
                 >
     
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

        
                  <p className="text-lg text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold">{job.title}
                  </p> 

                  <p>
                    @{job.recruiter?.username || "N/A"}
                  </p>
                      
                  <p className="text-m text-cyan-400 font-bold">
                    Recruiter: {job.recruiter
                      ? `${job.recruiter.first_name} ${job.recruiter.last_name}`.trim()
                      : "Unknown Recruiter"}
                  </p>


                  <p>
                    {job.recruiter?.email || "No Email Available"}
                  </p>                  
              
              <p className="truncate">
                    Status:
                    <span
                      className={`ml-2 px-2 py-1 rounded text-white truncate text-sm font-bold ${
                        job.status.toLowerCase() === "closed"
                        ? "bg-[#ff0000] text-black"
                        : "bg-[#0aff00] text-black"
                      }`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </p>
                    
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4  ">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleJobStatus(job.id);
                    }}
                    className={`px-2 mt-4 py-1 text-sm font-bold border rounded transition ${
                      job.status.toLowerCase() === "closed"
                        ? "bg-[#0000003b] text-cyan-400 hover:bg-[#0aff00] border-cyan-400/40 hover:text-black"
                        : "bg-[#0000003b] text-cyan-400 hover:bg-[#ff0000] border-cyan-400/40 hover:text-black"                     
                    }`}
                  >
                    {job.status.toLowerCase() === "closed" ? "REOPEN" : "CLOSE"}
                  </button>

                  <button 
                  onClick={() => navigate(`/recruiterjobdetails/${job.id}`)}
                  className="px-2 mt-4 py-1 text-xs sm:text-sm font-bold border rounded transition bg-[#0000003b] text-cyan-400 hover:bg-[#000dff] border-cyan-400/40 hover:text-black text-cyan-400 border-cyan-400/40 hover:text-black">
                    VIEW
                  </button>

                  <button 
                  onClick={() => navigate(`/admin-edit-job/${job.id}`)}
                  className="px-2 mt-4 py-1 text-xs sm:text-sm font-bold border rounded transition bg-[#0000003b] text-cyan-400 hover:bg-[#0aff00] border-cyan-400/40 hover:text-black text-cyan-400 border-cyan-400/40 hover:text-black">
                    EDIT
                  </button>
            </div>
                </div>
              </Tilt>
              );
            })}
      </div>
             )}

</div>
</MainLayout>
);
}

export default AdminJobs;