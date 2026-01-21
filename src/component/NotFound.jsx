import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in zoom-in duration-500">
      {/* 404 Visual */}
      <div className="relative mb-8 group">
        <h1 className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-none select-none blur-sm opacity-50 absolute top-0 left-1/2 -translate-x-1/2 scale-110">
          404
        </h1>
        <h1 className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-none select-none relative z-10">
          404
        </h1>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Message */}
      <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8 text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all duration-200 font-medium"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
        >
          <Home size={20} />
          Back to Home
        </button>
      </div>

      {/* Decorative background hints */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
    </div>
  );
};

export default NotFound;
