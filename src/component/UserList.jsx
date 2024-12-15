// src/components/UserList.js
import React from "react";

const UserList = ({ users }) => {
  if (users.length === 0) {
    return <p className="text-center text-gray-500">No data available. Click "Fetch User Data" to load users.</p>;
  }

  return (
    <div className="overflow-x-auto max-w-full mx-auto">
      <table className="table-auto w-full text-left border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border border-gray-300 text-gray-700">Username</th>
            <th className="px-4 py-2 border border-gray-300 text-gray-700">Rank</th>
            <th className="px-4 py-2 border border-gray-300 text-gray-700">Easy</th>
            <th className="px-4 py-2 border border-gray-300 text-gray-700">Medium</th>
            <th className="px-4 py-2 border border-gray-300 text-gray-700">Hard</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{user.username}</td>
              <td className="px-4 py-2 border border-gray-300">{user.rank}</td>
              <td className="px-4 py-2 border border-gray-300">{user.easy}</td>
              <td className="px-4 py-2 border border-gray-300">{user.medium}</td>
              <td className="px-4 py-2 border border-gray-300">{user.hard}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;