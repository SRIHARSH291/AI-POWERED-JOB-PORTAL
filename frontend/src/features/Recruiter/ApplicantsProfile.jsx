import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";

function ApplicantsProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get(`/users/${id}/`)   // create this API or reuse
      .then(res => setUser(res.data))
      .catch(() => console.error("Failed to load profile"));
  }, [id]);

  if (!user) return <p className="text-white">Loading...</p>;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto mt-10 p-6 border border-cyan-400 rounded-2xl bg-[#0000003b] backdrop-blur-lg">

        {/* HEADER */}
        <div className="flex items-center gap-5">

          <img
            src={user.profile_picture}
            className="w-24 h-24 rounded-full border-2 border-cyan-400 object-cover"
          />

          <div>
            <h1 className="text-2xl w-full font-bold hover:scale-105 drop-shadow-[0_0_5px_rgba(34,211,238,1)]  text-black rounded-xl font-bold text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-white/80 drop-shadow-[0_0_5px_rgba(34,211,238,1)]">{user.email}</p>
          </div>

        </div>

        {/* BIO */}
        <div className="mt-6">
          <h2 className="text-cyan-400 font-semibold mb-2">ABOUT</h2>
          <p className="text-left justify-between text-gray-300">
            {user.bio || "No bio available"}
          </p>
        </div>

        {/* SKILLS */}
        <div className="mt-6">
          <h2 className="text-cyan-400 font-semibold mb-2">SKILLS</h2>
          <div className="text-left flex flex-wrap gap-2">
            {user.skills?.split(",").map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-bold rounded bg-cyan-500/80 text-black"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default ApplicantsProfile;