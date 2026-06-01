import MainLayout from "../../components/layout/MainLayout";
import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

function AdminInvite() {
  const [email, setEmail] = useState("");

  const sendInvite = async () => {
    try {
      await API.post("/admin/send-invite/", { email });
      toast.success("📧 Invite Sent!");
    } catch {
      toast.error("❌ Failed to send invite");
    }
  };

  return (

    <MainLayout>

     <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

    <div className="grid grid-cols-3">
        <p></p>
        <h2 className="text-4xl items-center text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:bg-[#0000003b] font-bold mt-5 mb-10">INVITE USERS</h2>
        <p></p>
    </div>
    
    <div className="p-10">
      <input
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-black/20 mt-10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md"
      />
    </div>

      <button onClick={sendInvite}
      className="px-5 py-2 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:bg-[#0000000b] border-2 transition text-black border-cyan-400 bg-white/10 text-black hover:border-black hover:text-cyan-400">Send Invite</button>
    
    </div>
    </MainLayout>
  );
}

export default AdminInvite;