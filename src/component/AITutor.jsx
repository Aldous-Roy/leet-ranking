import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, AlertCircle, RefreshCw, ChevronRight, CheckCircle2, Target, Trophy, Clock, Brain, User, Search } from 'lucide-react';
import axios from 'axios';
import { usernames, userNamesMap } from '../data/sampleData';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TutorPDFDocument from './TutorPDFDocument';

const AITutor = () => {
  const [selectedUser, setSelectedUser] = useState(usernames[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('idle'); // idle, fetching_profile, analyzing, complete

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Step 1: Fetch User Profile
      setStep('fetching_profile');
      const profileResponse = await axios.get(`https://leetcode-api-ecru.vercel.app/userProfile/${selectedUser}`);
      const profileData = profileResponse.data;

      if (!profileData || !profileData.totalSolved) {
        throw new Error('Failed to fetch valid LeetCode profile data.');
      }

      // Step 2: Send to AI Tutor
      setStep('analyzing');
      const tutorResponse = await axios.post('https://leetcode-ai-server.onrender.com/api/tutor', profileData);
      
      // Combine data for display
      setData({
        ...profileData,
        tutorReply: tutorResponse.data.tutorReply
      });
      setStep('complete');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 shrink-0">
            <Bot size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">AI DSA Tutor</h1>
            <p className="text-slate-400 text-sm md:text-base">Personalized roadmap and analysis based on your LeetCode performance.</p>
          </div>
        </div>

        {/* User Selection */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50 w-full md:w-auto">
            <div className="flex items-center flex-1 min-w-0">
                <User className="text-slate-400 ml-2 shrink-0" size={20} />
                <select 
                    value={selectedUser} 
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="bg-transparent text-white border-none outline-none py-2 px-2 w-full text-ellipsis"
                    disabled={loading}
                >
                    {usernames.map(u => (
                        <option key={u} value={u} className="bg-slate-900 text-slate-200">
                            {userNamesMap[u] || u}
                        </option>
                    ))}
                </select>
            </div>
            <button 
                onClick={generateAnalysis}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    loading 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                }`}
            >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Brain size={18} />}
                {loading ? 'Processing...' : 'Generate Plan'}
            </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <RefreshCw className="w-16 h-16 animate-spin text-indigo-500 relative z-10" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
                {step === 'fetching_profile' ? 'Fetching LeetCode Profile...' : 'AI Analyzing Performance...'}
            </h3>
            <p className="max-w-md text-center text-slate-500">
                {step === 'fetching_profile' 
                    ? `Retrieving latest submission data for ${userNamesMap[selectedUser] || selectedUser}...` 
                    : 'Generating personalized study roadmap and identifying weak areas...'}
            </p>
            {step === 'analyzing' && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-sm">
                <p className="text-xs text-yellow-400 text-center">
                  Note: This service runs on a free instance. Analysis may take up to 2-3 minutes to generate. Please don't close this window.
                </p>
              </div>
            )}
          </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Analysis Failed</h3>
          <p className="text-red-300 max-w-lg mb-4">{error}</p>
          <button 
            onClick={generateAnalysis} 
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-slate-800/40 border border-slate-700/50 p-3 md:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-2 md:gap-4 text-center sm:text-left">
                    <div className="p-2 md:p-3 rounded-lg bg-green-400/10 text-green-400 shrink-0"><CheckCircle2 size={24} /></div>
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm">Total Solved</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{data.totalSolved}</p>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-3 md:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-2 md:gap-4 text-center sm:text-left">
                    <div className="p-2 md:p-3 rounded-lg bg-yellow-400/10 text-yellow-400 shrink-0"><Trophy size={24} /></div>
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm">Global Ranking</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{activeRanking(data.ranking)}</p>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-3 md:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-2 md:gap-4 text-center sm:text-left">
                    <div className="p-2 md:p-3 rounded-lg bg-purple-400/10 text-purple-400 shrink-0"><Target size={24} /></div>
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm">Contribution</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{data.contributionPoint}</p>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-3 md:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-2 md:gap-4 text-center sm:text-left">
                    <div className="p-2 md:p-3 rounded-lg bg-cyan-400/10 text-cyan-400 shrink-0"><Brain size={24} /></div>
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm">Easy Solved</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{data.easySolved}</p>
                    </div>
                </div>
            </div>

            {/* Tutor Content */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Brain className="text-indigo-400" />
                        Detailed Analysis & Roadmap for {userNamesMap[selectedUser] || selectedUser}
                    </h2>
                    <PDFDownloadLink
                        document={<TutorPDFDocument data={data} selectedUser={selectedUser} userNamesMap={userNamesMap} />}
                        fileName={`LeetCode_Tutor_Report_${selectedUser}.pdf`}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Preparing PDF...' : 'Download Report'
                        }
                    </PDFDownloadLink>
                </div>
                <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-indigo-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {data.tutorReply}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Helper to format ranking nicely
const activeRanking = (rank) => {
    if (!rank) return 'N/A';
    return rank.toLocaleString();
};

export default AITutor;
