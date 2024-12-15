// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
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
          axios.get(`${API_BASE_URL}/userProfile/${username}`)  // Correct endpoint for profile
            .then((res) => {
              console.log(`Data for ${username}:`, res.data);  // Log the data for debugging

              const data = res.data;

              return {
                username: username,
                rank: data.ranking || "N/A",
                easy: data.easySolved || 0,    // Assuming 'totalEasy' exists in the response
                medium: data.mediumSolved|| 0, // Assuming 'totalMedium' exists in the response
                hard: data.hardSolved || 0,    // Assuming 'totalHard' exists in the response
                solved: data.totalSolved || 0, // Add this line to fetch total solved problems
              };
            })
            .catch((error) => {
              console.error(`Error fetching data for ${username}:`, error);  // Log any error fetching data
              return {
                username: username,
                rank: "Error",
                easy: 0,
                medium: 0,
                hard: 0,
                solved: 0, // Fallback for solved count
              };
            })
        );

        const results = await Promise.all(promises);
        setUsersData(results);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false); // Set loading to false after data fetching is completed
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