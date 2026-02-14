import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Play, Save, RefreshCw, Trophy, CheckCircle2, AlertCircle, Clock, Zap, Send, User, Code2, FileText, CheckSquare, ChevronDown, Shuffle, Tag, Building2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usernames, userNamesMap } from '../data/sampleData';

const Tournaments = () => {
  // Templates for different languages
  const LANGUAGE_TEMPLATES = {
    javascript: `// Write your solution here\nconsole.log("Hello World!");\n\n/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction solution(nums, target) {\n    \n}`,
    python: `# Write your solution here\nprint("Hello World!")\n\nclass Solution:\n    def solution(self, nums: List[int], target: int) -> List[int]:\n        pass`,
    cpp: `// Write your solution here\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}\n\nclass Solution {\npublic:\n    vector<int> solution(vector<int>& nums, int target) {\n        \n    }\n};`,
    java: `// Write your solution here\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}\n\nclass Solution {\n    public int[] solution(int[] nums, int target) {\n        return new int[]{};\n    }\n}`
  };

  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [output, setOutput] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('tournaments_player_name') || '');
  const [activeTab, setActiveTab] = useState('testcase'); // 'testcase' | 'result'
  
  // New state for random problem
  const [problemData, setProblemData] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);

  // Save player name to local storage whenever it changes
  React.useEffect(() => {
    if (playerName) {
      localStorage.setItem('tournaments_player_name', playerName);
    }
  }, [playerName]);

  // Fetch random problem on mount
  useEffect(() => {
    fetchRandomProblem();
  }, []);

  const fetchRandomProblem = async () => {
    setLoadingProblem(true);
    setError(null);
    setProblemData(null);
    resetResults();
    
    try {
      const response = await axios.get('http://localhost:8000/api/question/random');
      if (response.data.success) {
        setProblemData(response.data.data);
        if (response.data.data.starterCode) {
            setCode(response.data.data.starterCode);
        }
      } else {
        setError('Failed to fetch problem data');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching random problem. Please try again.');
    } finally {
      setLoadingProblem(false);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(LANGUAGE_TEMPLATES[newLanguage] || '');
  };

  const resetResults = () => {
    setOutput(null);
    setSubmissionResult(null);
    setError(null);
  };

  const handleRunCode = async () => {
    if (!problemData) return;

    setIsRunning(true);
    resetResults();
    setActiveTab('result'); // Switch to result tab on run
    
    try {
      const response = await axios.post('https://leetcode-ai-server.onrender.com/api/judge/run', {
        problem: problemData.description,
        code: code,
        language: language
      });

      if (response.data.success) {
        setOutput(response.data.result);
      } else {
        setError(response.data.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problemData) return;

    if (!playerName.trim()) {
      setError('Please enter your name before submitting.');
      setActiveTab('result');
      return;
    }

    setIsSubmitting(true);
    resetResults();
    setActiveTab('result'); // Switch to result tab on submit

    try {
      const response = await axios.post('https://leetcode-ai-server.onrender.com/api/judge/submit', {
        name: playerName,
        problem: problemData.description,
        code: code,
        language: language
      });

      if (response.data.success) {
        setSubmissionResult(response.data.submission);
      } else {
        setError(response.data.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
        case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
        case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
        default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Top Bar - Minimal Header */}
      <div className="h-14 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-white font-medium">
               <Trophy size={18} className="text-yellow-500" />
               <span>{problemData?.title || 'Loading...'}</span>
             </div>
             <div className="h-4 w-[1px] bg-[#333]"></div>
             <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <select 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-gray-300 w-40 cursor-pointer focus:text-white transition-colors"
                >
                    <option value="" disabled>Select Player</option>
                    {usernames.map(u => (
                        <option key={u} value={userNamesMap[u] || u} className="bg-[#1a1a1a] text-gray-300">
                            {userNamesMap[u] || u}
                        </option>
                    ))}
                </select>
             </div>
         </div>

         <div className="flex items-center gap-2">
            <button 
                onClick={fetchRandomProblem}
                disabled={loadingProblem || isRunning || isSubmitting}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#2a2a2a] text-gray-300 hover:bg-[#333] transition-colors text-sm border border-[#333]"
            >
                {loadingProblem ? <RefreshCw size={14} className="animate-spin" /> : <Shuffle size={14} />}
                <span>Next</span>
            </button>
            <div className="h-4 w-[1px] bg-[#333] mx-1"></div>
            <button 
                onClick={handleRunCode}
                disabled={loadingProblem || isRunning || isSubmitting}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#2a2a2a] text-gray-300 hover:bg-[#333] transition-colors text-sm"
            >
                {isRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                <span>Run</span>
            </button>
            <button 
                onClick={handleSubmitCode}
                disabled={loadingProblem || isRunning || isSubmitting}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-green-700/80 text-green-100 hover:bg-green-600 transition-colors text-sm"
            >
                {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Submit</span>
            </button>
         </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Description */}
        <div className="w-1/2 border-r border-[#2a2a2a] flex flex-col min-w-[300px]">
           <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-2 flex items-center gap-2 text-sm text-white font-medium sticky top-0 z-10">
              <FileText size={14} className="text-blue-400" />
              Description
           </div>
           
           {loadingProblem ? (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                   <RefreshCw className="animate-spin mb-2" size={24} />
                   <p>Fetching random problem...</p>
               </div>
           ) : problemData ? (
               <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {/* Title & Difficulty */}
                  <div className="flex items-start justify-between mb-4">
                      <h1 className="text-2xl font-bold text-white mb-2">{problemData.title}</h1>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(problemData.difficulty)}`}>
                          {problemData.difficulty}
                      </span>
                      {problemData.tags && problemData.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400 text-xs border border-[#333]">
                              <Tag size={10} />
                              {tag}
                          </span>
                      ))}
                  </div>

                  {/* Description */}
                  <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[#282828] prose-pre:border prose-pre:border-[#333] mb-8">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {problemData.description}
                      </ReactMarkdown>
                  </div>

                  {/* Examples */}
                  {problemData.examples && problemData.examples.map((example, index) => (
                      <div key={index} className="mb-6">
                          <h3 className="text-sm font-bold text-white mb-2">Example {index + 1}:</h3>
                          <div className="bg-[#282828] p-4 rounded-lg border border-[#333] space-y-2 font-mono text-sm">
                              <div>
                                  <span className="text-gray-400">Input:</span> <span className="text-gray-200">{example.input}</span>
                              </div>
                              <div>
                                  <span className="text-gray-400">Output:</span> <span className="text-gray-200">{example.output}</span>
                              </div>
                              {example.explanation && (
                                  <div>
                                      <span className="text-gray-400">Explanation:</span> <span className="text-gray-300">{example.explanation}</span>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}

                  {/* Constraints */}
                  {problemData.constraints && (
                      <div className="mb-6">
                          <h3 className="text-sm font-bold text-white mb-2">Constraints:</h3>
                          <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                              {problemData.constraints.map((constraint, index) => (
                                  <li key={index} className="font-mono bg-[#282828] px-2 py-1 rounded w-fit">{constraint}</li>
                              ))}
                          </ul>
                      </div>
                  )}

                   {/* Companies */}
                   {problemData.companies && (
                       <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
                           <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                               <Building2 size={14} />
                               <span>Seen in companies</span>
                           </div>
                           <div className="flex flex-wrap gap-2">
                               {problemData.companies.map(company => (
                                   <span key={company} className="px-2 py-1 bg-[#2a2a2a] text-gray-400 text-xs rounded border border-[#333]">
                                       {company}
                                   </span>
                               ))}
                           </div>
                       </div>
                   )}
               </div>
           ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                   <AlertCircle className="mb-2 text-red-400" size={24} />
                   <p>Failed to load problem.</p>
                   <button onClick={fetchRandomProblem} className="mt-2 text-blue-400 hover:underline">Try Again</button>
               </div>
           )}
        </div>

        {/* Right Panel - Editor & Tabs */}
        <div className="w-1/2 flex flex-col min-w-[300px]">
           {/* Top: Editor */}
           <div className="flex-1 flex flex-col min-h-0 border-b border-[#2a2a2a]">
              <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-2 flex items-center justify-between h-10 shrink-0">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Code2 size={14} />
                      <span className="font-medium">Code</span>
                      <select 
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs ml-2 text-gray-400 hover:text-white cursor-pointer"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                      </select>
                  </div>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        automaticLayout: true,
                        padding: { top: 12 },
                        fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                    }}
                />
              </div>
           </div>

           {/* Bottom: Tabs (Testcase / Result) */}
           <div className="h-[40%] flex flex-col min-h-[200px] bg-[#1a1a1a]">
              {/* Tab Headers */}
              <div className="flex border-b border-[#2a2a2a] bg-[#1e1e1e]">
                  <button 
                     onClick={() => setActiveTab('testcase')}
                     className={`px-4 py-2 text-sm flex items-center gap-2 border-r border-[#2a2a2a] transition-colors ${
                        activeTab === 'testcase' 
                        ? 'bg-[#1a1a1a] text-white border-t-2 border-t-transparent' 
                        : 'text-gray-500 hover:text-gray-300 bg-[#1e1e1e]'
                     }`}
                  >
                     <CheckSquare size={14} />
                     Testcase
                  </button>
                  <button 
                     onClick={() => setActiveTab('result')}
                     className={`px-4 py-2 text-sm flex items-center gap-2 border-r border-[#2a2a2a] transition-colors ${
                        activeTab === 'result' 
                        ? 'bg-[#1a1a1a] text-white border-t-2 border-t-transparent' 
                        : 'text-gray-500 hover:text-gray-300 bg-[#1e1e1e]'
                     }`}
                  >
                     <CheckCircle2 size={14} />
                     Test Result
                  </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {/* Testcase Tab */}
                  {activeTab === 'testcase' && (
                     <div className="space-y-4">
                        <div className="space-y-2">
                           {problemData?.examples && problemData.examples.length > 0 ? (
                               <>
                                   <p className="text-xs text-gray-500 font-medium uppercase">Input</p>
                                   <div className="bg-[#282828] p-3 rounded-md border border-[#333] text-sm font-mono text-gray-300">
                                      {problemData.examples[0].input}
                                   </div>
                               </>
                           ) : (
                               <p className="text-gray-500 italic text-sm">No test cases available.</p>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Test Result Tab */}
                  {activeTab === 'result' && (
                     <div className="space-y-4">
                        {/* Initial State */}
                        {!output && !submissionResult && !error && !isRunning && !isSubmitting && (
                           <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                               <p>Run your code to see results</p>
                           </div>
                        )}

                        {/* Loading State */}
                        {(isRunning || isSubmitting) && (
                           <div className="flex items-center gap-2 text-blue-400">
                               <RefreshCw className="animate-spin" size={16} />
                               <span className="text-sm">{isSubmitting ? 'Evaluating Submission...' : 'Running Code...'}</span>
                           </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400 w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle size={16} />
                                    <span className="font-bold text-sm">Error</span>
                                </div>
                                <pre className="whitespace-pre-wrap text-sm ml-6 font-mono text-xs opacity-90">{error}</pre>
                            </div>
                        )}

                        {/* Run Output */}
                        {output && (
                            <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                   <span className={`text-lg font-bold ${output.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                                       {output.status}
                                   </span>
                                   {output.score && <span className="text-sm text-gray-400">Score: {output.score}</span>}
                               </div>

                               {output.generatedTestCases && output.generatedTestCases.length > 0 && (
                                   <div className="space-y-2">
                                       <p className="text-xs text-gray-500 font-medium uppercase">Input</p>
                                       <div className="bg-[#282828] p-3 rounded-md border border-[#333] text-sm font-mono text-gray-300">
                                            {/* Showing first test case input for now */}
                                            {output.generatedTestCases[0]?.input || 'N/A'}
                                       </div>
                                       
                                       <p className="text-xs text-gray-500 font-medium uppercase mt-3">Output</p>
                                        <div className="bg-[#282828] p-3 rounded-md border border-[#333] text-sm font-mono text-gray-300">
                                            {output.generatedTestCases[0]?.actual_output || 'N/A'}
                                       </div>

                                       <p className="text-xs text-gray-500 font-medium uppercase mt-3">Expected</p>
                                        <div className="bg-[#282828] p-3 rounded-md border border-[#333] text-sm font-mono text-gray-300">
                                            {output.generatedTestCases[0]?.expected_output || 'N/A'}
                                       </div>
                                   </div>
                               )}
                               
                               {/* Feedback only if failed or interesting */}
                               {output.feedback && (
                                   <div className="bg-[#282828] p-4 rounded-md border border-[#333] mt-2">
                                       <p className="text-xs text-gray-500 mb-2 uppercase">AI Feedback</p>
                                       <div className="prose prose-invert prose-sm">
                                           <ReactMarkdown remarkPlugins={[remarkGfm]}>{output.feedback}</ReactMarkdown>
                                       </div>
                                   </div>
                               )}
                            </div>
                        )}

                        {/* Submission Result */}
                        {submissionResult && (
                             <div className="space-y-4">
                                <div className={`flex items-center gap-3 text-xl font-bold ${submissionResult.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                                    {submissionResult.status === 'Accepted' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                    <span>{submissionResult.status}</span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-[#282828] p-2 rounded border border-[#333]">
                                        <p className="text-xs text-gray-500">Runtime</p>
                                        <p className="text-sm font-mono text-white">{submissionResult.complexity?.time || 'N/A'}</p>
                                    </div>
                                    <div className="bg-[#282828] p-2 rounded border border-[#333]">
                                         <p className="text-xs text-gray-500">Memory</p>
                                        <p className="text-sm font-mono text-white">{submissionResult.complexity?.space || 'N/A'}</p>
                                    </div>
                                    <div className="bg-[#282828] p-2 rounded border border-[#333]">
                                         <p className="text-xs text-gray-500">Score</p>
                                        <p className="text-sm font-mono text-white">{submissionResult.score}/100</p>
                                    </div>
                                </div>

                                {submissionResult.feedback && (
                                   <div className="bg-[#2a2a2a] p-4 rounded-md border border-[#333]">
                                       <p className="text-xs text-gray-500 mb-2 uppercase">Feedback</p>
                                       <div className="prose prose-invert prose-sm">
                                           <ReactMarkdown remarkPlugins={[remarkGfm]}>{submissionResult.feedback}</ReactMarkdown>
                                       </div>
                                   </div>
                               )}
                             </div>
                        )}
                     </div>
                  )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
