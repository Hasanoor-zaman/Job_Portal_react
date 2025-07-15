import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-300 to-blue-200 overflow-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-green-50 bg-opacity-90 p-10 rounded-xl shadow-lg max-w-3xl w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Privacy Policy</h2>
        <p className="text-sm text-gray-700 mb-4">
          This website is part of a university or college project. We do not store,
          share, or process any personal data for commercial use.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Any information you enter (such as your email) is used only to demonstrate
          form behavior and user flow. It is not saved in a database.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          We do not use cookies or trackers. If you have any concerns, please refrain
          from entering real personal information.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          For any questions about this project, please contact your instructor or project team.
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
