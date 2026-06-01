import { useEffect, useState } from "react";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Applicants() {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/recruiter/applicants/")
      .then(res => setApps(res.data))
      .catch(() => toast.error("Failed to load applicants"));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/applications/${id}/`, { status });
      setApps(prev =>
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Update failed");
    }
  };

  const sendMail = async (email) => {
    await API.post("/recruiter/send-email/", {
      email,
      message: "You are Shortlisted 🎉"
    });

    toast.success("Email Sent 📧");
  };

  const getColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <MainLayout>
      <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

      <div className="grid md:grid-cols-3 gap-6">
        <p></p>
        <h1 className="text-4xl items-center text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mb-5"> JOB APPLICANTS</h1>
        <p></p>
      </div>          
        

        <div className="grid md:grid-cols-3 gap-6">

          {apps.map(app => (
            <div key={app.id} className="bg-white/5 hover:scale-105 p-5 hover:bg-[#0000003b] border-2 border-cyan-400 rounded-xl">

              {/* 🔥 HEADER */}
              <div className="flex items-center gap-3 flex-wrap">

               <img
                  src={
                    app.user?.profile_picture ||
                    `https://ui-avatars.com/api/?name=${app.user?.username}`
                  }
                  alt="avatar"
                  className="w-12 h-12 rounded-full border border-cyan-400 object-cover"
                />

                <div>
                  <h3 className="text-lg sm:text-xl font-bold break-words leading-tight hover:scale-105 drop-shadow-[0_0_5px_rgba(34,211,238,1)]  text-black rounded-xl text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400">
                    {`${app.user?.first_name || ""} ${app.user?.last_name || ""}`.trim() 
                      || app.user?.username}
                  </h3>
                  <p className="text-xs text-white/80 break-all drop-shadow-[0_0_5px_rgba(34,211,238,1)]">{app.user?.email}</p>
                </div>
              </div>

              {app.recruiter_job_details ? (
                <p className="mt-2 text-sm break-words text-center font-bold px-2 py-1 text-l rounded bg-black/30 text-cyan-400 hover:bg-cyan-400/50 hover:text-black cursor-pointer hover:bg-cyan-500/40"
                onClick={() => navigate(`/recruiterjobdetails/${app.recruiter_job_details.id}`)}>
                  Job: {app.recruiter_job_details.title}
                </p>
              ) : (
                <p className="text-red-400 text-xs">Job not found</p>
              )}

              {/* 🔥 BADGES */}
              <div className="flex justify-between items-center mt-4">

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  (app.match_score || 0) >= 80
                    ? "bg-green-500/20 text-green-400"
                    : (app.match_score || 0) >= 50
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {(app.match_score ?? 0).toFixed(1)}% Match
                </span>

                <span className="text-xs break-words px-3 py-1 bg-cyan-400 font-bold text-black rounded-full hover:text-cyan-400 hover:bg-black/60">
                  {app.status?.charAt(0).toUpperCase() + app.status?.slice(1).toLowerCase()}
                </span>

              </div>

              {/* 🔥 SKILLS (SHORT PREVIEW)
              {app.user?.skills && (
                <p className="text-xs text-gray-300 mt-3 line-clamp-2">
                  {app.user.skills}
                </p>
              )} */}

              {/* 🔥 ACTIONS */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">

                <button
                    onClick={() => navigate(`/applicant/${app.user.id}`)}
                    className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-blue-500/20 text-blue-500 hover:border-cyan-400 hover:bg-blue-500/80 hover:text-black"
                >
                Profile
                </button>

                {app.resume_url && (
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-purple-500/20 text-purple-500 hover:border-cyan-400 hover:bg-purple-500/80 hover:text-black"
                  >
                    Resume
                  </a>
                )}
  
                <button
                  onClick={() => {
                    console.log("USER:", app.user);     
                    console.log("USER ID:", app.user?.id);

                    if (!app.user?.id) {
                      alert("User not found ❌");
                      return;
                    }
                    navigate(`/chat/${app.id}/${app.user?.id}`);
                  }}
                  className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-green-700/20 text-green-700 hover:bg-green-700 hover:text-black"
                >
                  Chat
                </button>



                <button
                    onClick={() => updateStatus(app.id, "rejected")}
                    className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-red-500/20 text-red-500 hover:border-cyan-400 hover:bg-red-500/80 hover:text-black"
                >
                  Reject
                </button>

                <button
                    onClick={() => updateStatus(app.id, "shortlisted")}
                    className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-green-500/20 text-green-500 hover:border-cyan-400 hover:bg-green-500/80 hover:text-black"
                >
                 Select 
                </button>
                
                <button 
                onClick={() => updateStatus(app.id, "interview")} 
                className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black"
                >
                  Interview
                </button>
                
                <button 
                onClick={() => updateStatus(app.id, "offer")}
                className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-pink-500/20 text-pink-600 hover:bg-pink-500 hover:text-black"
                >
                  Offer
                </button>
               
                <button 
                onClick={() => updateStatus(app.id, "hired")}
                className="px-3 py-1 text-xs font-bold rounded border-2 border-black bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                 Hire
                </button>        

              </div>
            </div>
          ))}

        </div>
      </div>
    </MainLayout>
  );
}

export default Applicants;