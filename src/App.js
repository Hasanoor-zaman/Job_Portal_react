import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import RecruiterApplications from "./Recruiter/RecruiterApplications";
import RecruiterProfile from "./Recruiter/RecruiterProfile/RecruiterProfile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/recruiterdashboard" element={<RecruiterDashboard />} />
        {/* <Route path="/recruiterjob" element={<RecruiterJobs />} /> */}
        <Route path="/recruiterapplication" element={<RecruiterApplications />} />
        <Route path="/recruiterprofile" element={<RecruiterProfile />} />
      </Routes>
    </Router>
  );
}
