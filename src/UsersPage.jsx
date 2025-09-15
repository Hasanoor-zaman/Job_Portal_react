import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UsersPage.css";

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Hasan Ali",
      email: "hasan@example.com",
      role: "User",
      accountType: "Manual",
    },
    {
      id: 2,
      name: "Sana Khan",
      email: "sana@example.com",
      role: "Admin",
      accountType: "Google",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john@example.com",
      role: "Recruiter",
      accountType: "Manual",
    },
  ]);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Calculate counts dynamically
  const manualUsers = users.filter((u) => u.accountType === "Manual").length;
  const googleUsers = users.filter((u) => u.accountType === "Google").length;

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

      <main className="users-container">
        {/* 🔹 Stats Cards */}
        <div className="stats-cards users-stats">
          <div className="card">
            <h3>Manual Users</h3>
            <p>{manualUsers}</p>
          </div>
          <div className="card">
            <h3>Google Users</h3>
            <p>{googleUsers}</p>
          </div>
          <div className="card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
        </div>

        {/* 🔹 Users Table */}
        <div className="users-table-container">
          <h2 className="users-title">User Management</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.accountType}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
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
