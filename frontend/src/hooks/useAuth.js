import { useEffect, useState } from "react";
import API from "../api/axios";

function useAuth() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [stats, setStats] = useState({ applied: 0, saved: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");

    // 🔥 VERY IMPORTANT: STOP if not logged in
     if (token) {
      setUser({ loggedIn: true });
    } else {
      setUser(null);
    }
  

    const fetchData = async () => {
      setLoading(true);
      try {
        const [apps, saved, prof] = await Promise.all([
          API.get("/applications/"),
          API.get("/saved-jobs/"),
          API.get("/profile/")
        ]);

        setStats({
          applied: apps.data.length,
          saved: saved.data.length,
        });

        setUser(prof.data);

        // HANDLE BOTH ROLES
        if (prof.data.user_type === "recruiter") {
          setProfileData(prof.data.recruiter_profile || {});
        } else {
          setProfileData(prof.data.job_seeker_profile || {});
        }

      } catch (err) {
        console.log("Auth error:", err);

        if (err.response?.status === 401) {
          localStorage.clear();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { user, profileData, stats, loading };
}

export default useAuth;