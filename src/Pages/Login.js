import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login logic
  const handleLogin = async (e) => {
  e.preventDefault();

  if (email === "" || password === "") {
    alert("Please enter both email and password.");
    return;
  }

  try {
    // Fake login logic (replace with real API)
    alert("Login successful!");

    // 🔑 Store login flag
    localStorage.setItem("isLoggedIn", "true");

    // Redirect to dashboard
    navigate("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-300 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-green-50 bg-opacity-90 p-10 rounded-xl shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-semibold mb-6">Log in</h2>

        <button className="flex items-center justify-center w-full border border-gray-400 rounded-full py-2 mb-6 hover:bg-gray-100">
          <img
            src="/download.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Log in with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="mx-2 text-black-500">OR</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col text-left">
          <label className="mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="border border-gray-300 rounded px-4 py-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 rounded px-4 py-2 mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600 mr-1">Remember me</span>
            </div>
            <Link to="/forgotpassword" className="text-sm text-green-600 underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors"
          >
            Log in
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-600 underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
