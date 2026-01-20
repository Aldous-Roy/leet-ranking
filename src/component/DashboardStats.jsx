import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Users, CheckCircle, Target, Trophy } from 'lucide-react';

const DashboardStats = ({ users }) => {
  // --- Calculate Stats ---
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

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Top 10% List */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Elite Club (Top 10%)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {top10Users.map((user, idx) => (
            <div key={user.username} className="bg-slate-700/30 p-4 rounded-xl flex items-center gap-3 border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-sm">
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
  );
};

export default DashboardStats;
