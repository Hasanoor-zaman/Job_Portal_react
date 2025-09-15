import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import UsersPage from "./UsersPage";
import JobsPage from "./JobsPage";
import RecruiterPage from "./RecruiterPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Users */}
        <Route path="/admin/users" element={<UsersPage />} />

        {/* Jobs */}
        <Route path="/admin/jobs" element={<JobsPage />} />

        {/* Recruiter */}
        <Route path="/admin/reports" element={<RecruiterPage />} />
      </Routes>
    </Router>
  );
}
