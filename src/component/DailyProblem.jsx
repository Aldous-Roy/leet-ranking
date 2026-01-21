import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

const DailyProblem = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/neetcode-gh/leetcode/main/.problemSiteData.json"
        );
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();

        // Filter for Easy and Medium problems only
        const filteredData = data.filter(p => 
          p.difficulty === 'Easy' || p.difficulty === 'Medium'
        );
        
        // Use the current date to select a daily problem
        // We use the number of days since a fixed epoch to ensure it rotates daily
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const today = new Date();
        const daysSinceEpoch = Math.floor(today.getTime() / ONE_DAY_MS);
        
        const problemIndex = daysSinceEpoch % filteredData.length;
        const dailyQuestion = filteredData[problemIndex];
        
        setProblem(dailyQuestion);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching daily problem:", err);
        setError("Could not load daily problem");
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-3 mx-4 mb-4 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-pulse">
        <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
        <div className="h-3 w-32 bg-slate-700/50 rounded"></div>
      </div>
    );
  }

  if (error || !problem) {
    return null; // Don't show anything on error to keep sidebar clean
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const difficultyColor = getDifficultyColor(problem.difficulty);

  return (
    <div className="px-4 mb-2">
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
          <RefreshCw size={48} />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Daily Challenge
          </h3>
          
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1" title={problem.problem}>
              {problem.problem}
            </h4>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${difficultyColor}`}>
              {problem.difficulty}
            </span>
          </div>

          <a 
            href={problem.link ? `https://leetcode.com/problems/${problem.link}` : '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Solve Now <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DailyProblem;
