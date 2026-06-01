import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";


function RecruiterProfileView() {
  const { id } = useParams();

  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecruiterProfile();
  }, [id]);

  const fetchRecruiterProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/recruiter-profile/${id}/`
      );

      console.log("Recruiter API Response:", response.data);

      setRecruiter(response.data);
    } catch (err) {
      console.error("Error fetching recruiter profile:", err);

      if (err.response) {
        setError(
          err.response.data?.detail ||
            "Failed to load recruiter profile."
        );
      } else {
        setError("Server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="text-cyan-400 text-center mt-20 text-2xl">
          Loading recruiter profile...
        </div>
      </MainLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="text-red-400 text-center mt-20 text-xl">
          {error}
        </div>
      </MainLayout>
    );
  }

  // No Data State
  if (!recruiter) {
    return (
      <MainLayout>
        <div className="text-red-400 text-center mt-20 text-xl">
          Recruiter not found.
        </div>
      </MainLayout>
    );
  }

  // Industry Tags
  const industryTags =
    recruiter.industry
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) || [];

  return (
    <MainLayout>
    <div className="min-h-screen mt-10 bg-black text-white p-4 sm:p-6">
        <div className="w-full max-w-5xl mx-auto bg-black/30 border border-cyan-400 rounded-3xl p-4 sm:p-8 shadow-[0_0_25px_rgba(34,211,238,0.35)]">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
                src={recruiter.profile_picture || "https://via.placeholder.com/150"}
                alt={recruiter.username}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-400 object-cover shadow-[0_0_20px_rgba(34,211,238,0.6)]"
            />

            <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl mt-4 md:mt-5 text-center md:text-left font-bold text-black break-words drop-shadow-[0_0_10px_rgba(34,211,238,1)]">
                {recruiter.first_name} {recruiter.last_name}
                </h1>

                <p className="text-sm sm:text-lg md:text-2xl text-center md:text-left text-gray-300 mt-2 break-all">
                {recruiter.email}
                </p>
            </div>
            </div>

              <div className="flex-1 mt-10">
                <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
                  ABOUT
                </h2>

                <p className="text-gray-300 text-lg leading-9 text-justify">
                  {recruiter.description ||
                    "No company description available."}
                </p>
              </div>

          {/* Company Details */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <InfoCard
              label="Company"
              value={recruiter.company_name}
            />
            <InfoCard
              label="Website"
              value={recruiter.website}
            />
            <InfoCard
              label="Phone"
              value={recruiter.phone_no}
            />
            <InfoCard
              label="Location"
              value={recruiter.location}
            />
          </div>

          {/* Industry Tags */}
          {industryTags.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
                INDUSTRY
              </h2>

              <div className="flex flex-wrap gap-3 justify-center">
                {industryTags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-cyan-500 text-black font-semibold px-4 py-2 rounded-md shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-black/40 border border-cyan-400 rounded-xl p-4">
      <p className="text-cyan-400 font-bold text-sm uppercase mb-1">
        {label}
      </p>
      <p className="text-gray-200 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default RecruiterProfileView;