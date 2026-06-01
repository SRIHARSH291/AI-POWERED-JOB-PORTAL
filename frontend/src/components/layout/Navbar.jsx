import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../api/axios";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // USER STATE
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recruiterDropdown, setRecruiterDropdown] = useState(false);

  // SEARCH STATE
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  // LOGIN CHECK
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token && token !== "undefined";


  const [showNotif, setShowNotif] = useState(false);
  
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isLoggedIn || role === "admin") return;

    API.get("/notifications/")
      .then(res => setNotifications(res.data || []))
      .catch(() => setNotifications([]));
  }, [isLoggedIn, role]);

  // DEBOUNCE SEARCH
  useEffect(() => {
    if (!isLoggedIn || role === "admin") return;
    const delay = setTimeout(() => {
      if (!searchText) {
        setSuggestions([]);
        return;
      }

      API.get("/job-search/", {
        params: { q: searchText }
      })
        .then((res) => {
          setSuggestions(res.data.slice(0, 5)); // top 5 suggestions
        })
        .catch(() => {});
    }, 400); // debounce time

    return () => clearTimeout(delay);
  }, [searchText, isLoggedIn, role]);


  // SAVE RECENT SEARCH
  const handleSearch = () => {
    if (!searchText) return;

    const updated = [searchText, ...recentSearches.filter(i => i !== searchText)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    navigate(`/jobs?q=${searchText}`);
  };

  
  // SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FETCH USER
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await API.get("/profile/");
        setUser(res.data);
      } catch (err) {
        console.log("Navbar error:", err);
        localStorage.clear();
      }
    };

    fetchUser();
  }, [token]);

  // NAV LINKS
  const navLinks = !isLoggedIn
    ? [
        { name: "HOME", path: "/" },
        { name: "LOGIN", path: "/login" },
        { name: "REGISTER", path: "/register" },
      ]
    : role === "recruiter"
    ? [
        { name: "HOME", path: "/" },
        { name: "DASHBOARD", path: "/dashboard" },
        { name: "POST JOB", path: "/post-job" },
        { name: "TOTAL JOBS", path: "/my-jobs" },
        { name: "APPLICANTS", path: "/applicants" },
        { name: "PROFILE", path: "/profile" },
        
        
      ]
    : role === "admin"
    ? [
        { name: "HOME", path: "/" },
        { name: "DASHBOARD", path: "/dashboard" },
        { name: "USERS", path: "/admin/users" },
        { name: "JOBS", path: "/admin/jobs" },
        { name: "APPLICATIONS", path: "/admin/applications" },
        { name: "PROFILE", path: "/admin/profile"}
      ]

    : [
        { name: "HOME", path: "/" },
        { name: "DASHBOARD", path: "/dashboard" },
        { name: "JOBS", path: "/jobs" },
        { name: "APPLIED JOBS", path: "/applied-jobs" },
        { name: "SAVED JOBS", path: "/saved" },
        { name: "PROFILE", path: "/profile" },
      ];

  // ✅ LOGOUT
  const handleLogout = () => {
    toast.success("Logged Out Successfully 👋");

    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`sticky top-0 z-50 ${
        isScrolled ? "backdrop-blur-2xl bg-black/40" : ""
      }`}
    >
      <nav className="flex items-center hover:bg-[#0000003b] justify-between px-8 py-3 bg-white/5 backdrop-blur-xl border border-black shadow-lg">

        {/* LOGO */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="w-20 h-20 object-contain drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:scale-110 transition"
            />
          </Link>
        </div>

        {/* 🔥 CENTER - NAV LINKS */}
        <div className="hidden md:flex gap-6 justify-center flex-1 items-center">
          {navLinks.map((item, index) => (
            <motion.div key={index} whileHover={{ scale: 1.1, y: -2 }}>
              <Link
                to={item.path}
                className={`relative group px-4 py-2 font-bold hover:bg-[#0000003b] border-2 transition
                ${
                  location.pathname === item.path
                    ? "drop-shadow-[0_0_5px_rgba(34,211,238,1)] bg-cyan-400/20 text-black border-cyan-400"
                    : "bg-white/5 text-black border-black hover:text-cyan-400 hover:border-cyan-400"
                }`}
              >
                {item.name}
                
                {/* UNDERLINE */}
                 <span
                   className={`absolute left-0 -bottom-4 h-[2px] bg-cyan-400 transition-all duration-300
                   ${
                     location.pathname === item.path
                       ? "w-full"
                       : "w-0 group-hover:w-full"
                   }`}
                 />

                 {/* TRIANGLE */}
                 <span
                   className={`absolute left-1/2 -translate-x-1/2 -bottom-5 text-cyan-400
                   ${
                     location.pathname === item.path
                       ? "opacity-100"
                       : "opacity-0 group-hover:opacity-100"
                   }`}
                 >
                   ▲
                 </span>

              </Link>
            </motion.div>
          ))}

          {role === "admin" && (
          <motion.div whileHover={{ scale: 1.1, y: -2 }} className="relative">

            <button
              onClick={() => setRecruiterDropdown(!recruiterDropdown)}
              className={`relative group px-4 py-[7px] font-bold border-2 transition
              ${
                location.pathname.includes("/admin/recruiter")
                  ? "drop-shadow-[0_0_5px_rgba(34,211,238,1)] bg-cyan-400/20 text-black border-cyan-400"
                  : "bg-white/5 text-black border-black hover:text-cyan-400 hover:border-cyan-400"
              }`}
            >
              RECRUITER ▾

              {/* UNDERLINE */}
              <span className="absolute left-0 -bottom-3.5 h-[1.5px] bg-cyan-400 w-0 group-hover:w-full transition-all duration-300" />

              {/* TRIANGLE */}
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 text-cyan-400 opacity-0 group-hover:opacity-100">
                ▲
              </span>
            </button>

            {recruiterDropdown && (
              <div className="absolute top-12 bg-black border border-cyan-400 rounded shadow-lg z-50 min-w-[100px]">

                <Link
                  to="/admin/recruiters-insigths"
                  onClick={() => setRecruiterDropdown(false)}
                  className="block px-4 py-2 font-bold text-s text-cyan-400 hover:text-black hover:bg-cyan-400/50"
                >
                  INSIGHTS
                </Link>

                <Link
                  to="/admin/recruiters-performance"
                  onClick={() => setRecruiterDropdown(false)}
                  className="block px-4 py-2 font-bold text-s text-cyan-400 hover:text-black hover:bg-cyan-400/50"
                >
                  PERFORMANCE
                </Link>

              </div>
            )}
          </motion.div>
        )}

      </div>

        {/* NOTIFICATION BELL */}
        {isLoggedIn && role !== "admin" && (
        <div 
          className="relative px-1 py-1 mr-2 rounded-xl hover:bg-[#363636] bg-black text-cyan-400 border border-cyan-400 cursor-pointer"
          onClick={() => setShowNotif(prev => !prev)}
        >

          {/* ICON */}
          <span className="text-xl">🔔</span>

          {/* NOTIFICATION COUNT BADGE */}
          {notifications?.filter(n => !n.is_read).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full font-bold">
              {notifications?.filter(n => !n.is_read).length}
            </span>
          )}
        </div>
        )}

          {showNotif && (
          <div className="absolute right-0 mt-[345px] mr-64 w-80 h-[300px] bg-black border border-cyan-400 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">

            {notifications.length === 0 ? (
              <p className="p-4 text-gray-400 text-sm">
                No Notifications 
              </p>
            ) : (

              notifications.map(n => (
                <div 
                  key={n.id}
                  onClick={async () => {
                    await API.patch(`/notifications/${n.id}/read/`);

                    setNotifications(prev =>
                      prev.map(notif =>
                        notif.id === n.id
                          ? { ...notif, is_read: true }
                          : notif
                      )
                    );

                    // 🔥 REDIRECT TO CHAT
                    if (n.link) {
                      navigate(n.link);
                      setShowNotif(false);
                    }
                  }}
                  className={`p-3 border-b font-bold border-white/10 text-sm hover:text-black hover:bg-blue-500/80 cursor-pointer
                    ${!n.is_read ? "bg-gray-400/30" : ""}`}
                >
                  {n.message}
                  <p className="text-xs font-bold text-cyan-500 hover:text-black mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* SEARCH BAR */}
        {isLoggedIn && role !== "admin" && (
        <div className="hidden md:block relative mr-2 ">
  
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search..."
            className="px-4 pr-10 py-1 rounded-xl hover:bg-[#363636] bg-black text-cyan-400 border border-cyan-400 focus:outline-none w-52"
            />

            {/* CLEAR BUTTON */}
            {searchText && (
              <button
                onClick={() => {
                  setSearchText("");
                  setSuggestions([]);
                }}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-400 hover:scale-110"
              >
                ✖
              </button>
            )}
            
          {/* ICON INSIDE */}
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 border-cyan-400 bg-cyan-400/60 rounded-full transform -translate-y-1/2 text-cyan-400 hover:scale-110 hover:bg-[#363636] drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-cyan-800/50"
          >
            🔍
          </button>
        </div>
        )}

        {/* RECENT SEARCHES */}
        {isLoggedIn && role !== "admin" && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute mt-60 right-28 w-60 bg-black border border-cyan-400 rounded-xl text-left">

          {/* 🔥 RECENT SEARCHES */}
          {searchText === "" && recentSearches.length > 0 && (
            <div className="border-b border-cyan-400">
              <p className="text-xs text-center text-gray-400 mb-2">Recent Searches</p>
              {recentSearches.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-cyan-400/20 px-2 py-1 cursor-pointer rounded"
                >
                <span
                  onClick={() => navigate(`/jobs?q=${item}`)}
                  className="text-cyan-400 flex items-center gap-2"
                  >
                🕒 ➜ {item} 
                </span>
                
                {/* REMOVE SINGLE RECENT */}
                <button
                  onClick={() => {
                    const updated = recentSearches.filter((_, index) => index !== i);
                    setRecentSearches(updated);
                    localStorage.setItem("recentSearches", JSON.stringify(updated));
                  }}
                  className="absolute text-red-400 right-3 hover:scale-110"
                >
                  ✖
                </button>
                </div>
              ))}
            </div>
          )}
        
          {/* 🔥 LIVE SUGGESTIONS */}
          {suggestions.map((job, i) => (
            <div
              key={i}
              onClick={() => navigate(`/jobs?q=${job.title}`)}
              className="cursor-pointer hover:bg-cyan-400/20 px-2 py-2 text-cyan-300"
            >
              🔍︎  {job.title}
            </div>
          ))}
        </div>
      )}
    

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-cyan-400 text-2xl"
        >
          ☰
        </button>

        {/* PROFILE */}
        {isLoggedIn && (
          <div className="flex flex-col items-center min-w-[100px]">

            <img
              onClick={() => setDropdownOpen(!dropdownOpen)}
              src={
                user.profile_picture_url ||
                `https://ui-avatars.com/api/?name=${user.username}`
              }
              alt="profile"
              className="w-14 h-14 rounded-full drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] object-cover border-2 border-black hover:scale-110 transition"
              />

            <p onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hover:scale-110 drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-cyan-800/50 font-bold text-black hover:text-cyan-400 rounded-xl font-bold text-center transition duration-300 hover:bg-[#0000003b] hover:border-cyan-400/40 mt-1">
              {user.username || "User"}
            </p>

            {dropdownOpen && (
              <div className="absolute top-20 right-6 bg-black/80 border border-black w-32 text-center shadow-lg">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full py-2 font-bold border border-2 border-green-500 bg-white/5 hover:drop-shadow-[0_0_5px_rgba(34,197,94,1)] text-green-500 hover:text-black hover:bg-green-400/20 transition duration-300"
                >
                  PROFILE
                </button>

                <button
                  onClick={handleLogout}
                  className="black w-full py-2 font-bold border border-2 border-red-500 bg-white/5 hover:drop-shadow-[0_0_5px_rgba(239,68,68,1)] text-red-600 hover:text-black hover:bg-red-200/10 transition duration-300"
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 🔥 MOBILE DROPDOWN MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-cyan-400 p-4 space-y-4 text-center">

          {/* 🔍 SEARCH BAR */}
          {isLoggedIn && role !== "admin" && (
          <div className="relative">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/jobs?q=${searchText}`);
                  setMobileOpen(false);
                }
              }}
              placeholder="Search..."
              className="px-4 pr-10 py-1 rounded-xl hover:bg-[#363636] bg-black text-cyan-400 border border-cyan-400 focus:outline-none w-52"
            />

            {/* ICON */}
            <button
              onClick={() => {
                navigate(`/jobs?q=${searchText}`);
                setMobileOpen(false);
              }}
              className="absolute right-2 top-1/2 border-cyan-400 bg-cyan-400/60 rounded-full transform -translate-y-1/2 text-cyan-400 hover:scale-110 hover:bg-[#363636] drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:shadow-cyan-800/50"
            >
              🔍
            </button>
          </div>
          )}

          {/* 🔥 NAV LINKS */}
          {navLinks.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setMobileOpen(false)}
            >
              <p className="relative text-cyan-400 font-bold hover:bg-[#0000003b] border-2 transition bg-cyan-400/20 text-cyan-400 border-cyan-400 bg-white/5 text-black border-black hover:text-cyan-400 hover:border-cyan-400">{item.name}</p>
            </Link>
          ))}

        </div>
      )}

    </motion.div>
  );
}

export default Navbar;