import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 
import API from "../../api/axios";
import toast from "react-hot-toast";


function AdminProfile() {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [data, setData] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    API.get("/admin/profile/")
      .then(res => {
        setData(res.data);
        setForm(res.data);
      });
  }, []);


  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      // ✅ ADD THIS LINE
      if (imageFile) {
        formData.append("profile_picture", imageFile);
      }

      await API.patch("/admin/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile Updated 🚀");
      setEdit(false);

      // refresh data
      const res = await API.get("/admin/profile/");
      setData(res.data);
      setPreview(null);

    } catch {
      toast.error("Update Failed ❌");
    }
  };


  const handleChangePassword = async () => {
    
    if (passwords.new_password.length < 6) {
      toast.error("Password Too Short ⚠️");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("Passwords Do Not Match ❌");
      return;
    }


    try {
      await API.post("/change-password/", {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });

      toast.success("Password Updated 🔐");

      setPasswords({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch {
      toast.error("Password Update Failed ❌");
    }
  };


  if (!data) return null;

  return (
    <MainLayout>
      <div className="w-full mx-auto mt-10 p-6 rounded-2xl border border-cyan-400 bg-[#0000003b] shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-6">

          {/* IMAGE */}
          <label htmlFor="profileUpload" className="cursor-pointer">
            <img
              src={preview || data.profile_picture || "https://via.placeholder.com/120"}
              className="w-28 h-28 mx-auto rounded-full border-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] border-cyan-400 hover:scale-105 transition duration-300"
              alt=""
              />
          </label>

          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />  

          <h2 className="text-2xl font-bold hover:scale-105 text-black rounded-xl font-bold text-center transition duration-300 mt-2 drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
            {data.first_name} {data.last_name}
          </h2>

          <p className="text-gray-400">@{data.username}</p>

          <span className="mt-2 inline-block px-3 py-1 bg-[#0000003b] border-2 border-cyan-400 text-cyan-400 rounded text-sm font-bold">
            ADMIN
          </span>
        </div>

        {/* DETAILS */}
        <div className="max-w-2xl mx-auto max-w-[250px] space-y-4">

          <div className="text-sm text-gray-300 space-y-1 mb-4 text-center">

            <p>
              <span className="text-cyan-400 font-semibold">Last Login: </span>
              {data.last_login
                ? new Date(data.last_login).toLocaleString()
                : "Never"}
            </p>

            <p>
              <span className="text-cyan-400 font-semibold">Date Joined: </span>
              {data.date_joined
                ? new Date(data.date_joined).toLocaleString()
                : "N/A"}
            </p>

          </div>

          <input
            value={form.first_name || ""}
            onChange={(e) => setForm({...form, first_name: e.target.value})}
            disabled={!edit}
            className="w-full p-2 bg-black/40 border border-cyan-400 rounded"
            placeholder="First Name"
          />

          <input
            value={form.last_name || ""}
            onChange={(e) => setForm({...form, last_name: e.target.value})}
            disabled={!edit}
            className="w-full p-2 bg-black/40 border border-cyan-400 rounded"
            placeholder="Last Name"
          />

          <input
            value={form.phone_no || ""}
            onChange={(e) => setForm({...form, phone_no: e.target.value})}
            disabled={!edit}
            className="w-full p-2 bg-black/40 border border-cyan-400 rounded"
            placeholder="Phone"
            />
            </div>

          
          {/* 🔐 CHANGE PASSWORD */}
          <div className="max-w-[500px] mx-auto mt-8 p-4 border border-cyan-400 rounded-xl bg-black/40">

            <h3 className="text-cyan-400 text-center font-bold mb-4">
             Change Password
            </h3>

            {/* OLD PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Old Password"
                value={passwords.old_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, old_password: e.target.value })
                }
                className="w-full p-2 mb-2 bg-black border border-cyan-400 rounded pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-cyan-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
                className="w-full p-2 mb-2 bg-black border border-cyan-400 rounded pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-cyan-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={passwords.confirm_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm_password: e.target.value })
                }
                className="w-full p-2 mb-4 bg-black border border-cyan-400 rounded pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-cyan-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full bg-cyan-500 border border-2 border-black hover:border-cyan-500 text-black hover:bg-[#0000003b] hover:text-cyan-500 py-2 rounded font-bold"
            >
              Update Password
            </button>

          </div>

          

        {/* ACTIONS */}
        <div className="max-w-2xl mx-auto max-w-[250px] flex gap-4 mt-6">

          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="w-full bg-purple-500 border border-2 border-black hover:border-purple-500 text-black hover:bg-[#0000003b] hover:text-purple-500 py-2 rounded font-bold"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="w-full bg-green-500 hover:bg-green-400 py-2 rounded font-bold"
              >
                Save
              </button>

              <button
                onClick={() => setEdit(false)}
                className="w-full bg-gray-500 py-2 rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default AdminProfile;