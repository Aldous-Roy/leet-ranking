import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ExternalLink, Calendar, Code, Trophy, Zap, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { userNamesMap } from "../data/sampleData";

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const API_BASE_URL = "https://leetcode-api-ecru.vercel.app";
                const response = await axios.get(`${API_BASE_URL}/userProfile/${username}`);
                const data = response.data;
                
                setUserData({
                    username: username,
                    name: userNamesMap[username] || username,
                    rank: data.ranking || "N/A",
                    easy: data.easySolved || 0,
                    medium: data.mediumSolved || 0,
                    hard: data.hardSolved || 0,
                    solved: data.totalSolved || 0,
                    totalQuestions: data.totalQuestions || 0,
                    acceptanceRate: data.acceptanceRate || 0,
                    submissionCalendar: data.submissionCalendar || {},
                    recentSubmissions: data.recentSubmissions || [],
                });
            } catch (err) {
                setError("Failed to fetch user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-screen bg-[#0f172a] text-white">
                <div className="animate-spin rounded-full border-t-4 border-b-4 border-blue-500 w-16 h-16 mb-4"></div>
                <p className="text-gray-400 animate-pulse">Loading profile for {username}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-screen bg-[#0f172a] text-white p-6">
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center max-w-lg backdrop-blur-sm">
                    <p className="text-2xl text-red-400 font-semibold mb-2">Error</p>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white font-medium"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const difficultyData = [
        { name: 'Easy', value: userData.easy },
        { name: 'Medium', value: userData.medium },
        { name: 'Hard', value: userData.hard },
    ];
    const COLORS = ['#4ade80', '#fbbf24', '#f87171'];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 overflow-y-auto no-scrollbar">
             {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {/* Profile Header Card */}
                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                         <Trophy size={120} />
                    </div>

                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-2xl">
                        {userData.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left z-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{userData.name}</h1>
                        <p className="text-blue-400 font-mono text-lg mb-4">@{userData.username}</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-700/50 flex items-center gap-2">
                                <Trophy size={16} className="text-yellow-500" />
                                <span className="text-slate-400 text-sm">Global Rank:</span>
                                <span className="font-bold text-white">{userData.rank.toLocaleString()}</span>
                            </div>
                            <div className="bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-700/50 flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                <span className="text-slate-400 text-sm">Solved:</span>
                                <span className="font-bold text-white">{userData.solved}</span>
                            </div>
                             <a 
                                href={`https://leetcode.com/${userData.username}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-blue-600/20 hover:bg-blue-600/30 px-4 py-2 rounded-lg border border-blue-500/30 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                LeetCode Profile <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats Breakdown */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-[500px] flex flex-col">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-blue-400" />
                        Problem Solving Stats
                    </h3>
                    
                    <div className="flex-1 min-h-0 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={difficultyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {difficultyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 mt-auto">
                        <div className="flex justify-between items-center bg-slate-700/30 p-3 rounded-lg">
                            <span className="text-green-400 font-medium">Easy</span>
                            <span className="font-bold">{userData.easy}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-700/30 p-3 rounded-lg">
                            <span className="text-yellow-400 font-medium">Medium</span>
                            <span className="font-bold">{userData.medium}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-700/30 p-3 rounded-lg">
                            <span className="text-red-400 font-medium">Hard</span>
                            <span className="font-bold">{userData.hard}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-[500px] flex flex-col">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Code size={20} className="text-purple-400" />
                        Recent Submissions
                    </h3>

                    {userData.recentSubmissions.length > 0 ? (
                        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                            {userData.recentSubmissions.map((sub, idx) => (
                                <div 
                                    key={idx}
                                    className="bg-slate-700/30 hover:bg-slate-700/50 transition-colors p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                                >
                                    <div>
                                        <h4 className="font-semibold text-sm">{sub.title}</h4>
                                        <p className="text-slate-400 text-xs flex items-center gap-2 mt-1">
                                            <Calendar size={12} />
                                            {formatDate(sub.timestamp)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            sub.statusDisplay === 'Accepted' 
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                            {sub.statusDisplay}
                                        </span>
                                        <span className="text-slate-500 text-xs font-mono bg-slate-900/50 px-2 py-0.5 rounded">
                                            {sub.lang}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 flex-1 flex items-center justify-center">
                            No recent submissions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper for check circle icon (since it's used inline)
const CheckCircleIcon = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    // Timestamps from API might be seconds, JS expects ms
    const date = new Date(parseInt(timestamp) * 1000); 
    return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default UserProfile;
