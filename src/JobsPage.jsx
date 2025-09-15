import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./JobsPage.css";

export default function JobsPage() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions",
      postDate: "2025-09-01",
      endDate: "2025-10-01",
      recruiter: "Hasan Ali",
    },
    {
      id: 2,
      title: "Financial Analyst",
      company: "FinanceCorp",
      postDate: "2025-09-05",
      endDate: "2025-09-30",
      recruiter: "Sana Khan",
    },
    {
      id: 3,
      title: "Nurse Practitioner",
      company: "HealthCare Plus",
      postDate: "2025-08-28",
      endDate: "2025-09-25",
      recruiter: "John Smith",
    },
  ]);

  const handleDelete = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
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

      {/* Jobs Table */}
      <main className="jobs-container">
        <div className="jobs-table-container">
          <h2 className="jobs-title">Job Management</h2>
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company Name</th>
                <th>Post Date</th>
                <th>End Date</th>
                <th>Recruiter Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.postDate}</td>
                    <td>{job.endDate}</td>
                    <td>{job.recruiter}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(job.id)}
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
