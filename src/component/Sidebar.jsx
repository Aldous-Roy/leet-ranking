
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, GraduationCap, X, MessageCircle, Brain, Crown, ChevronLeft, ChevronRight, Swords } from 'lucide-react';
import DailyProblem from './DailyProblem';

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { id: 'tournaments', label: 'Tournaments', icon: Swords, path: '/tournaments' },
    { id: 'league-heads', label: 'League Heads', icon: Crown, path: '/league-heads' },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Brain, path: '/dsa-tutor' },
  ];

  const bottomItems = [
    { id: 'leetcoder', label: 'LeetCode', icon: GraduationCap, url: 'https://leetcode.com' },
    { id: 'discord', label: 'Join Discord', icon: MessageCircle, url: 'https://discord.gg/ejCkm4RF' },
  ];

  return (
    <>
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        w-64
      `}>
        {/* Logo and Close Button */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-20`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="text-white font-bold text-lg tracking-tight">LeetRank</h1>
                <p className="text-slate-400 text-xs">M.Tech 2027</p>
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {!isCollapsed && <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>}
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (onClose && window.innerWidth < 768) onClose();
                }}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Daily Problem */}
        {!isCollapsed && <DailyProblem />}

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
          <div className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  title={isCollapsed ? item.label : ''}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <Icon size={18} className="shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </button>
              );
            })}
             {/* Toggle Button for Desktop */}
             <button
                onClick={toggleCollapse}
                className="hidden md:flex w-full items-center justify-center mt-2 pt-2 border-t border-slate-800 text-slate-500 hover:text-white transition-colors"
             >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
