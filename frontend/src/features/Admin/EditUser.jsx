import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";

function EditUser() {
  const { id } = useParams();

  const [data, setData] = useState({
    username: "",
    first_name:"",
    last_name:"",
    email: "",
    user_type: "",
    phone_no: "",
  });

  // 🔥 LOAD USER DATA
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/admin/users/${id}/`);
      setData(res.data);
    } catch (err) {
      toast.error("❌ Failed to Load User");
    }
  };

  // 🔥 UPDATE USER
  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.patch(`/admin/update-user/${id}/`, data);
      toast.success("✅ User Updated Successfully");
    } catch (err) {
      toast.error("❌ Update Failed");
    }
  };

  return (
    <MainLayout>
      <div className="w-full mt-5 mb-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

    <div className="grid md:grid-cols-3">
    
         <p></p>
         
         <div>
         <h2 className="text-4xl items-center text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mt-5 mb-10">EDIT USER</h2>

            <motion.form
                onSubmit={submit} 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/20 mt-10 mb-10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md"
                > 
          <input
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="w-full p-3 bg-black text-cyan-400 border border-cyan-600 rounded"
            placeholder="Username"
          />
          
          <input
            value={data.first_name}
            onChange={(e) => setData({ ...data, first_name: e.target.value })}
            className="w-full mt-5 p-3 bg-black text-cyan-400 border border-cyan-600 rounded"
            placeholder="First Name"
            />
          
          <input
            value={data.last_name}
            onChange={(e) => setData({ ...data, last_name: e.target.value })}
            className="w-full mt-5 p-3 bg-black text-cyan-400 border border-cyan-600 rounded"
            placeholder="Last Name"
            />

          <input
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full mt-5 p-3 bg-black text-cyan-400 border border-cyan-600 rounded"
            placeholder="Email"
            />

          <input
            value={data.phone_no}
            onChange={(e) => setData({ ...data, phone_no: e.target.value })}
            className="w-full mt-5 p-3 bg-black text-cyan-400 border border-cyan-600 rounded"
            placeholder="Phone"
            />

          <select
            value={data.user_type}
            onChange={(e) => setData({ ...data, user_type: e.target.value })}
            className="w-full mt-5 p-3 bg-black text-cyan-400 border border-cyan-600 rounded"
            >
            <option value="job_seeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button
            className="mt-20 px-5 py-2 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000000b] border-2 transition text-black border-cyan-400 bg-white/10 text-black hover:border-black hover:text-cyan-400"
          >
            SAVE CHANGES
          </button>

        </motion.form>
        </div>
        
        <p></p>
    </div>
      </div>
    </MainLayout>
  );
}

export default EditUser;

