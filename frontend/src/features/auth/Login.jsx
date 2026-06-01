import { useState } from "react";
import API from "../../api/axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import toast from "react-hot-toast";

function Login() {

  const [data, setData] = useState({
    username: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      const loginPromise = API.post("/login/", data);

      toast.promise(loginPromise, {
        loading: "Logging In...",
        success: "Welcome Back👋",
        error: "Invalid credentials ❌",
      });

      try {
        const res = await loginPromise;

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // ✅ fetch role
      const profile = await API.get("/profile/");
      localStorage.setItem("role", profile.data.user_type);

      toast.success("Login Successful!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (err) {
      toast.error("❌ Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#414141] text-white flex flex-col items-center justify-center px-6">

      {/* LOGIN CARD */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-lg border border-cyan-400/40 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >

        <h2 className="text-3xl text-cyan-400 font-bold mb-6 text-center">
          Welcome Back 
        </h2>

        {/* USERNAME */}
        <input
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 text-cyan-400 font-bold rounded-lg bg-black border border-2 border-cyan-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017ff]"
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


        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full mb-5 py-3 rounded-lg bg-white/5 hover:shadow-lg hover:shadow-cyan-400/50 font-bold text-black backdrop-blur-xl border border-cyan-400 border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400 hover:border-cyan-400/40"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </motion.button>


        <p className="text-center mb-1 text-red-500/80 drop-shadow-[0_0_5px_rgba(239,68,68,1)]">Not Registed, Create an Account</p>
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-lg bg-white/5 hover:shadow-lg hover:shadow-cyan-400/50 font-bold text-black backdrop-blur-xl border border-cyan-400 border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400 hover:border-cyan-400/40"
          >
            SIGN UP
          </motion.button>
        </Link>
      </motion.form>

    </div>
  );
}

export default Login;