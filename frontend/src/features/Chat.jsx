import MainLayout from "../components/layout/MainLayout";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { CompanyLogos } from "../utils/CompanyLogos";

function Chat() {
              
  const [job, setJob] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const role = localStorage.getItem("role");
  const { appId, receiverId } = useParams();
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const companyLogo = CompanyLogos(jobInfo?.company_name);

  const chatEndRef = useRef();

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const otherName =
  role === "recruiter"
    ? ([jobInfo?.user?.first_name, jobInfo?.user?.last_name]
        .filter(Boolean)
        .join(" ") || jobInfo?.user?.username || "User")
    : ([jobInfo?.recruiter_first_name, jobInfo?.recruiter_last_name]
        .filter(Boolean)
        .join(" ") || jobInfo?.recruiter_name || "Recruiter");

  const otherAvatar =
    otherName
      ? `https://ui-avatars.com/api/?name=${otherName}`
      : "https://ui-avatars.com/api/?name=User";


   // 🔄 FETCH MESSAGES
  useEffect(() => {
    API.get(`/messages/${appId}/`)
      .then(res => setMessages(res.data));
  }, [appId]);

  // Job Details
  useEffect(() => {
  if (!appId) return;

  API.get(`/applications/${appId}/`)
    .then(res => {
      setJobInfo(res.data);
    })
    .catch(err => console.log("Job info error", err));
}, [appId]);

  // 🔄 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📤 SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await API.post("/send-message/", {
        application: (appId),
        content: text
      });

      setMessages(prev => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.log(err.response?.data);
    }
  };
  

  const isOnline = jobInfo?.is_online;
  const lastSeen = jobInfo?.last_seen;

  const formatLastSeen = (time) => {
    if (!time) return "";

    const date = new Date(time);
    const now = new Date();

    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return date.toLocaleDateString();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (appId) {
        API.get(`/applications/${appId}/`)
          .then(res => setJobInfo(res.data));
      }
    }, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, [appId]);


  const userName = jobInfo?.user?.username || "User";
  const recruiterName = jobInfo?.recruiter_name || "Recruiter";

  return (
    <MainLayout>
    <div className="w-full mb-6 mt-5 p-10 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">


      {/* 🔥 CHAT HEADER */}
      {jobInfo && (
        <div className="flex items-center justify-between mb-4 p-4 border border-cyan-400 rounded-xl bg-black/60">


          {/* DYNAMIC USER */}
          <div className="flex items-center gap-3">

            {(
              role === "recruiter"
                ? jobInfo?.user?.profile_picture
                : jobInfo?.recruiter_profile_picture
            ) ? (
              <img
                src={
                  role === "recruiter"
                    ? jobInfo?.user?.profile_picture
                    : jobInfo?.recruiter_profile_picture
                }
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-black">
                {role === "recruiter"
                  ? jobInfo?.user?.username?.slice(0, 2).toUpperCase()
                  : jobInfo?.recruiter_name?.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="flex-wrap items-center gap-2 mt-1">
            <p className="text-sm text-left text-cyan-400 font-bold">
              {otherName || "User"}
            </p>

                {isOnline ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                    </span>

                    <p className="text-xs text-green-400 font-medium tracking-wide">
                      Online
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-left text-gray-400 font-medium">
                    {lastSeen ? `Last seen ${formatLastSeen(lastSeen)}` : "Offline"}
                  </p>
                )}
            </div>
          </div>



            {/* COMPANY LOGO */}
            <div className="flex items-center gap-4">         
              
            <div>
              <h2 className="text-lg text-right font-bold text-cyan-400">
                {jobInfo?.job?.title || "Job Title"}
              </h2>

              <p className="text-sm text-right text-gray-300">
                {role === "recruiter"
                  ? `${jobInfo?.user?.first_name || ""} ${jobInfo?.user?.last_name || ""}`.trim() || "User"
                  : `${jobInfo?.job?.company_name || "Company"}`}{" "} | {jobInfo?.job?.location || "Location"}
              </p>

            </div>

             <img
                src={companyLogo}
                alt="logo"
                className="w-16 h-16 bg-white rounded-full border border-cyan-400 object-contain"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${companyLogo}`;
                }}
              />   

          </div>

        </div>
      )}



      {/* CHAT BOX */}
      <div className="h-[400px] overflow-y-auto p-4 border border-cyan-400 rounded-xl bg-black">

        {messages.map(msg => {

          const isMe = msg.sender === userId;

          return (
            <div
              key={msg.id}
              className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}
            >

              <div
                className={`max-w-xs px-4 py-2 rounded-xl shadow
                  ${isMe
                    ? "bg-cyan-400 text-black"
                    : "bg-white/5  border border-cyan-400/30"
                  }`}
              >

                {/* 👤 USER LABEL */}
                <p className="text-[12px] text-blue-500 text-start opacity-70 mb-1">
                  {isMe ? "You" : msg.sender_name}
                </p>

                {/* 💬 MESSAGE */}
                <p className="text-start text-cyan-400">{msg.content}</p>

                {/* ⏱ TIMESTAMP */}
                <p className="text-[10px] text-end opacity-60 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>

              </div>

            </div>
          );
        })}

        {typing && (
          <p className="text-xs text-gray-400 italic">Recruiter is Typing...</p>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTyping(true);

            setTimeout(() => setTyping(false), 1000);
          }}
          className="flex-1 p-2 rounded bg-black border border-cyan-400 text-cyan-300"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="px-4 bg-[#0000003b] border-2 border-cyan-400 hover:bg-cyan-400 font-bold text-cyan-500 hover:text-black rounded"
        >
          Send
        </button>
      </div>

    </div>
</MainLayout>

  );
}

export default Chat;