import { useEffect, useState } from "react";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { Link } from "react-router-dom";


function RecruiterProfile() {

  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  // 🔹 UPDATE PROFILE 



  // 🔥 FETCH PROFILE
  useEffect(() => {
    API.get("/profile/")
      .then((res) => {
        setProfile(res.data);
        setFirstName(res.data.first_name || "");
        setLastName(res.data.last_name || "");
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        setPhoneNo(res.data.phone_no || "");

        const recruiter = res.data.recruiter_profile;

        if (recruiter) {
          setCompanyName(recruiter.company_name || "");
          setWebsite(recruiter.website || "");
          setDescription(recruiter.description || "");
          setIndustry(recruiter.industry || "");
          setLocation(recruiter.location || "");
        }
      })
      .catch(() => toast.error("Failed to load profile ❌"));
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


  // Profile photo
  const displayImage =
    preview ||
    profile?.profile_picture ||
    `https://ui-avatars.com/api/?name=${profile?.username}`;

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

  // 🔥 UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const formData = new FormData();

      // User fields
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone_no", phoneNo);

      // Recruiter profile fields
      formData.append("company_name", companyName);
      formData.append("website", website);
      formData.append("description", description);
      formData.append("industry", industry);
      formData.append("location", location);

      await API.put("/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh profile data
      const res = await API.get("/profile/");
      setProfile(res.data);

      toast.success("Profile Updated Successfully ✅");
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error("Update Failed ❌");
    }
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
      setData(res.data);
      setImageSrc(null);

      toast.success("Profile Photo Updated");

    } catch (err) {
      console.log("UPLOAD ERROR:", err.response?.data || err);
      toast.error("Upload Failed ❌");
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return null;

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
                ? new Date(profile.last_login).toLocaleString()
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

        <hr className="my-6 border-gray-700" />

        {/* BASIC INFO */}
          <div className="grid md:grid-cols-3 gap-20">
              <div></div>
              <div>
                <h3 className="flex-wrap text-xl font-bold mb-3 drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-cyan-300">
                  BASIC INFORMATIONS
                </h3>

                <h2 className="text-left text-white/80 font-bold mt-4">FIRST NAME:</h2>
                <Input value={firstName} setValue={setFirstName} />

                <h2 className="text-left text-white/80 font-bold mt-4">LAST NAME:</h2>
                <Input value={lastName} setValue={setLastName} />

                <h2 className="text-left text-white/80 font-bold mt-4">USERNAME:</h2>
                <Input value={username} setValue={setUsername} />

                <h2 className="text-left text-white/80 font-bold mt-4">EMAIL:</h2>
                <Input value={email} setValue={setEmail} />

                <h2 className="text-left text-white/80 font-bold mt-4">PHONE NUMBER:</h2>
                <Input value={phoneNo} setValue={setPhoneNo} />
              </div>
            <div></div>
          </div>

        <hr className="my-6 border-gray-700" />

        <div className="text-left text-cyan-400 font-bold mt-10">
          
          <h2 className="text-white/80 font-bold">COMPANY NAME:</h2>
            <Input value={companyName} setValue={setCompanyName} />
          

          <h2 className="text-white/80 font-bold mt-5">WEBSITE:</h2>
            <Input value={website} setValue={setWebsite} />

          <h2 className="text-white/80 font-bold mt-5">INDUSTRY:</h2>
            <Input value={industry} setValue={setIndustry} />
          
          <h2 className="text-white/80 font-bold mt-5">LOCATION:</h2>
            <Input value={location} setValue={setLocation} />

          <h2 className="text-white/80 font-bold mt-5">DESCRIPTION:</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[125px] p-3 mt-1 bg-black border border-cyan-400 rounded"
            />

        </div>

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

const Input = ({ label, value, setValue }) => (
  <div>
    <label>{label}</label>
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full p-2 mt-1 bg-black border border-cyan-400 rounded"
    />
  </div>
);

export default RecruiterProfile;