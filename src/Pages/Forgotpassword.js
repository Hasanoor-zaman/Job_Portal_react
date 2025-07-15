import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgotPassword() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("If this email is registered, a password reset link has been sent!");
    // You can add real backend request here later.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-300 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-green-50 bg-opacity-90 p-10 rounded-xl shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
        <p className="text-sm text-gray-700 mb-6">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form className="flex flex-col text-left" onSubmit={handleSubmit}>
          <label className="mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="border border-gray-300 rounded px-4 py-2 mb-6"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors w-full"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-green-600 underline">
            Back to Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
