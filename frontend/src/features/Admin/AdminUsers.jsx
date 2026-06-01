import MainLayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserModal from "./UserModal";
import {
  getUsers,
  deleteUser,
} from "../../api/adminApi";

function AdminUsers() {
  
const [users, setUsers] = useState([]);

const fetchUsers = async () => {
  try {
    const res = await getUsers();
    setUsers(res.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchUsers();
}, []);


const navigate = useNavigate();
const [selectedUser, setSelectedUser] = useState(null);

// ✅ LOAD USERS ON PAGE LOAD
useEffect(() => {
  fetchUsers();
}, []);


// 🔥 BAN / UNBAN
const toggleBan = async (id) => {
  try {
    await API.patch(`/admin/ban-user/${id}/`);
    toast.success("✅ User Status Updated");
    await fetchUsers();  
  } catch (err) {
    toast.error("❌ Failed to Update User");
  }
};


// 🔴 DELETE USER
const handleDelete = (id) => {
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


// 🟣 CHANGE ROLE
const changeRole = async (id, role) => {
  try {
    await API.patch(`/admin/change-role/${id}/`, {
      user_type: role,
    });
    toast.success("🔄 Role updated");
    await fetchUsers();  
  } catch (err) {
    toast.error("❌ Role update failed");
  }
};

const sortedUsers = [...users].sort((a, b) => {
  const order = { admin: 0, recruiter: 1, job_seeker: 2 };
  return order[a.user_type] - order[b.user_type];
});

  return (
    <MainLayout>
     <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

         <h2 className="text-4xl sm:text-3xl md:text-4xl text-center mx-auto w-full max-w-[300px] text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:scale-105 hover:bg-[#0000003b] transition-all duration-300 font-bold mt-5 mb-10">MANAGE USERS</h2>

      <div className="grid md:grid-cols-3 gap-6">

        {sortedUsers.map(user => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="bg-white/5 hover:scale-105 p-5 items-center hover:bg-[#0000003b] border-2 border-cyan-400 rounded-xl"
          >

            <div className="flex justify-center">
              <img
                src={user.profile_picture || "https://via.placeholder.com/80"}
                className="w-24 h-24 rounded-full object-cover 
                          drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                alt=""
              />
            </div>

            {/* INFO */}
            <div className="flex-1 break-words">
            

              <h3 className="text-xl text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] font-bold">
                {user.first_name} {user.last_name}
              </h3>

              <p>@{user.username}</p>
              <p>{user.email}</p>
              <p>📞 {user.phone_no || "N/A"}</p>

              {/* USER TYPE (CAPITAL) */}
              <p className="text-l items-center text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 font-bold">
                {user.user_type.toUpperCase()}
              </p>

              {/* STATUS BADGE */}
              <p className="mb-2"><span className={`px-2 py-1 rounded text-xs ${
                user.is_active
                  ? "bg-green-500/60 font-bold text-black"
                  : "bg-red-500/60 font-bold text-black"
              }`}>
                {user.is_active ? "ACTIVE" : "BANNED"}
              </span>
              </p>
                
              </div>

              {user.user_type !== "admin" && (
              <div className="flex-1 break-words truncate justify-between">
                <button
                  onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                  className="px-2 py-1 mb-5 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-[#0d00ff] hover:text-white rounded"
                  >
                  EDIT USER
                </button>
                </div>
                )}

            {/* ACTIONS */}
            {user.user_type !== "admin" && (
              <div className="flex flex-wrap break-words truncate text-left justify-between">
              {/* ROLE CHANGE */}
              <select
                value={user.user_type}
                onChange={(e) => { e.stopPropagation(); changeRole(user.id, e.target.value)}}
                className="px-2 py-1 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-black hover:text-cyan-400 rounded"
              >
                <option value="job_seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>

              {/* BAN */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleBan(user.id)}}
                className="px-2 py-1 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-yellow-500 hover:text-black rounded"
                >
                Ban / Unban
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(user.id)}}
               className="px-2 py-1 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-red-500 hover:text-black rounded"
                >
                Delete
              </button>
            </div>
            )}
          </div>
          ))}
          </div>

        
    </div>
    {selectedUser && (
      <UserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        refreshUsers={fetchUsers}
      />
    )}
    </MainLayout>
  );
}

export default AdminUsers;