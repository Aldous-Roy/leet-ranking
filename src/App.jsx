// src/App.js
import React, { useState } from "react";
import UserList from "./component/UserList";
import usernames from "./data/sampleData";
import "./App.css";

const App = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      const API_BASE_URL = "https://leetcode-api-ecru.vercel.app"; // Your API endpoint

      // Fetch data for all usernames
      const promises = usernames.map((username) =>
        fetch(`${API_BASE_URL}/userProfile/${username}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch data for ${username}`);
            }
            return res.json();
          })
          .then((data) => ({
            username: username,
            rank: data.ranking || "N/A",
            easy: data.totalEasy || 0,
            medium: data.totalMedium || 0,
            hard: data.totalHard || 0,
          }))
      );

      const results = await Promise.all(promises);
      setUsersData(results);
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>LeetCode User Data</h1>
      <button onClick={fetchUserData} disabled={loading}>
        {loading ? "Fetching..." : "Fetch User Data"}
      </button>
      {error && <p className="error">{error}</p>}
      <UserList users={usersData} />
    </div>
  );
};

export default App;