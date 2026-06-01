import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import API from "../../api/axios";

function RecruiterInsights() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/admin/recruiters-insights/")
      .then(res => setData(res.data));
  }, []);

  return (
<MainLayout>
 <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

         {/* TITLE */}
         <h2 className="text-4xl sm:text-3xl md:text-4xl text-center mx-auto w-full max-w-[730px] text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:scale-105 hover:bg-[#0000003b] transition-all duration-300 font-bold mt-5 mb-10">💡 RECRUITER INSIGHTS DASHBOARD 💡</h2>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
      {data.map((r, i) => (
      <Tilt
          key={i}
          glareEnable={true}
          glareMaxOpacity={0.3}
          scale={1.05}
          transitionSpeed={2000}
          className="bg-white/5 hover:scale-105 p-5 items-center hover:bg-[#0000003b] border-2 border-cyan-400 text-center"
        > 
          {/* PROFILE IMAGE */}
          <img
            src={r.profile_picture || "https://via.placeholder.com/80"}
            className="w-20 h-20 mx-auto mb-3 rounded-full drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
            alt=""
          />      
          <p className="text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold">
            {r.first_name} {r.last_name}
          </p>
          <p className="text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold">{r.recruiter}</p>
          <p className="drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400">
             Company: {r.company_name}
          </p>
          <p className="drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400">Jobs Posted: {r.jobs_posted}</p>
          <p className="drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400">Applications: {r.applications}</p>
      </Tilt>
      ))}
    </div>

 </div>
</MainLayout>
  );
}

export default RecruiterInsights;