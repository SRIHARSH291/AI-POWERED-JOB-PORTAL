import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { TypeAnimation } from "react-type-animation";
import Tilt from "react-parallax-tilt";
import HomeMainLayout from "../components/layout/HomeMainLayout.jsx";

function Home() {
  
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <HomeMainLayout>

    <div className="min-h-screen bg-[#252525] text-white flex flex-col items-center justify-center px-6">
    
    <div className="w-full mt-5 h-[2px] bg-white/20"></div>
      
      <div className="overflow-hidden w-full">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          className="whitespace-nowrap"
        >   
          <p className="bg-gradient-to-r mt-5 from-cyan-400 to-red-500 
                   bg-clip-text text-transparent font-bold text-xl">
             ⚡Discover Jobs Tailored to Your Skills • Get AI-Powered Resume Feedback • Apply Instantly • Accelerate Your Career⚡</p>
          </motion.div>
      </div>

      {/* ABOUT SECTION */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl mt-2 md:text-6xl font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] text-center leading-tight text-black"
      >
        Your Career, Supercharged by AI. Stop Searching. Start Getting Hired.      
      </motion.h1>
      

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="gap-6 mt-2 text-center"
      >

        {/* 🔥 REGISTER TEXT */}
        <h2 className="mt-10 font-bold text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] blink-neon">
          TO GET STARTED WITH{" "}
          <span className="text-transparent bg-cyan-400 bg-clip-text">
            ' B⚡H AI BRIGHT SKILL HUB '
          </span>, REGISTER & SEARCH FOR YOUR DREAM JOB
        </h2>

        {/* 🔥 REGISTER BUTTON */}
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 mt-2 blink-neon bg-white/5 hover:shadow-lg hover:shadow-cyan-400/50 font-bold text-black backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400 hover:border-cyan-400/40"
          >
            REGISTER
          </motion.button>
        </Link>

        {/* 🔥 LOGIN TEXT */}
        <h2 className="mt-5 font-bold text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] blink-neon">
          ALREADY HAVE AN ACCOUNT IN{" "}
          <span className="text-transparent bg-cyan-400 bg-clip-text">
            ' B⚡H AI BRIGHT SKILL HUB '
          </span>, PLEASE SIGN IN
        </h2>

        {/* 🔥 LOGIN BUTTON */}
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 mt-2 blink-neon bg-white/5 hover:shadow-lg hover:shadow-cyan-400/50 font-bold text-black backdrop-blur-xl border border-black border-2 p-6 text-center transition duration-300 hover:bg-[#0000003b] hover:text-cyan-400 hover:border-cyan-400/40"
          >
            LOGIN
          </motion.button>
        </Link>
      </motion.div>


      <div className="overflow-hidden w-full">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          className="whitespace-nowrap"
        >   
          
          </motion.div>
      </div>


    <div className="w-full h-[2px] mt-10 bg-white/20 my-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl mt-5 font-bold text-center leading-tight"
      >
        <TypeAnimation
          sequence={[
            "•Get Hired Faster•",
            2500,
            "•Find Your Dream Job•",
            2500,
            "•Let AI Work For You•",
            2500,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          className="bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-black hover:to-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] transition"
           />
      </motion.h1>
    </div>


      <p className="text-l text-black font-bold mt-20 drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 tracking-wide text-center">
        • BUILT FOR MODERN JOB SEEKERS • POWERED BY INTELLIGENT AUTOMATION •
      </p>

      
      <div className="w-full h-[2px] bg-white/20 my-6"></div>
      
      {/* ABOUT SECTION */}
          
      <div className="grid md:grid-cols-3 gap-6">
        <p></p>
        <h1 className="text-3xl items-center text-center w-80 text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 transition duration-300 hover:scale-110  font-bold mt-5 mb-5">ABOUT US</h1>
        <p></p>
      </div>

        <h2 className="text-xl font-bold mt-5 mb-2">
          FEATURES
        </h2>
      <div className="grid md:grid-cols-3 gap-6 rounded-2xl w-full max-w-5xl">
       <Tilt
        glareEnable={true}
        glareMaxOpacity={0.3}
        scale={1.05}
        transitionSpeed={2000}
      >      
        <motion.div
          whileHover={{ x: -5, y: -5 }}
          className="bg-white/5 backdrop-blur-xl border border-black border-2 p-6 text-center 
           transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40"
        >
          <h3 className="text-lg hover:shadow-lg rounded-2xl hover:shadow-cyan-400/50 font-bold text-cyan-400" >AI MATCHING</h3>
          <p className="text-white font-bold mt-2 text-sm">
            Our intelligent system analyzes your skills and matches you with the most relevant opportunities instantly.
          </p>
        </motion.div>
        </Tilt>

      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.3}
        scale={1.05}
        transitionSpeed={2000}
      >      
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white/5 backdrop-blur-xl border border-black border-2 p-6 text-center 
           transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40"
        >
          <h3 className="text-lg hover:shadow-lg rounded-2xl hover:shadow-cyan-400/50 font-bold text-cyan-400">ONE CLICK APPLY</h3>
          <p className="text-white font-bold mt-2 text-sm">
            Skip lengthy applications — apply to multiple jobs in seconds with a single click.
          </p>
        </motion.div>
        </Tilt>

      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.3}
        scale={1.05}
        transitionSpeed={2000}
      >      
        <motion.div
          whileHover={{ x: 5, y: -5 }}
          className="bg-white/5 backdrop-blur-xl border border-black border-2 p-6 text-center 
           transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40"
        >
          <h3 className="text-lg hover:shadow-lg rounded-2xl hover:shadow-cyan-400/50 font-bold text-cyan-400">RESUME INSIGHTS</h3>
          <p className="text-white font-bold mt-2 text-sm">
          Get real-time AI feedback, score your resume, and optimize it to stand out to recruiters.
          </p>
        </motion.div>
        </Tilt>

      </div>


      {/* “HOW IT WORKS” SECTION */}      
      <div className="mt-10 max-w-5xl w-full text-center">
        <h2 className="text-xl font-bold mb-2">
          WORKING
        </h2>
        <div className="grid md:grid-cols-3 gap-6">

      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.3}
        scale={1.05}
        transitionSpeed={2000}
      >      
          <motion.div
          whileHover={{ x: -5, y: 5 }}
          className="bg-white/5 backdrop-blur-xl border border-black border-2 p-6 text-center 
           transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40"
          >
            <h3 className="font-bold hover:shadow-lg rounded-2xl hover:shadow-cyan-400/50 text-cyan-400 text-lg">1. Create Profile</h3>
            <p className="text-white font-bold mt-2 text-sm">
              Sign up and build your profile with your skills and experience.
            </p>
          </motion.div>
          </Tilt>

      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.3}
        scale={1.05}
        transitionSpeed={2000}
      >      
          <motion.div
          whileHover={{ y: 5 }}
          className="bg-white/5 backdrop-blur-xl border border-black border-2 p-6 text-center 
           transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40"
          >
            <h3 className="font-bold hover:shadow-lg rounded-2xl hover:shadow-cyan-400/50 text-cyan-400 text-lg">2. AI Matches Jobs</h3>
            <p className="text-white font-bold mt-2 text-sm">
              Our AI finds the best jobs tailored specifically for you.
            </p>
          </motion.div>
          </Tilt>

      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.3}
        scale={1.05}
        transitionSpeed={2000}
      >      
          <motion.div
          whileHover={{ x: 5, y: 5 }}
          className="bg-white/5 backdrop-blur-xl border border-black border-2 p-6 text-center 
           transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40"
          >
            <h3 className="font-bold hover:shadow-lg rounded-2xl hover:shadow-cyan-400/50 text-cyan-400 text-lg">3. Apply Instantly</h3>
            <p className="text-white font-bold mt-2 text-sm">
              Apply with one click and track your applications easily.
            </p>
          </motion.div>
          </Tilt>
        </div>
      </div>

      
      <div className="overflow-hidden w-full">
          <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          className="whitespace-nowrap"
          >   
          <p className="bg-gradient-to-r mt-5 from-cyan-400 to-red-500 
                   bg-clip-text text-transparent font-bold text-xl">
             ⚡Discover Jobs Tailored to Your Skills • Get AI-Powered Resume Feedback • Apply Instantly • Accelerate Your Career⚡</p>
          </motion.div>
      </div>


      <div className="w-full h-[2px] mt-5 bg-white/20 my-6"></div>
    </div>
        
        {/* FOOTER */}
        {isOpen && (
          <div className="flex p-2 text-sm text-gray-400 justify-center items-center gap-10">
            
            <Link to="/">
             <img
               src={logo}
               alt="logo"
               className="w-12 h-12 object-contain drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:scale-110 transition"
             />
            </Link>           
            
            
            <p className="bg-black bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(34,211,238,1)] transition duration-300 hover:scale-105 font-bold ">
            © B⚡H AI BRIGHT SKILL HUB
            </p>

            <a
              className="bg-black bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-cyan-400 transition duration-300 hover:scale-105 font-bold " 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=bsh.ai.bright.skill.hub@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              🖂 : bsh.ai.bright.skill.hub@gmail.com
            </a>

          </div>

        )}

</HomeMainLayout>
  );
}

export default Home;