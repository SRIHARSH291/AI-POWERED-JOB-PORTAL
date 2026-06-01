import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

// ICONS 
import {
  FaHome,
  FaBriefcase,
  FaBookmark,
  FaUser,
  FaUsers,
  FaPlus,
  FaBars,
  FaTimes,
  FaSuitcase,
  FaPaperclip,
  FaIdCardAlt,
  FaIdCard,
  FaUserPlus,
  FaRegIdCard,
  FaPaperPlane,
  FaRecycle
} 
from "react-icons/fa";
import AdminApplications from "../../features/Admin/AdminApplications";

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const links = {
    job_seeker: [
      { name: "OVERVIEW", path: "/dashboard", icon: <FaHome /> },
      { name: "JOBS", path: "/jobs", icon: <FaBriefcase /> },
      { name: "APPLIED JOBS", path: "/applied-jobs", icon: <FaSuitcase /> },
      { name: "SAVED JOBS", path: "/saved", icon: <FaBookmark /> },
      { name: "PROFILE", path: "/profile", icon: <FaUser /> },
    ],
    recruiter: [
      { name: "OVERVIEW", path: "/dashboard", icon: <FaHome /> },
      { name: "POST JOB", path: "/post-job", icon: <FaPlus /> },
      { name: "TOTAL JOBS", path: "/my-jobs", icon: <FaSuitcase/> },
      { name: "APPLICANTS", path: "/applicants", icon: <FaUsers /> },
      { name: "PROFILE", path: "/profile", icon: <FaUser /> },
    ],
    admin: [
      { name: "OVERVIEW", path: "/dashboard", icon: <FaHome /> },
      { name: "USERS", path: "/admin/users", icon: <FaUsers /> },
      { name: "INVITE", path: "/admin/invite", icon: <FaUserPlus />},
      { name: "ADD USER", path: "/admin/adduser", icon: <FaPlus /> },
      { name: "JOBS", path: "/admin/jobs", icon: <FaBriefcase /> },
      { name: "APPLICATIONS", path: "/admin/applications", icon: <FaPaperPlane />},
      { name: "RECYCLE BIN", path: "/admin/recycle-bin", icon: <FaRecycle /> },
    ],
  };

  const role = user?.user_type || localStorage.getItem("role") || "job_seeker";
  const currentLinks = links[role] || links["job_seeker"];
  

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const sidebarWidth = isOpen ? "w-64" : "w-20";
  
  // ✅ SAFE INDEX
  const activeIndex = currentLinks.findIndex(
    (l) => l.path === location.pathname
  );

  return (
    <>
      {/* 🔥 MOBILE TOP BAR - ONLY VISIBLE ON MOBILE */}
    <div className="md:hidden fixed top-22 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-black/95 backdrop-blur-lg border-b border-cyan-400/30 shadow-lg">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-cyan-400/10 transition-colors active:scale-95"
          >
          {mobileOpen ? <FaTimes className="text-cyan-400 text-xl" /> : <FaBars className="text-cyan-400 text-xl" />}
        </button>
        <h1 className="text-cyan-400 font-bold text-lg tracking-wide">Dashboard</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}

      {/* 🔥 MOBILE SIDEBAR - DROPS DOWN FROM TOP */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              />
            
            {/* Dropdown menu from top */}
            <motion.div
              initial={{ y: -400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed top-14 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-cyan-400/30 z-40 md:hidden shadow-2xl"
              >
              <div className="flex flex-col py-2 max-h-[calc(100vh-70px)] overflow-y-auto">
                {currentLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  
                  return (
                    <Link key={index} to={link.path} onClick={() => setMobileOpen(false)}>
                      <motion.div
                        whileHover={{ x: 10, backgroundColor: "rgba(0, 221, 255, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#0000003b] font-bold cursor-pointer transition ${
                          isActive 
                          ? "drop-shadow-[0_0_5px_rgba(34,211,238,1)] bg-cyan-400/20 text-black border-cyan-400"
                          : "drop-shadow-[0_0_5px_rgba(34,211,238,1)] bg-white/5 text-black border-black hover:text-cyan-400 hover:border-cyan-400"
                        }`}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span className="font-medium">{link.name}</span>
                        {isActive && (
                          <motion.div
                          layoutId="mobileActiveDot"
                          className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
                
                {/* User info section in mobile menu */}
                <div className="mt-4 pt-4 border-t border-cyan-400/20 mx-3">
                  <div className="px-4 py-3 text-xs text-gray-400 text-center">
                    <p className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold">
                      © B⚡H AI BRIGHT SKILL HUB
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>

      {/* Spacer for mobile fixed top bar */}
      <div className="md:hidden h-[57px]"></div>

      {/* 🔥 DESKTOP SIDEBAR - FULLY VISIBLE ON DESKTOP */}
      <div
        className={`${sidebarWidth} hidden md:flex flex-col min-h-screen 
        bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-xl border-r border-cyan-400/20 
        transition-all duration-300 fixed left-0 top-22 z-30 shadow-2xl`}
      >
        {/* HEADER with Dashboard Title */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-400/20">
          {isOpen && (
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-cyan-400 font-bold text-xl tracking-wide bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h2>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-cyan-400/10 transition-colors hover:scale-110"
          >
            <FaBars className="text-cyan-400 text-lg" />
          </button>
        </div>

        {/* LINKS with proper spacing */}
        <div className="flex flex-col gap-2 px-3 py-6 relative flex-1">
          {/* 🔥 ACTIVE GLOW BAR */}
          <motion.div
            layoutId="activeTab"
            className="absolute left-1 w-1 h-12 bg-cyan-400 rounded-full"
            animate={
            { top: activeIndex * 55 + 25 }            
          }
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />

          {currentLinks.map((link, index) => {
            const isActive = location.pathname === link.path;

            return (
              <Link key={index} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#0000003b] font-bold cursor-pointer transition 
                    ${
                      isActive
                        ? "drop-shadow-[0_0_5px_rgba(34,211,238,1)] bg-cyan-400/20 text-black border-cyan-400"
                        : "drop-shadow-[0_0_5px_rgba(34,211,238,1)] bg-white/5 text-black border-black hover:text-cyan-400 hover:border-cyan-400"
                    }
                  `}
                >
                  <span className={`text-xl ${isActive ? "text-black" : ""}`}>
                    {link.icon}
                  </span>

                  {isOpen && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className={`font-bold text-l tracking-wide ${
                        isActive ? "text-black" : ""
                      }`}
                    >
                      {link.name}
                    </motion.span>
                  )}
                  
                  {isActive && isOpen && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* FOOTER */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-auto p-5 border-t border-cyan-400/20"
          >
            <div className="text-xs text-gray-400 text-center space-y-2">
              <p className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold">
                © B⚡H AI
              </p>
              <p className="text-[10px] text-gray-500">
                BRIGHT SKILL HUB
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Desktop main content margin to prevent overlap */}
      <div className="hidden md:block transition-all duration-300" style={{ marginLeft: isOpen ? "16rem" : "5rem" }} />
    </>
  );
}
export default Sidebar;