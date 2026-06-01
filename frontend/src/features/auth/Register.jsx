import { useState } from "react";
import API from "../../api/axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import toast from "react-hot-toast";

function Register() {

  const [data, setData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    password: "",
    user_type: "job_seeker",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const registerPromise = API.post("/register/", data);

  toast.promise(registerPromise, {
    loading: "Creating Account...",
    success: "Account Created Successfully 🎉",
    error: "Registration Failed ❌",
  });

  try {
    await registerPromise;

    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);

  } catch (error) {
    if (error.response?.data) {
    if (typeof error.response.data === "string") {
      toast.error("Server Error ⚠️");
      console.error(error.response.data); // debug in console
    } else {
      const msg = Object.values(error.response.data).flat().join(", ");
      toast.error(msg);
    }
  }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#414141] text-white flex flex-col items-center justify-center px-6">

      {/* REGISTER CARD */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 mt-10 mb-10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >

        <h2 className="text-3xl text-cyan-400 font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* USERNAME */}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
        />

        {/* FIRST + LAST NAME */}
        <div className="grid md:grid-cols-2 gap-2">
          <input
            name="firstname"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
          />

          <input
            name="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
          />
        </div>

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
        />

        {/* PHONE NO. */}
          <input
            name="phone_no"
            type="phone"
            placeholder="Phone No."
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
          />

        {/* PASSWORD WITH TOGGLE */}
        <div className="relative mb-4">
          <input
            name="password"
            type={showPassword ? "text" : "password"} 
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
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

        {/* USER TYPE */}
        <select
          name="user_type"
          onChange={handleChange}
          className="w-full mb-10 p-3 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
        >
          <option className="bg-black" value="job_seeker">Job Seeker</option>
          <option className="bg-black" value="recruiter">Recruiter</option>
        </select>

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-white/5 hover:shadow-lg hover:shadow-cyan-400/50 font-bold text-black backdrop-blur-xl border border-cyan-400 border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400 hover:border-cyan-400/40"
        >
          {loading ? "Creating..." : "REGISTER"}
        </motion.button>

        <p className="text-center mt-5 mb-1 text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,1)]">Already have an Account</p>
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
           className="w-full py-3 rounded-lg bg-white/5 hover:shadow-lg hover:shadow-cyan-400/50 font-bold text-black backdrop-blur-xl border border-cyan-400 border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400 hover:border-cyan-400/40"
          >
           SIGN IN
          </motion.button>
        </Link>

      </motion.form>
    </div>
  );
}

export default Register;