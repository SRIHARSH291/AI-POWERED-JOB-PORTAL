import { useState } from "react";
import API from "../../api/axios";
import { useEffect} from "react";
import toast from "react-hot-toast";

function UserModal({ user, onClose, refreshUsers }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  if (!user) return null;

  // 🔥 CHANGE ROLE
  const handleRoleChange = async (newRole) => {
    try {
      setLoading(true);
      await API.patch(`/admin/change-role/${user.id}/`, {
        user_type: newRole,
      });

      toast.success("Role Updated 🚀");
      refreshUsers();
      onClose();
    } catch {
      toast.error("Failed to Update Role ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 BAN / UNBAN
  const handleBan = async () => {
    try {
      setLoading(true);
      await API.patch(`/admin/ban-user/${user.id}/`);

      toast.success("User Status Updated");
      refreshUsers();
      onClose();
    } catch {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE USER
  const confirmDelete = (id) => {
    toast((t) => (
      <div className="text-center">
        <p className="mb-2">⚠️ Delete this User Permanently?</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                await API.delete(`/admin/delete-user/${id}/`);
                toast.success("🗑️ User Deleted Successfully");
                fetchUsers();
              } catch (err) {
                toast.error("❌ Delete Failed");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Yes
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50">

      {/* MODAL */}
      <div className="w-full max-w-md p-6 rounded-2xl border border-cyan-400 bg-white/5 shadow-[0_0_25px_rgba(34,211,238,0.5)] animate-fadeIn">

        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-6">

          <img
            src={user.profile_picture || "https://via.placeholder.com/100"}
            className="w-24 h-24 rounded-full border-2 border-cyan-400 mb-3"
            alt=""
          />

          <h2 className="text-xl font-bold text-cyan-300">
            {user.first_name} {user.last_name}
          </h2>

          <p className="text-gray-400">@{user.username}</p>
        </div>

        {/* DETAILS */}
        <div className="space-y-2 text-sm text-gray-300 mb-6">
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.user_type}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() => handleRoleChange("job_seeker")}
            disabled={loading || user.user_type === "job_seeker"}
            className="bg-white/60 border-2 border-cyan-500 hover:bg-pink-500 py-2 rounded text-black font-bold"
          >
            Make Job-Seeker
          </button>

          <button
            onClick={() => handleRoleChange("recruiter")}
            disabled={loading}
            className="bg-white/60 border-2 border-cyan-500 hover:bg-purple-500  py-2 rounded text-black font-bold"
          >
            Make Recruiter
          </button>

          <button
            onClick={handleBan}
            disabled={loading}
            className="bg-white/60 border-2 border-cyan-500 hover:bg-yellow-500 hover:bg- py-2 rounded text-black font-bold"
          >
            Ban / Unban
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); confirmDelete(user.id)}}
            disabled={loading}
            className="bg-white/60 border-2 border-cyan-500 bg-black hover:bg-red-600 py-2 rounded text-black font-bold"
          >
            Delete
          </button>

        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-700 font-bold hover:bg-gray-400 hover:text-black py-2 rounded"
        >
          Close
        </button>

      </div>
    </div>
  );
}

export default UserModal;