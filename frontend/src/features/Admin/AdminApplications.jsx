import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import API from "../../api/axios";

function AdminApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    API.get("/admin/applications/")
      .then(res => setApps(res.data));
  }, []);

  return (
     <MainLayout>
 <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">
      
         <h2 className="text-4xl sm:text-3xl md:text-4xl text-center mx-auto w-full max-w-[300px] text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:scale-105 hover:bg-[#0000003b] transition-all duration-300 font-bold mt-5 mb-10">APPLICATIONS</h2>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
      {apps.map(app => (
        
        <Tilt
                key={app.id}
                glareEnable={true}
                glareMaxOpacity={0.3}
                scale={1.05}
                transitionSpeed={2000}
                className="bg-white/5 hover:scale-105 p-5 items-center hover:bg-[#0000003b] border-2 border-cyan-400 text-center"
        >

          {/* PROFILE IMAGE */}
          <img
            src={app.user?.profile_picture || "https://via.placeholder.com/80"}
            className="w-20 h-20 mx-auto mb-3 rounded-full drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
            alt=""
          />

          
          {/* NAME */}
          <h3 className="text-lg font-bold text-cyan-300">
            {app.user?.first_name} {app.user?.last_name}
          </h3>
          <p className="text-sm text-blue-500 ">ID - {app.user_id} : @{app.user?.username}</p>
          <p className="text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 font-bold mt-2">
            {app.company_name} : {app.job_title}
          </p>



          {/* STATUS */}
          <p className={`mt-2 font-bold ${
            app.status === "hired"
              ? "text-green-500"
              : app.status === "rejected"
              ? "text-red-500"
              : "text-yellow-500"
          }`}>
            {app.status.toUpperCase()}
          </p>

        </Tilt>
      ))}
    </div>
    </div>
    </MainLayout>
  );
}

export default AdminApplications;