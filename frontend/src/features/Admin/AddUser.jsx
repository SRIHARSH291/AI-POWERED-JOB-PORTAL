import MainLayout from "../../components/layout/MainLayout";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; 
import API from "../../api/axios";
import toast from "react-hot-toast";

function AddUser() {

  const [data, setData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_no: "",
    user_type: "job_seeker"
  });

  const [showPassword, setShowPassword] = useState(false); 

  const submit = async (e) => {
  e.preventDefault();
  
  if (!data.username || !data.password || !data.email) {
    return toast.error("Fill all required fields");
  }

  try {
    const res = await API.post("/admin/create-user/", data);
    toast.success("User Created");
  } catch (err) {
    console.log(err.response?.data);   // 🔥 SEE ACTUAL ERROR
    toast.error("Failed to Create User ❌");
  }
};

  return (
    <MainLayout>
     <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

      <div className="grid md:grid-cols-3">
        <p></p>
        <h2 className="text-4xl items-center text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mt-5 mb-10">ADD USERS</h2>
        <p></p>
      </div>
      
      <div className="flex justify-center items-center min-h-[80vh]">
            <motion.form
                onSubmit={submit} 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/20 mt-10 mb-10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md"
            >

                <input  
                placeholder="Username" onChange={e => setData({...data, username: e.target.value})} 
                className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]" 
                />

                <input
                placeholder="First Name" onChange={(e) => setData({ ...data, first_name: e.target.value })}
                className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
               
                />
              
                <input
                placeholder="Last Name" onChange={(e) => setData({ ...data, last_name: e.target.value })}
                className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
                />


                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" onChange={e => setData({...data, password: e.target.value})}
                    required
                    className="input w-full p-3 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
                  />

                  {/* TOGGLE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-cyan-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
             
                <input 
                placeholder="Email" onChange={e => setData({...data, email: e.target.value})} 
                className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
                />
                <input 
                  placeholder="Phone" onChange={e => setData({...data, phone_no: e.target.value})}
                  className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
                />

            <select 
            onChange={e => setData({...data, user_type: e.target.value})}
            className="input w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
            >
                <option value="job_seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
            </select>

            <button
            className="mt-10 px-5 py-2 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000000b] border-2 transition text-black border-cyan-400 bg-white/10 text-black hover:border-black hover:text-cyan-400">Create User</button>

            </motion.form>
      </div>

    </div>
    </MainLayout>
  );
}

export default AddUser;