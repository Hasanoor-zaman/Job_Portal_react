import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgotPassword from "./Pages/Forgotpassword";
import TermsOfUse from "./Pages/Termsofuse";
import Privatepolicy from "./Pages/Privatepolicy";
import Dashboard from "./Pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/termsofuse" element={<TermsOfUse/>} />
        <Route path="/privatepolicy" element={<Privatepolicy/>} />
      </Routes>
    </Router>
  );
}



