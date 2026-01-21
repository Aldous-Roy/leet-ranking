import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useLocation } from "react-router-dom";
import { usernames, userNamesMap } from "./data/sampleData";
import UserList from "./component/UserList";
import Sidebar from "./component/Sidebar";
import DashboardStats from "./component/DashboardStats";
import UserProfile from "./component/UserProfile";
import "./App.css";

const App = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      setError("");
      try {
        const API_BASE_URL = "https://leetcode-api-ecru.vercel.app"; 
        const promises = usernames.map((username) =>
          axios
            .get(`${API_BASE_URL}/userProfile/${username}`)
            .then((res) => {
              const data = res.data;
              return {
                username: username,
                name: userNamesMap[username] || username,
                rank: data.ranking || "N/A",
                easy: data.easySolved || 0,
                medium: data.mediumSolved || 0,
                hard: data.hardSolved || 0,
                solved: data.totalSolved || 0,
                recentSubmissions: data.recentSubmissions || [],
              };
            })
            .catch((error) => {
              return {
                username: username,
                name: userNamesMap[username] || username,
                rank: "Error",
                easy: 0,
                medium: 0,
                hard: 0,
                solved: 0,
                recentSubmissions: [],
              };
            })
        );

        const results = await Promise.all(promises);
        setUsersData(results);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); 
  }, []);

  const LoadingScreen = () => (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="animate-spin rounded-full border-t-4 border-b-4 border-blue-500 w-16 h-16 mb-4"></div>
      <p className="text-gray-400 animate-pulse">Fetching latest rankings...</p>
    </div>
  );

  const ErrorScreen = ({ message }) => (
    <div className="flex justify-center items-center h-full">
       <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center max-w-lg mx-auto backdrop-blur-sm">
        <p className="text-xl text-red-400 font-semibold mb-2">Oops!</p>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white font-sans overflow-hidden">
        {/* Background decorative elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50"></div>
        </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Only show Sidebar if NOT on a user profile page (optional, user preference, but usually sidebar is good everywhere. 
          However, for Full Page Profile, maybe we want it hidden? 
          The design in UserProfile had a back button. Let's keep sidebar for main views.
          Refined: Keep sidebar always. Profile page will overlay or be in main area. 
      */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 md:ml-64 relative z-10 h-screen overflow-y-auto custom-scrollbar">
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-20">
           <span className="font-bold text-lg">LeetRank</span>
           <button 
             className="text-gray-400 hover:text-white transition-colors" 
             onClick={() => setIsSidebarOpen(true)}
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
        </div>

        {loading ? (
           <LoadingScreen /> 
        ) : error ? (
           <ErrorScreen message={error} />
        ) : (
          <Routes>
            <Route path="/" element={<DashboardStats users={usersData} />} />
            <Route path="/leaderboard" element={
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden m-6">
                 <UserList users={usersData} />
              </div>
            } />
            <Route path="/user/:username" element={<UserProfile />} />
            {/* Fallback */}
            <Route path="*" element={<DashboardStats users={usersData} />} />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default App;