# LeetRank - M.Tech 2027 Leaderboard 🏆

A modern, fast, and responsive leaderboard dashboard to track the LeetCode progress of the M.Tech 2027 batch. Built with React and designed for a premium user experience, LeetRank helps students analyze their performance, compete in tournaments, and receive personalized AI tutoring.

![LeetRank Dashboard](https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop) _Note: Replace with actual application screenshots._

## ✨ Features

- **📊 Comprehensive Dashboard**: Real-time class statistics, including total problems solved and difficulty breakdown (Easy, Medium, Hard).
- **🥇 Live Leaderboard**: Dynamic ranking of students based on their LeetCode performance.
- **🤖 AI DSA Tutor**:
  - Get personalized study roadmaps and performance analysis.
  - Identify weak areas and receive actionable feedback.
  - Export analysis reports as PDF.
- **⚔️ Tournaments**:
  - Daily coding challenges with random problem fetching.
  - Integrated code editor (Monaco Editor) with syntax highlighting.
  - Real-time code execution and validation against test cases.
  - Language support for Java, C++, Python, and JavaScript.
- **📈 Visual Insights**: Interactive charts powered by `recharts` to analyze progress and compare performance.
- **📱 Fully Responsive**: Seamless experience across desktops, tablets, and mobile devices.
- **🎨 Modern UI**: Sleek dark mode, glassmorphism effects, and smooth animations using Tailwind CSS.
- **🔍 Smart Search**: Instantly find students by name or username.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/) / [Chart.js](https://www.chartjs.org/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **PDF Generation**: [React-PDF](https://react-pdf.org/)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/leet-ranking.git
   cd leet-ranking
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
leet-ranking/
├── src/
│   ├── component/       # UI Components (Sidebar, UserList, AITutor, etc.)
│   ├── data/            # Static data (usernames, sample data)
│   ├── utils/           # Utility functions (Excel generator, etc.)
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the dashboard or add new features:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Aldous Roy](https://github.com/Aldous-Roy)
