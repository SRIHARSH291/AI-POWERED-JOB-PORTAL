import { useEffect, useState } from "react";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";

function Profile() {

  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
  return () => {
    if (preview) URL.revokeObjectURL(preview);
  };
  }, [preview]);

  useEffect(() => {
    if (profile?.job_seeker_profile) {
      setBio(profile.job_seeker_profile.bio || "");
      setSkills(profile.job_seeker_profile.skills || "");
      setExperience(profile.job_seeker_profile.experience || "");
    }
  }, [profile]);

  // 🔹 UPDATE PROFILE 
  const updateProfile = async () => {
    try {
      const formData = new FormData();

      // Basic user info
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone_no", phoneNo);

      // Job seeker profile info
      formData.append("bio", bio);
      formData.append("skills", skills);
      formData.append("experience", experience);

      await API.put("/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await API.get("/profile/");
      setProfile(res.data);

      toast.success("Profile Updated Successfully ✅");
    } catch (error) {
      console.log("UPDATE ERROR:", error.response?.data || error);
      toast.error("Update Failed ❌");
    }
  };
    

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/");
        setProfile(res.data);
        setData(res.data);
        setFirstName(res.data.first_name || "");
        setLastName(res.data.last_name || "");
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        setPhoneNo(res.data.phone_no || "");

      } catch (error) {
        console.error("Profile Load Error:", error);

        if (error.response?.status === 401) {
          toast.error("Session Expired. Please Login Again 🔐");
          window.location.href = "/login";
        } else {
          toast.error("Failed to Load Profile ❌");
        }
      }
    };

    fetchProfile();
  }, []);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedImg = async () => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };


  // 🔹 Upload photo
  const handlePhotoChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // 🔥 cleanup old preview
    if (preview) URL.revokeObjectURL(preview);

    const objectUrl = URL.createObjectURL(selected);

    setFile(selected);
    setPreview(objectUrl);
  };

  // 🔹 Upload Photo
  const uploadPhoto = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      toast.error("Select & Crop Image First ❌");
      return;
    }

    try {
      setUploading(true);

      const croppedBlob = await getCroppedImg();

      // ✅ CONVERT BLOB → FILE (IMPORTANT FIX)
      const file = new File([croppedBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("profile_picture", file);

      await API.put("/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await API.get("/profile/");
      setProfile(res.data);

      setImageSrc(null);

      toast.success("Profile Photo Updated");

    } catch (err) {
      console.log("UPLOAD ERROR:", err.response?.data || err);
      toast.error("Upload Failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Resume upload
  const uploadResume = async (e) => {
  const resumeFile = e.target.files[0];
  setShowPreview(true);
  setIsMinimized(false);
  if (!resumeFile) return;

  // ✅ FILE TYPE VALIDATION
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(resumeFile.type)) {
    toast.error("Only PDF/DOC/DOCX Allowed ❌");
    return;
  }
  
  // ✅ FILE SIZE (2MB LIMIT)
  if (resumeFile.size > 2 * 1024 * 1024) {
    toast.error("Max File Size is 2MB ❌");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);

    await API.patch("/profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 🔥 FORCE REFRESH
    const updated = await API.get("/profile/");
    setProfile(updated.data);
    

    toast.success("Resume Uploaded Successfully ✅");

  } catch (error) {
    console.error("Resume Upload Error:", error.response?.data);
    toast.error("Resume Upload Failed ❌");
  }
};

  if (!profile) return null;

  if (!profile) return

  // Profile photo
  const displayImage =
    preview ||
    profile.profile_picture ||
    `https://ui-avatars.com/api/?name=${profile.username}`;


  // 🔹 Resume URL 
  const resumePath = profile?.job_seeker_profile?.resume;

  const resumeUrl =
    resumePath && resumePath.startsWith("http")
      ? resumePath
      : resumePath
      ? `http://127.0.0.1:8000${resumePath}`
      : null;

  if (!profile) return null;


  // 🔹 VIEW HANDLER
  const handleViewResume = () => {
    if (!resumeUrl) {
      toast.error("No Resume Found ❌");
      return;
    }

    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };
  
  // Profile completion %
  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;

    const fields = [
      profile.username,
      profile.email,
      profile.phone_no,
      profile.profile_picture,
      profile.job_seeker_profile?.bio,
      profile.job_seeker_profile?.skills,
      profile.job_seeker_profile?.experience,
      profile.job_seeker_profile?.resume,
    ];

    const filled = fields.filter(
      (field) => field !== null && field !== undefined && field !== ""
    ).length;

    return Math.round((filled / fields.length) * 100);
  };
  const completion = calculateProfileCompletion(profile);
  
  
  return (
    <MainLayout>
    
      <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

        {/* HEADER */}
        <div className="grid md:grid-cols-3 items-center gap-4">

          {/* LEFT EMPTY */}
          <div></div>

          {/* CENTER PROFILE */}
          <div className="flex justify-center">
            <label htmlFor="photoUpload">
              <img
                src={displayImage}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 drop-shadow-[0_0_5px_rgba(34,211,238,1)] border-black shadow-lg object-cover cursor-pointer hover:scale-110 transition duration-300"
              />
            </label>
          </div>

          {/* RIGHT SIDE LOGIN INFO */}
          <div className="absolute right-5 text-right mx-auto w-full max-w-[200px] bg-[#0000003b] border border-cyan-400 pr-4">

            <p className="text-xs text-cyan-400 font-semibold">Last Login</p>
            <p className="text-sm text-white mb-2">
              {profile.last_login
                ? new Date(profile.last_login).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
                : "Never"}
            </p>

            <p className="text-xs text-cyan-400 font-semibold">Date Joined</p>
            <p className="text-sm text-white">
              {profile.date_joined
                ? new Date(profile.date_joined).toLocaleString()
                : "N/A"}
            </p>

          </div>

        </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div></div>
            <h2 className="text-2xl font-bold hover:scale-105 text-black rounded-xl font-bold text-center transition duration-300 mt-2 drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
            {profile.first_name || " "} {profile.last_name || " "}
            </h2>
            <div></div>
          </div>
          
          {/* PHOTO UPLOAD */}
          <div className="grid md:grid-cols-3 gap-10">
            <div></div>
            {/* CUSTOM BUTTON */}
            <div
              {...getRootProps()}
              className="mt-4 p-3 border-2 bg-white/10 hover:bg-[#0000003b] border-dashed border-cyan-400 rounded-xl text-center cursor-pointer transition"
            >
              
              <input {...getInputProps()} />
              <h3 className="mb-2 text-l text-white">Update Profile Photo</h3>
              <p className="text-cyan-400 text-xs">
                Drag & Drop Image OR Click to Upload 
              </p>
            </div>
            <div></div>
          </div>

            {imageSrc && (
              <div className="mt-6 relative w-full h-64 bg-black rounded-xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}

            {file && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: {file.name}
              </p>
            )}

            {imageSrc && (
              <button
                onClick={uploadPhoto}
                className="mt-4 px-4 py-2 bg-white/40 font-bold border-2 border-cyan-400 text-black rounded-xl hover:bg-[#0000003b] hover:text-cyan-400 hover:scale-105 transition"
              >
                Upload Photo 
              </button>
            )}



          {/* PROFILE COMPLETION */}
          <div className="mt-6">
            <p className="font-medium mb-1 text-cyan-300">
              Profile Completion: {completion}%
            </p>

            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>
    

        <hr className="my-6 border-gray-700" />

        {/* BASIC INFO */}
          <hr className="my-6 border-gray-700" />

          <div className="grid md:grid-cols-3 gap-20">
            <div></div>

            <div>
              <h3 className="flex-wrap text-xl font-bold mb-5 drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-cyan-300">
                BASIC INFORMATIONS
              </h3>

              {/* First Name */}
              <label className="text-left block text-cyan-300 font-semibold mb-1">
                First Name:
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 mb-3 border border-cyan-400 bg-white/5 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter First Name"
              />

              {/* Last Name */}
              <label className="text-left block text-cyan-300 font-semibold mb-1">
                Last Name:
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 mb-3 border border-cyan-400 bg-white/5 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter Last Name"
              />

              {/* Username */}
              <label className="text-left block text-cyan-300 font-semibold mb-1">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mb-3 border border-cyan-400 bg-white/5 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter Username"
              />

              {/* Email */}
              <label className="text-left block text-cyan-300 font-semibold mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-3 border border-cyan-400 bg-white/5 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter Email"
              />

              {/* Phone Number */}
              <label className="text-left block text-cyan-300 font-semibold mb-1">
                Phone Number:
              </label>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full p-2 mb-3 border border-cyan-400 bg-white/5 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter Phone Number"
              />
            </div>

            <div></div>
          </div>
        
        
        {/* RESUME */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Resume</h3>

          {/* 🔹Resume Upload Box */}
          <div className="grid md:grid-cols-3 gap-10">
            <div></div>
            <label
              htmlFor="resumeUpload"
              className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-cyan-400 rounded-xl cursor-pointer bg-white/10 hover:bg-[#0000003b] transition"
            >
              <span className="text-cyan-300 font-medium">
                {resumeUrl ? "Replace Resume" : "Upload Resume"}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PDF, DOC, DOCX (Max 2MB)
              </span>

              <input
                id="resumeUpload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={uploadResume}
                className="hidden"
              />
            </label>
            <div></div>
          </div>

          {/* 🔹 Resume Preview */}
          {resumeUrl && showPreview && (
            <div className="mt-4 bg-[#0000003b] w-full h-full p-4 rounded-xl border border-cyan-400">

              {/* ACTION BUTTONS */}

              <div className="flex justify-between items-center">
                <p className="text-cyan-300 items-center text-sm">Your Resume</p>

                <div className="flex gap-3">
                  <button
                    onClick={handleViewResume}
                    className="text-blue-400 text-sm"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resumeUrl);
                      toast.success("Resume link Copied 📋");
                    }}
                    className="text-green-400 text-sm"
                  >
                    Copy Link
                  </button>

                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-yellow-400 text-lg font-bold hover:scale-110"
                  >
                    {isMinimized ? "▢" : "—"}
                  </button>

                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-red-400 text-lg font-bold hover:scale-110"
                  >
                    ✖
                  </button>
                </div>
              </div>

              {/* 🔥 PDF PREVIEW */}
                {isMinimized ? (
                  <p className="text-gray-400 text-sm text-center">
                    Preview Minimized
                  </p>
                ) : resumeUrl && resumeUrl.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={resumeUrl}
                    title="Resume Preview"
                    className="w-full h-[400px] rounded-lg border"
                  />
                ) : (
                  <p className="text-gray-300 text-sm">
                    Preview not available. Click "View".
                  </p>
                )}
            </div>
          )}
        </div>



      <hr className="my-6 border-gray-700" />

        {/* PROFESSIONAL INFO */}
          <h3 className="flex flex-wrap text-xl font-bold mb-3 drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-cyan-300">
            PROFESSIONAL INFORMATIONS
          </h3>
          
          <h2 className="flex flex-wrap text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold mb-2 mt-6 underline">BIO</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter Your Bio..."
            className="flex flex-wrap w-full h-60 p-5 mt-2 font-bold border border-cyan-400 bg-white/5 hover:bg-[#0000003b] text-white rounded"
            />

          <h2 className="flex flex-wrap text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold mb-2 mt-6 underline">SKILLS</h2>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter Your Skills..."
            className="flex flex-wrap w-full h-60 p-5 mt-2 font-bold border border-cyan-400 bg-white/5 hover:bg-[#0000003b] text-white rounded"
            />
          
          <h2 className="flex flex-wrap text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold mb-2 mt-6 underline">EXPERIENCE / PROJECTS</h2>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter Your Experience..."
            className="flex flex-wrap w-full h-60 p-5 mt-2 font-bold border border-cyan-400 bg-white/5 hover:bg-[#0000003b] text-white rounded"
          />
          
          <button
            onClick={updateProfile}
            className="mt-5 px-5 py-2 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000000b] border-2 transition text-black border-cyan-400 bg-white/10 text-black hover:border-black hover:text-cyan-400"
          >
            SAVE PROFILE
          </button>
      </div>
    </MainLayout>

  );
}

export default Profile;