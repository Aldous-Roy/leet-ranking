import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, Settings, ArrowLeft, Tag } from 'lucide-react';

const DailyProblem = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(() => localStorage.getItem('dailyProblemTopic') || 'All');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Save preference whenever it changes
    localStorage.setItem('dailyProblemTopic', selectedTopic);
  }, [selectedTopic]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/neetcode-gh/leetcode/main/.problemSiteData.json"
        );
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();

        // Extract unique topics (patterns)
        const uniqueTopics = ['All', ...new Set(data.map(p => p.pattern).filter(Boolean))].sort();
        setTopics(uniqueTopics);

        // Filter for Easy and Medium problems only
        // AND match selected topic if not 'All'
        const filteredData = data.filter(p => 
          (p.difficulty === 'Easy' || p.difficulty === 'Medium') &&
          (selectedTopic === 'All' || p.pattern === selectedTopic)
        );
        
        if (filteredData.length === 0) {
           // Fallback if no problems found for filter (unlikely but safe)
           setProblem(null);
           setLoading(false);
           return;
        }

        // Use the current date to select a daily problem
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const today = new Date();
        const daysSinceEpoch = Math.floor(today.getTime() / ONE_DAY_MS);
        
        // Use a hash of the date and topic to ensure rotation differs per topic but stays consistent
        const topicHash = selectedTopic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const problemIndex = (daysSinceEpoch + topicHash) % filteredData.length;
        
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
  }, [selectedTopic]);

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

  const difficultyColor = problem ? getDifficultyColor(problem.difficulty) : '';

  return (
    <div className="px-4 mb-2">
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 relative overflow-hidden group min-h-[140px] flex flex-col">
        {/* Background Icon */}
        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
          <RefreshCw size={48} />
        </div>
        
        {/* Header with Settings Toggle */}
        <div className="relative z-10 flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Daily Challenge
          </h3>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700/50"
            title="Topic Settings"
          >
             {isSettingsOpen ? <ArrowLeft size={14} /> : <Settings size={14} />}
          </button>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 flex flex-col">
          {isSettingsOpen ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-200">
               <p className="text-[10px] text-slate-500 mb-2 font-medium">SELECT TOPIC</p>
               <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar pr-1">
                 {topics.map(topic => (
                   <button
                    key={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setIsSettingsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedTopic === topic 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    }`}
                   >
                     <span className="truncate">{topic}</span>
                     {selectedTopic === topic && <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
                   </button>
                 ))}
               </div>
            </div>
          ) : (
             <div className="animate-in fade-in slide-in-from-left-4 duration-200">
                {problem ? (
                  <>
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-white line-clamp-2 mb-1" title={problem.problem}>
                        {problem.problem}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                         <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${difficultyColor}`}>
                          {problem.difficulty}
                        </span>
                        {problem.pattern && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border border-slate-700 bg-slate-800/50 text-slate-400">
                            <Tag size={8} className="mr-1" />
                            {problem.pattern}
                          </span>
                        )}
                      </div>
                    </div>

                    <a 
                      href={problem.link ? `https://leetcode.com/problems/${problem.link}` : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors mt-auto"
                    >
                      Solve Now <ExternalLink size={10} />
                    </a>
                  </>
                ) : (
                  <div className="text-xs text-slate-500 py-2">
                    No problems found for this topic.
                  </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyProblem;
