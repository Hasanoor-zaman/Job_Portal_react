



import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      // 🚫 Not logged in → redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // 🔓 Remove login flag
    localStorage.removeItem("isLoggedIn");

    // Go back to login
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-200">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
      <button
        onClick={handleLogout}
        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}

