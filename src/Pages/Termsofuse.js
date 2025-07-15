import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function TermsOfUse() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-300 to-blue-200 overflow-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-green-50 bg-opacity-90 p-10 rounded-xl shadow-lg max-w-3xl w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Terms of Use</h2>
        <p className="text-sm text-gray-700 mb-4">
          This website is a student project developed for educational purposes only.
          By using this site, you agree to use it responsibly and for learning only.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          We do not collect or store any real personal information. Any data entered
          is purely for demonstration. Please do not enter sensitive information.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          This project may use third-party services like Google login for demonstration,
          but no actual authentication is connected to real accounts.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          By continuing to use this site, you agree that you understand its educational nature.
        </p>

        <p className="text-sm text-gray-600 mt-6 text-center">
          <Link to="/signup" className="text-green-600 underline">
            Back to Signup
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
