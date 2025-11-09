import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import RecruiterDashboard from "./RecruiterDashboard";
import RecruiterApplications from "./RecruiterApplications";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/recruiterdashboard" element={<RecruiterDashboard />} />
        {/* <Route path="/recruiterjob" element={<RecruiterJobs />} /> */}
        <Route path="/recruiterapplication" element={<RecruiterApplications />} />
      </Routes>
    </Router>
  );
}
