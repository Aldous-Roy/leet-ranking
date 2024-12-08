import React, { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const fetchLeetCodeData = async () => {
    setError("");
    setUserData(null);
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    const query = `
      query {
        matchedUser(username: "${username}") {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        "https://leetcode.com/graphql",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data.matchedUser) {
        setUserData(response.data.data.matchedUser);
      } else {
        setError("User not found or no data available.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>LeetCode User Details</h1>
      <input
        type="text"
        placeholder="Enter LeetCode username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={fetchLeetCodeData} style={{ padding: "10px" }}>
        Fetch Details
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Username: {userData.username}</h3>
          <h4>Submission Stats:</h4>
          <ul>
            {userData.submitStats.acSubmissionNum.map((stat, index) => (
              <li key={index}>
                {stat.difficulty}: {stat.count} submissions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;