import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// COMMON PAGES
import Home from "./features/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Chat from "./features/Chat";

// ADMIN PAGES
import AdminUsers from "./features/Admin/AdminUsers";
import AdminInvite from "./features/Admin/AdminInvite";
import AddUser from "./features/Admin/AddUser";
import EditUser from "./features/Admin/EditUser";
import AdminEditJob from "./features/Admin/AdminEditJob";
import DeletedUsers from "./features/Admin/DeletedUsers";
import AdminJobs from "./features/Admin/AdminJobs";
import AdminApplications from "./features/Admin/AdminApplications";
import RecruiterInsights from "./features/Admin/RecruiterInsights";
import RecruiterPerformance from "./features/Admin/RecruiterPerformance";
import AdminProfile from "./features/Admin/AdminProfile";

// RECRUITER PAGES
import Applicants from "./features/Recruiter/Applicants";
import ApplicantsProfile from "./features/Recruiter/ApplicantsProfile";
import EditJob from "./features/Recruiter/EditJob";
import PostJob from "./features/Recruiter/PostJob";
import RecruiterJobDetails from "./features/Recruiter/RecruiterJobDetails";
import RecruiterJobs from "./features/Recruiter/RecruiterJobs";
import RecruiterProfile from "./features/Recruiter/RecruiterProfile";

// USER (JOB SEEKER)
import AppliedJobs from "./features/User/AppliedJobs";
import JobDetails from "./features/User/JobDetails";
import RecruiterProfileView from "./features/User/RecruiterProfileView";
import Jobs from "./features/User/Jobs";
import SavedJobs from "./features/User/SavedJobs";
import Profile from "./features/User/Profile";


import { Users } from "lucide-react";
import DashboardRouter from "./features/Routers/DashboardRouter";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const role = localStorage.getItem("role");

  return (
    
    <div className="bg-gray-100 min-h-screen">
      <BrowserRouter>
      
      {/* ✅ GLOBAL TOAST */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 60,
        }}
        toastOptions={{
          style: {
            background: "#00fbffa7",
            color: "#000000",
            border: "2px solid #000000",
            boxShadow: "0 0 15px rgba(34,211,238,0.8)",
            textAlign: "center",
            fontWeight: "bold",
            duration: 3000,
          },
        }}
      />

        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/chat/:appId/:receiverId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
 
          {/* ADMIN ROUTES */}
          <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
          <Route path="/admin/invite" element={<ProtectedRoute><AdminInvite /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/adduser" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
          <Route path="/admin/edit-user/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
          <Route path="/admin-edit-job/:id" element={<ProtectedRoute><AdminEditJob /></ProtectedRoute>} />
          <Route path="/admin/recycle-bin" element={<ProtectedRoute><DeletedUsers /></ProtectedRoute>}/>
          <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
          <Route path="/admin/recruiters-insigths" element={<ProtectedRoute><RecruiterInsights /></ProtectedRoute>} />
          <Route path="/admin/recruiters-performance" element={<ProtectedRoute><RecruiterPerformance /></ProtectedRoute>} />

          {/* RECRUITER ROUTES */}
          <Route path="/profile" element={<ProtectedRoute>{role === "recruiter" ? <RecruiterProfile /> : <Profile />}</ProtectedRoute>}/>
          <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
          <Route path="/my-jobs"  element={<ProtectedRoute><RecruiterJobs /></ProtectedRoute>}/>
          <Route path="/recruiterjobdetails/:id" element={<ProtectedRoute><RecruiterJobDetails /></ProtectedRoute>} />
          <Route path="/edit-job/:id" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
          <Route path="/applicant/:id" element={<ProtectedRoute><ApplicantsProfile /></ProtectedRoute>} />
          
          {/* USER ROUTES */}
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
          <Route path="/recruiter-profile/:id" element={<ProtectedRoute><RecruiterProfileView /></ProtectedRoute>} />
          <Route path="/applied-jobs" element={<ProtectedRoute><AppliedJobs /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;