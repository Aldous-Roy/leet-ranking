// src/components/UserList.js
import React, { useState } from "react";
const UserList = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on the search term (case insensitive)
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users by rank in ascending order (if rank is a number)
  const sortedUsers = filteredUsers.sort((a, b) => a.rank - b.rank);

  if (sortedUsers.length === 0) {
    return <p>No data available.</p>;
  }
  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or username..."
          className="px-4 py-2 border rounded-lg w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <h1 className="text-center">The Topper of the class is <span className="font-bold">{sortedUsers[0].name}</span></h1>

      <table className="user-table w-full table-auto mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Rank</th>
            <th className="px-4 py-2 border">Easy</th>
            <th className="px-4 py-2 border">Medium</th>
            <th className="px-4 py-2 border">Hard</th>
            <th className="px-4 py-2 border">Solved</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.rank}</td>
              <td className="px-4 py-2">{user.easy}</td>
              <td className="px-4 py-2">{user.medium}</td>
              <td className="px-4 py-2">{user.hard}</td>
              <td className="px-4 py-2">{user.solved}</td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  );
};

export default UserList;