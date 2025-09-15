import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const userGrowthData = [
    { month: "Jan", users: 400 },
    { month: "Feb", users: 600 },
    { month: "Mar", users: 800 },
    { month: "Apr", users: 1200 },
    { month: "May", users: 1500 },
  ];

  const jobCategoryData = [
    { name: "IT", value: 45 },
    { name: "Finance", value: 25 },
    { name: "Healthcare", value: 15 },
    { name: "Education", value: 10 },
    { name: "Other", value: 5 },
  ];

  const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336"];

  return (
    <div className="admin-container">
      {/* Navbar */}
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

      {/* Main Dashboard */}
      <main className="dashboard">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="card">
                <h3>Total Users</h3>
                <p>1,500</p>
              </div>
              <div className="card">
                <h3>Jobs Posted</h3>
                <p>320</p>
              </div>
              <div className="card">
                <h3>Active Recruiters</h3>
                <p>85</p>
              </div>
              <div className="card">
                <h3>Pending Approvals</h3>
                <p>45</p>
              </div>
            </div>

            {/* Charts */}
            <div className="charts">
              <div className="chart-card">
                <h3>User Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#4caf50" animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Jobs by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={jobCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#4caf50"
                      dataKey="value"
                      label
                      animationDuration={1200}
                    >
                      {jobCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
