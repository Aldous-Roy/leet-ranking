// src/components/UserList.js
import React from "react";

const UserList = ({ users }) => {
  if (users.length === 0) {
    return <p>No data available.</p>;
  }

  return (
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
        {users.map((user, index) => (
          <tr key={index} className="border-b">
            <td className="px-4 py-2">{user.username}</td>
            <td className="px-4 py-2">{user.rank}</td>
            <td className="px-4 py-2">{user.easy}</td>
            <td className="px-4 py-2">{user.medium}</td>
            <td className="px-4 py-2">{user.hard}</td>
            <td className="px-4 py-2">{user.solved}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;