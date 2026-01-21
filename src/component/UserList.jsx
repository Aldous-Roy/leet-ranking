import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const getRankBadge = (rank) => {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="font-mono font-bold text-gray-400">#{rank}</span>;
};

const UserList = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    // Handle N/A or Error ranks by pushing them to the bottom
    const rankA = typeof a.rank === 'number' ? a.rank : Infinity;
    const rankB = typeof b.rank === 'number' ? b.rank : Infinity;
    return rankA - rankB;
  });

  const handleUserClick = (username) => {
    navigate(`/user/${username}`);
  };

  const TopPerformer = ({ user }) => (
    <div 
      className="mb-8 p-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 relative group cursor-pointer" 
      onClick={() => handleUserClick(user.username)}
    >
      <div className="bg-slate-900 rounded-xl p-6 text-center">
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">View Profile</span>
        </div>
        <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">Current Leader</p>
        <h3 className="text-3xl font-extrabold text-white mb-1">{user.name}</h3>
        <p className="text-blue-400 font-mono text-sm">@{user.username}</p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
           <div className="flex flex-col">
             <span className="font-bold text-white text-lg">{user.solved}</span>
             <span className="text-gray-500 text-xs">Solved</span>
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-yellow-400 text-lg">#{user.rank}</span>
             <span className="text-gray-500 text-xs">Global Rank</span>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Search and Top Stats Header */}
      <div className="p-6 bg-slate-800/80 border-b border-slate-700/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           {users.length > 0 && !searchTerm && <div className="hidden md:block text-gray-400 text-sm">Total Participants: <span className="text-white font-bold">{users.length}</span></div>}
           
           <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or username..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg leading-5 bg-slate-700/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-slate-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Top Performer Highlight (only if no search or top result matches) */}
        {/* {!searchTerm && sortedUsers.length > 0 && <TopPerformer user={sortedUsers[0]} />} */}

        {sortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No students found matching your search.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-700/50 max-h-[calc(100vh-150px)] overflow-y-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-slate-700/50">
                <thead className="bg-slate-800 sticky top-0 z-10 shadow-md">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-slate-800">Rank</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-slate-800">Student</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider bg-slate-800">Global Rank</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider bg-slate-800">Total Solved</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-green-400 uppercase tracking-wider bg-slate-800">Easy</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider bg-slate-800">Medium</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-red-400 uppercase tracking-wider bg-slate-800">Hard</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider bg-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
                  {sortedUsers.map((user, index) => (
                    <tr 
                      key={user.username} 
                      className="hover:bg-slate-700/30 transition-colors duration-150 group cursor-pointer"
                      onClick={() => handleUserClick(user.username)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRankBadge(index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300 font-mono">
                        {user.rank.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-200 border border-blue-700/50">
                          {user.solved}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                        {user.easy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                        {user.medium}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                        {user.hard}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(user.username);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-white/5 opacity-80 hover:opacity-100"
                          title="View Profile"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {sortedUsers.map((user, index) => (
                <div 
                  key={user.username} 
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  onClick={() => handleUserClick(user.username)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{user.name}</h4>
                        <p className="text-gray-400 text-xs">@{user.username}</p>
                      </div>
                    </div>
                    <div>{getRankBadge(index + 1)}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                     <div className="bg-slate-900/50 p-2 rounded-lg text-center">
                        <p className="text-gray-500 text-xs uppercase mb-1">Global Rank</p>
                        <p className="text-white font-mono">{user.rank.toLocaleString()}</p>
                     </div>
                     <div className="bg-slate-900/50 p-2 rounded-lg text-center">
                        <p className="text-gray-500 text-xs uppercase mb-1">Total Solved</p>
                        <p className="text-blue-400 font-bold">{user.solved}</p>
                     </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-medium text-gray-400 px-1 mb-4">
                    <div className="text-center">
                      <div className="text-green-400 mb-1">{user.easy}</div>
                      <div>Easy</div>
                    </div>
                    <div className="w-px h-8 bg-slate-700"></div>
                    <div className="text-center">
                      <div className="text-yellow-400 mb-1">{user.medium}</div>
                      <div>Medium</div>
                    </div>
                    <div className="w-px h-8 bg-slate-700"></div>
                    <div className="text-center">
                      <div className="text-red-400 mb-1">{user.hard}</div>
                      <div>Hard</div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(user.username);
                    }}
                    className="w-full py-2 bg-slate-700/50 hover:bg-slate-700 text-blue-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;