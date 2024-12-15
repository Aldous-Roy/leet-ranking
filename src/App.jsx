import React, { useState, useEffect } from "react";
import axios from "axios";
import { usernames, userNamesMap } from "./data/sampleData";
import UserList from "./component/UserList";
import "./App.css";

const App = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setError("");
      try {
        const API_BASE_URL = "https://leetcode-api-ecru.vercel.app"; 
        const promises = usernames.map((username) =>
          axios
            .get(`${API_BASE_URL}/userProfile/${username}`)
            .then((res) => {
              const data = res.data;
              console.log(data);

              return {
                username: username,
                name: userNamesMap[username] || username, // Use userNamesMap for name
                rank: data.ranking || "N/A",
                easy: data.easySolved || 0,
                medium: data.mediumSolved || 0,
                hard: data.hardSolved || 0,
                solved: data.totalSolved || 0,
              };
            })
            .catch((error) => {
              return {
                username: username,
                name: userNamesMap[username] || username,
                rank: "Error",
                easy: 0,
                medium: 0,
                hard: 0,
                solved: 0,
              };
            })
        );

        const results = await Promise.all(promises);
        setUsersData(results);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); 
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        LeetCode 
      </h1>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6"> M.Tech 2027 </h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16 border-solid"></div>
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