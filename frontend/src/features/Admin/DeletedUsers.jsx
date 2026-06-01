import MainLayout from "../../components/layout/MainLayout";
import React, { useEffect, useState } from "react";
import {
  getDeletedUsers,
  restoreUser,
} from "../../api/adminApi";

function DeletedUsers() {
  const [users, setUsers] = useState([]);

  const fetchDeletedUsers = async () => {
    try {
      const res = await getDeletedUsers();
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const handleRestore = async (id) => {
    try {
      await restoreUser(id);
      fetchDeletedUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
    <div className="w-full mb-5 mt-5 p-8 backdrop-blur-lg border border-cyan-400 rounded-2xl shadow-xl bg-[#0000003b]">

         <h2 className="text-4xl sm:text-3xl md:text-4xl text-center mx-auto w-full max-w-[300px] text-black drop-shadow-[0_0_5px_rgba(34,211,238,1)] hover:text-cyan-400 hover:scale-105 hover:bg-[#0000003b] transition-all duration-300 font-bold mt-5 mb-10">RECYCLE BIN</h2>
    
    <div className="mt-6 grid md:grid-cols-3 gap-4">
      {users.length === 0 ? (
          <p>No Deleted Users Found</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            onClick={() => (user)}
            className="bg-white/5 p-5 items-center hover:bg-[#0000003b] border-2 border-cyan-400 rounded-xl"
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


            <button
              onClick={() => handleRestore(user.id)}
              className="px-2 py-1 text-sm font-bold bg-[#0000003b] text-cyan-400 border border-cyan-400/40 hover:bg-green-500 hover:text-black rounded"
            >
              Restore
            </button>
          </div>
        ))
      )}
    </div>
    </div>
    </MainLayout>
  );
}

export default DeletedUsers;