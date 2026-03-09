import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Crown, Trophy, Medal, AlertCircle, RefreshCw, Star, Flame, Zap } from 'lucide-react';

const LeagueHeads = () => {
    const [toppers, setToppers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get('https://leetcode-ai-server.onrender.com/api/submissions');
                const data = response.data;

                if (data.success && data.submissions) {
                    processSubmissions(data.submissions);
                } else {
                    throw new Error('Invalid data format received from API');
                }
            } catch (err) {
                console.error("Error fetching submissions:", err);
                setError(err.message || 'Failed to fetch league data.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const processSubmissions = (submissions) => {
        const userStats = {};

        submissions.forEach(sub => {
            if (sub.status === 'Accepted') {
                if (!userStats[sub.name]) {
                    userStats[sub.name] = {
                        name: sub.name,
                        score: 0,
                        problemsSolved: 0,
                        languages: new Set(),
                        lastSubmissionTime: 0
                    };
                }
                userStats[sub.name].score += (sub.score || 0);
                userStats[sub.name].problemsSolved += 1;
                
                // Upadate last submission time to find the "time of completion" for their current score
                const subTime = sub.created_at ? new Date(sub.created_at).getTime() : 0;
                if (subTime > userStats[sub.name].lastSubmissionTime) {
                    userStats[sub.name].lastSubmissionTime = subTime;
                }

                if (sub.language) {
                    userStats[sub.name].languages.add(sub.language);
                }
            }
        });

        const sortedToppers = Object.values(userStats)
            .sort((a, b) => {
                // Primary sort: Score (Descending)
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                // Secondary sort: Time of last submission (Ascending) - First to resolve wins
                return a.lastSubmissionTime - b.lastSubmissionTime;
            })
            .map((user, index) => ({
                ...user,
                rank: index + 1,
                languages: Array.from(user.languages)
            }));

        setToppers(sortedToppers);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <RefreshCw className="w-12 h-12 animate-spin text-yellow-500 mb-4" />
                <p className="animate-pulse">Loading League Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500 shrink-0">
                        <Crown size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">League Heads</h1>
                        <p className="text-slate-400">Top performers based on recent submission scores.</p>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 bg-slate-900/50">
                                <th className="p-4 text-slate-400 font-medium text-sm w-20 text-center">Rank</th>
                                <th className="p-4 text-slate-400 font-medium text-sm">Challenger</th>
                                <th className="p-4 text-slate-400 font-medium text-sm text-center">Problems Solved</th>
                                <th className="p-4 text-slate-400 font-medium text-sm text-center">Tech Stack</th>
                                <th className="p-4 text-slate-400 font-medium text-sm text-right">Total Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {toppers.length > 0 ? (
                                toppers.map((user) => (
                                    <tr key={user.name} className="group hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <div className={`
                                                w-8 h-8 rounded-lg flex items-center justify-center font-bold mx-auto
                                                ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 
                                                  user.rank === 2 ? 'bg-slate-300/20 text-slate-300' : 
                                                  user.rank === 3 ? 'bg-orange-500/20 text-orange-500' : 'text-slate-500'}
                                            `}>
                                                {user.rank <= 3 ? (
                                                     user.rank === 1 ? <Trophy size={16} /> : 
                                                     user.rank === 2 ? <Medal size={16} /> : <Medal size={16} />
                                                ) : user.rank}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-white border-2 border-slate-600">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">{user.name}</p>
                                                    {user.rank === 1 && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Champion</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                                                <CheckCircleIcon className="text-green-400 w-3.5 h-3.5" />
                                                <span className="text-white font-medium">{user.problemsSolved}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-1 flex-wrap max-w-[200px] mx-auto">
                                                {user.languages.map(lang => (
                                                    <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                                                    {user.score.toLocaleString()}
                                                </span>
                                                <Zap className="text-yellow-500 w-4 h-4" fill="currentColor" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-500">
                                        No league data available yet. Be the first to submit!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Helper icon
const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default LeagueHeads;
