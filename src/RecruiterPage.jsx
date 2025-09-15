import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RecruiterPage.css";

export default function RecruiterPage() {
  const [recruiters, setRecruiters] = useState([
    {
      id: 1,
      name: "Hasan Ali",
      email: "hasan@example.com",
      company: "Tech Solutions",
      role: "Senior Recruiter",
    },
    {
      id: 2,
      name: "Sana Khan",
      email: "sana@example.com",
      company: "FinanceCorp",
      role: "Recruiter",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john@example.com",
      company: "HealthCare Plus",
      role: "Recruiter",
    },
  ]);

  const handleDelete = (id) => {
    setRecruiters(recruiters.filter((rec) => rec.id !== id));
  };

  return (
    <div className="admin-container">
      {/* Same Navbar as AdminDashboard */}
      <header className="dashboard-header">
        <h2 className="navbar-logo">Admin Panel</h2>
        <nav className="navbar-links">
          <Link to="/admin">Overview</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/jobs">Jobs</Link>
          <Link to="/admin/reports">Recruiter</Link>
        </nav>
        <button className="logout-btn">Logout</button>
      </header>

      {/* Recruiter Table */}
      <main className="recruiter-container">
        <div className="recruiter-table-container">
          <h2 className="recruiter-title">Recruiter Management</h2>
          <table className="recruiter-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Recruiter Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No recruiters found
                  </td>
                </tr>
              ) : (
                recruiters.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.id}</td>
                    <td>{rec.name}</td>
                    <td>{rec.email}</td>
                    <td>{rec.company}</td>
                    <td>{rec.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(rec.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
