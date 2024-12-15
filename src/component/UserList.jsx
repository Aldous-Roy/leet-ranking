// src/components/UserList.js
import React from "react";

const UserList = ({ users }) => {
  if (users.length === 0) {
    return <p>No data available. Click "Fetch User Data" to load users.</p>;
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Rank</th>
          <th>Easy</th>
          <th>Medium</th>
          <th>Hard</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.username}</td>
            <td>{user.rank}</td>
            <td>{user.easy}</td>
            <td>{user.medium}</td>
            <td>{user.hard}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;