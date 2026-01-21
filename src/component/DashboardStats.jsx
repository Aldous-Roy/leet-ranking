import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Users, CheckCircle, Target, Trophy, Flame, Zap, Code, Activity } from 'lucide-react';

const DashboardStats = ({ users }) => {
  // --- Calculate Stats ---
  const {
    totalStudents,
    totalSolved,
    avgSolved,
    totalEasy,
    totalMedium,
    totalHard,
    sortedBySolved,
    top10Users,
    topHardSolvers,
    recentActivity,
    languageStats
  } = useMemo(() => {
    const totalStudents = users.length;
    const totalSolved = users.reduce((acc, user) => acc + (user.solved || 0), 0);
    const avgSolved = totalStudents > 0 ? (totalSolved / totalStudents).toFixed(0) : 0;
    
    const totalEasy = users.reduce((acc, user) => acc + (user.easy || 0), 0);
    const totalMedium = users.reduce((acc, user) => acc + (user.medium || 0), 0);
    const totalHard = users.reduce((acc, user) => acc + (user.hard || 0), 0);

    // Top 10% Logic
    const sortedBySolved = [...users].sort((a, b) => b.solved - a.solved);
    const top10Count = Math.ceil(totalStudents * 0.1);
    const top10Users = sortedBySolved.slice(0, top10Count);

    // Hard Solvers Logic
    const topHardSolvers = [...users]
      .sort((a, b) => b.hard - a.hard)
      .slice(0, 5)
      .filter(u => u.hard > 0);

    // Activity Feed Logic
    const allSubmissions = users.flatMap(user => 
      (user.recentSubmissions || []).map(sub => ({
        ...sub,
        username: user.username,
        name: user.name,
        avatar: user.name.charAt(0)
      }))
    );
    const recentActivity = allSubmissions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    // Language Stats Logic
    const langCounts = {};
    allSubmissions.forEach(sub => {
      const lang = sub.lang;
      if (lang) {
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      }
    });
    const languageStats = Object.keys(langCounts)
      .map(lang => ({ name: lang, value: langCounts[lang] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 languages

    return {
      totalStudents,
      totalSolved,
      avgSolved,
      totalEasy,
      totalMedium,
      totalHard,
      sortedBySolved,
      top10Users,
      topHardSolvers,
      recentActivity,
      languageStats
    };
  }, [users]);
  
  const top10Avg = top10Users.length > 0 
    ? (top10Users.reduce((acc, user) => acc + user.solved, 0) / top10Users.length).toFixed(0)
    : 0;

  // Chart Data
  const difficultyData = [
    { name: 'Easy', value: totalEasy },
    { name: 'Medium', value: totalMedium },
    { name: 'Hard', value: totalHard },
  ];
  const COLORS = ['#4ade80', '#fbbf24', '#f87171']; // Green, Yellow, Red
  const LANG_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'];

  const comparisonData = [
    { name: 'Class Avg', solved: avgSolved },
    { name: 'Top 10% Avg', solved: top10Avg },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl flex items-start justify-between hover:border-slate-600 transition-colors">
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-white mb-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
    </div>
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Class Overview</h2>
        <p className="text-slate-400">Real-time statistics for M.Tech 2027 batch.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
          color="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          title="Problems Solved" 
          value={totalSolved.toLocaleString()} 
          subtitle="Across all difficulty levels"
          icon={CheckCircle} 
          color="bg-green-500 text-green-500" 
        />
        <StatCard 
          title="Avg Per Student" 
          value={avgSolved} 
          icon={Target} 
          color="bg-purple-500 text-purple-500" 
        />
        <StatCard 
          title="Top 10% Threshold" 
          value={top10Users.length > 0 ? top10Users[top10Users.length - 1].solved : 0} 
          subtitle={`Need >${top10Users.length > 0 ? top10Users[top10Users.length - 1].solved : 0} solved to enter`}
          icon={Trophy} 
          color="bg-yellow-500 text-yellow-500" 
        />
      </div>

      {/* Main Grid: Charts & Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty Distribution */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Difficulty Distribution</h3>
                <div className="h-64 w-full">
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
                        <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>

                {/* Top 10% vs Average */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Performance Gap</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        />
                        <Bar dataKey="solved" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>

             {/* Language Popularity */}
             <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Code size={20} className="text-pink-400"/>
                    Trending Languages
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={languageStats} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" stroke="#94a3b8" hide />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {languageStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={LANG_COLORS[index % LANG_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Top 10% List */}
             <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Elite Club (Top 10%)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {top10Users.map((user, idx) => (
                    <div key={user.username} className="bg-slate-700/30 p-4 rounded-xl flex items-center gap-3 border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-sm shrink-0">
                        #{idx + 1}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-medium text-sm truncate">{user.name}</p>
                        <p className="text-blue-400 text-xs font-mono">{user.solved} Solved</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        {/* Right Column: Feeds & Hard Mode */}
        <div className="space-y-6">
             {/* Live Activity Feed */}
             <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col max-h-[600px]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400 fill-yellow-400 animate-pulse"/>
                    Live Activity
                </h3>
                <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex gap-3 items-start pb-4 border-b border-slate-700/50 last:border-0">
                             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                                {activity.avatar}
                             </div>
                             <div>
                                <p className="text-sm text-gray-300">
                                    <span className="font-semibold text-white">{activity.name}</span> solved <span className="text-blue-300">{activity.title}</span>
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                        activity.statusDisplay === 'Accepted' 
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {activity.statusDisplay}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{formatDate(activity.timestamp)}</span>
                                </div>
                             </div>
                        </div>
                    )) : (
                        <div className="text-center text-slate-500 py-4">No recent activity</div>
                    )}
                </div>
            </div>

            {/* Masters of Hard */}
            <div className="bg-gradient-to-br from-red-900/20 to-slate-900 border border-red-500/20 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Flame size={20} className="text-red-500 fill-red-500"/>
                    Masters of Hard
                </h3>
                <div className="space-y-3">
                    {topHardSolvers.map((user, idx) => (
                        <div key={user.username} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                             <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'}`}>
                                    {idx + 1}
                                </div>
                                <span className="text-sm font-medium text-slate-200 truncate">{user.name}</span>
                             </div>
                             <div className="text-red-400 font-bold text-sm">
                                {user.hard} <span className="text-xs font-normal text-slate-500">Hard</span>
                             </div>
                        </div>
                    ))}
                    {topHardSolvers.length === 0 && <p className="text-slate-500 text-sm text-center">No hard problems solved yet.</p>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
