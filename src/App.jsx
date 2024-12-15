// src/App.js
import React, { useState, useEffect } from "react";
import UserList from "./component/UserList";
import usernames from "./data/sampleData";
import "./App.css";

const App = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading state to true initially
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
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

    fetchUserData(); // Fetch data when component mounts
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">LeetCode User Data</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16 border-solid">
            <h1 className="text-blue-500 font-bold text-center">Loading ...</h1>
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-xl text-red-500">{error}</p>
      ) : (
        <UserList users={usersData} />
      )}
    </div>
  );
};

export default App;