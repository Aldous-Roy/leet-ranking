import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { Users, CheckCircle, Target, Trophy, Flame, Zap, Code, Calendar, Award, ArrowUpRight } from 'lucide-react';

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
    languageStats,
    weeklyToppers
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
        avatar: sub.title.charAt(0) // Fallback if no user avatar
      }))
    );
    const recentActivity = allSubmissions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 15); // Show top 15

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

    // Weekly Toppers Logic
    const oneWeekAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;
    const weeklyToppers = users
      .map(user => {
        const weeklySolved = new Set(
          (user.recentSubmissions || [])
            .filter(sub => parseInt(sub.timestamp) >= oneWeekAgo)
            .map(sub => sub.title)
        ).size;
        return { ...user, weeklySolved };
      })
      .filter(user => user.weeklySolved > 0)
      .sort((a, b) => b.weeklySolved - a.weeklySolved)
      .slice(0, 5);

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
      languageStats,
      weeklyToppers
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

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="relative overflow-hidden bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl flex items-start justify-between group hover:border-slate-500/50 hover:bg-slate-800/60 transition-all duration-300 shadow-lg">
       {/* Background gradient blob */}
       <div className={`absolute -right-6 -top-6 w-32 h-32 ${color.replace('text-', 'bg-')} bg-opacity-5 rounded-full blur-3xl group-hover:bg-opacity-10 transition-all`}></div>
       
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={18} />
            </div>
             <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase">{title}</p>
        </div>
        
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            {trend && <span className="text-xs font-medium text-emerald-400 flex items-center">{trend} <ArrowUpRight size={12}/></span>}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 w-full max-w-[1600px] mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Performance Overview</h2>
          <p className="text-slate-400 mt-1">Real-time collaboration and competitive analysis.</p>
        </div>
        <div className="flex gap-2">
             <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">M.Tech 2027</span>
             <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">Live Updated</span>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Students" 
          value={totalStudents} 
          icon={Users} 
          color="text-blue-400" 
          trend="+100%"
        />
        <StatCard 
          title="Problems Solved" 
          value={totalSolved.toLocaleString()} 
          subtitle="Collective class effort"
          icon={CheckCircle} 
          color="text-green-400" 
          trend="Increasing"
        />
        <StatCard 
          title="Avg Per Student" 
          value={avgSolved} 
          icon={Target} 
          color="text-purple-400" 
        />
        <StatCard 
          title="Elite Threshold" 
          value={top10Users.length > 0 ? top10Users[top10Users.length - 1].solved : 0} 
          subtitle="Top 10% entry requirement"
          icon={Trophy} 
          color="text-yellow-400" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Comparison Chart */}
                 <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-white">Performance Gap</h3>
                        <p className="text-sm text-slate-400">Average vs Top 10%</p>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip 
                            cursor={{fill: '#334155', opacity: 0.2}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="solved" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                                {comparisonData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={index === 0 ? '#64748b' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Difficulty Chart */}
                 <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6">
                     <div className="mb-6">
                        <h3 className="text-lg font-bold text-white">Difficulty Split</h3>
                        <p className="text-sm text-slate-400">Problem distribution</p>
                    </div>
                    <div className="h-64 w-full relative">
                         {/* Center Text overlay for Donut */}
                         <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                             <span className="text-3xl font-bold text-white">{totalSolved.toLocaleString()}</span>
                             <span className="text-xs text-slate-500 uppercase">Total</span>
                         </div>
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={difficultyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            >
                            {difficultyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                     {/* Custom Legend */}
                     <div className="flex justify-center gap-4 mt-2">
                        {difficultyData.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                                {d.name}
                            </div>
                        ))}
                     </div>
                 </div>
            </div>

            {/* Elite Club */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
                 <div className="flex items-center justify-between mb-6">
                     <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Award className="text-yellow-400" />
                            Elite Club
                        </h3>
                        <p className="text-sm text-slate-400">Top 10% performers leading the batch.</p>
                     </div>
                     <button className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">View All Rankers</button>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {top10Users.map((user, idx) => (
                        <div key={user.username} className="group flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 hover:border-yellow-500/30 hover:bg-slate-800 transition-all cursor-default">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                                idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-lg shadow-yellow-500/20' :
                                idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg' :
                                idx === 2 ? 'bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-lg' :
                                'bg-slate-700 text-slate-300'
                             }`}>
                                {idx + 1}
                             </div>
                             <div className="overflow-hidden">
                                 <h4 className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{user.name}</h4>
                                 <p className="text-xs text-slate-500 font-mono">{user.solved} solved</p>
                             </div>
                        </div>
                    ))}
                 </div>
            </div>

             {/* Weekly Toppers Section */}
             {weeklyToppers.length > 0 && (
                 <div className="bg-gradient-to-r from-emerald-900/10 to-blue-900/10 border border-emerald-500/20 rounded-3xl p-8 backdrop-blur-sm">
                      <div className="mb-6 flex items-center gap-3">
                           <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Calendar className="text-emerald-400" size={24} />
                           </div>
                           <div>
                                <h3 className="text-xl font-bold text-white">Dominated This Week</h3>
                                <p className="text-sm text-slate-400">Most active solvers in the last 7 days.</p>
                           </div>
                      </div>

                      <div className="overflow-x-auto pb-2">
                           <div className="flex gap-4 min-w-max">
                                {weeklyToppers.map((user, idx) => (
                                    <div key={user.username} className="flex flex-col items-center justify-center bg-slate-800/80 border border-slate-700 p-4 rounded-2xl min-w-[140px] hover:-translate-y-1 transition-transform duration-300">
                                         <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-emerald-400 mb-3 border-2 border-slate-600">
                                            {user.name.charAt(0)}
                                         </div>
                                         <span className="text-white font-medium text-sm text-center mb-1 truncate w-full px-2">{user.name}</span>
                                         <span className="text-emerald-400 text-xs font-bold">+{user.weeklySolved}</span>
                                         <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Problems</span>
                                    </div>
                                ))}
                           </div>
                      </div>
                 </div>
             )}

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* Live Activity Feed */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 flex flex-col h-[500px]">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-400" fill="currentColor"/>
                        Live Feed
                    </h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 </div>

                 <div className="space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-2">
                     {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                         <div key={idx} className="relative pl-6 border-l border-slate-700/50 pb-2 last:pb-0">
                              <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                                  activity.statusDisplay === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              
                              <div className="flex flex-col gap-1">
                                  <div className="flex justify-between items-center">
                                      <span className="font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer text-sm">{activity.name}</span>
                                      <span className="text-[10px] text-slate-600 font-mono whitespace-nowrap">{formatDate(activity.timestamp)}</span>
                                  </div>
                                  
                                  <div className="text-sm">
                                      <span className={`font-medium text-xs uppercase tracking-wider mr-2 ${
                                        activity.statusDisplay === 'Accepted' ? 'text-green-400' : 'text-red-400'
                                      }`}>
                                        {activity.statusDisplay}
                                      </span>
                                      <span className="text-slate-300">{activity.title}</span>
                                  </div>
                              </div>
                         </div>
                     )) : (
                         <div className="text-center text-slate-500 py-10">No recent activity</div>
                     )}
                 </div>
            </div>

            {/* Masters of Hard */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Flame className="text-orange-500" fill="currentColor"/>
                    Masters of Hard
                </h3>
                <div className="space-y-4">
                    {topHardSolvers.map((user, idx) => (
                        <div key={user.username} className="flex items-center justify-between group">
                             <div className="flex items-center gap-3">
                                <span className={`text-sm font-mono font-bold w-6 ${idx < 3 ? 'text-orange-400' : 'text-slate-600'}`}>0{idx + 1}</span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-200 group-hover:text-orange-400 transition-colors">{user.name}</span>
                                </div>
                             </div>
                             <div className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                                {user.hard} H
                             </div>
                        </div>
                    ))}
                    {topHardSolvers.length === 0 && <p className="text-slate-500 text-sm text-center">No hard problems solved yet.</p>}
                </div>
            </div>

            {/* Trending Languages */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Code className="text-pink-400" />
                    Trending Tech
                </h3>
                <div className="space-y-3">
                     {languageStats.map((stat, idx) => (
                         <div key={idx}>
                             <div className="flex justify-between text-xs mb-1">
                                 <span className="text-slate-300">{stat.name}</span>
                                 <span className="text-slate-500">{stat.value} subs</span>
                             </div>
                             <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                                 <div 
                                    className="h-full rounded-full" 
                                    style={{
                                        width: `${(stat.value / languageStats[0].value) * 100}%`,
                                        backgroundColor: LANG_COLORS[idx % LANG_COLORS.length]
                                    }}
                                 ></div>
                             </div>
                         </div>
                     ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
