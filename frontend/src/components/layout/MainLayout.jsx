import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  // Sidebar collapse state
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#353535] text-white text-center">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main Area */}
      <div className="flex flex-1 bg-[#252525] text-white">
        {/* ================= SIDEBAR ================= */}
        {/* Fixed height with independent scrolling */}
        <div className="sticky top-[96px] h-[calc(100vh-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-transparent">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex flex-col flex-1 min-h-[calc(100vh-88px)] px-4 transition-all duration-300">
          {/* Page Content */}
          <div className="w-full flex-1 overflow-x-hidden pt-[96px] md:pt-0 px-2 sm:px-4">
            {children}
          </div>

          {/* Footer */}
          {isOpen && (
            <div className="flex p-2 text-sm bg-[#353535] justify-center items-center gap-10 mt-4">
              <Link to="/">
                <img
                  src={logo}
                  alt="logo"
                  className="w-12 h-12 object-contain drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:scale-110 transition"
                />
              </Link>

              <p className="bg-black bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(34,211,238,1)] transition duration-300 hover:scale-105 font-bold">
                © B⚡H AI BRIGHT SKILL HUB
              </p>

              <a
                className="bg-black bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-cyan-400 transition duration-300 hover:scale-105 font-bold"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=bsh.ai.bright.skill.hub@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                🖂 : bsh.ai.bright.skill.hub@gmail.com
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;