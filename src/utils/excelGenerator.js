import * as XLSX from "xlsx";

export const exportToExcel = (users) => {
  if (!users || users.length === 0) {
    alert("No data available to export.");
    return;
  }

  const oneWeekAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;

  const dataToExport = users.map((user) => {
    // Calculate weekly solved
    // Logic matches DashboardStats.jsx for consistency
    const weeklySolved = new Set(
      (user.recentSubmissions || [])
        .filter((sub) => parseInt(sub.timestamp) >= oneWeekAgo)
        .map((sub) => sub.title),
    ).size;

    return {
      Name: user.name,
      Username: user.username,
      Rank: typeof user.rank === "number" ? user.rank : "N/A",
      "Total Solved": user.solved || 0,
      "Weekly Solved": weeklySolved,
      Easy: user.easy || 0,
      Medium: user.medium || 0,
      Hard: user.hard || 0,
      "Profile Link": `https://leetcode.com/${user.username}/`,
    };
  });

  // Sort by Total Solved (descending) as the default order
  dataToExport.sort((a, b) => b["Total Solved"] - a["Total Solved"]);

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Auto-adjust column widths (basic approximation)
  const cols = Object.keys(dataToExport[0]).map((key) => ({
    wch: Math.max(key.length, 15),
  }));
  worksheet["!cols"] = cols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Student Performance");

  // Generate buffer and trigger download
  XLSX.writeFile(workbook, "LeetRanking_Report.xlsx");
};
