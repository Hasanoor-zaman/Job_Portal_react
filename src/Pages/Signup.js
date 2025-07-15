import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  // Local state for form inputs
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Example POST request to your backend API
      const response = await fetch("https://your-backend-api.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileName,
          email,
          password,
        }),
      });

      if (response.ok) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      } else {
        // Backend can return error info in JSON
        const data = await response.json();
        alert(`Signup failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-300 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-green-50 bg-opacity-90 p-10 rounded-xl shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-semibold mb-6">Sign up</h2>

        <button className="flex items-center justify-center w-full border border-gray-400 rounded-full py-2 mb-6 hover:bg-gray-100">
          <img
            src="/download.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Sign up with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="mx-2 text-black-500">OR</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>

        <form className="flex flex-col text-left" onSubmit={handleSignup}>
          <label className="mb-1 text-sm font-medium">Profile name</label>
          <input
            type="text"
            placeholder="Enter your profile name"
            className="border border-gray-300 rounded px-4 py-2 mb-4"
            required
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />

          <label className="mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="border border-gray-300 rounded px-4 py-2 mb-4"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 rounded px-4 py-2 mb-1"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <small className="text-gray-700 mb-4">
            Use 8 or more characters with a mix of letters, numbers & symbols
          </small>

          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              className="mr-2 mt-1"
              required
              defaultChecked
            />
            <p className="text-sm text-gray-700">
              By creating an account, I agree to our{" "}
              <Link to="/termsofuse" className="text-green-700 underline">
                Terms of use
              </Link>{" "}
              and{" "}
              <Link to="/privatepolicy" className="text-green-700 underline">
                Privacy Policy
              </Link>.
            </p>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
