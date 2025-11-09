import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./RecruiterDashboard.css";
import { Bell, Plus } from "lucide-react";

export default function RecruiterDashboard() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showAddJob, setShowAddJob] = useState(false);

  const profileRef = useRef(null);
  const bellRef = useRef(null);

  const user = {
    name: "Hasanoor zaman",
    email: "admin-01@gmail.com",
    profilePic: "https://via.placeholder.com/40",
  };

  const notifications = [
    { id: 1, text: "New Application for Software Engineer", time: "2h ago" },
    { id: 2, text: "Job Posting Approved", time: "1d ago" },
    { id: 3, text: "New Message from Applicant", time: "3d ago" },
  ];

  // Load job data from localStorage or use defaults
  const [jobData, setJobData] = useState(() => {
    const savedJobs = localStorage.getItem("recruiterJobs");
    if (savedJobs) return JSON.parse(savedJobs);
    return [
      { id: 1, jobName: "Software Engineer", applications: 35, status: "Active", startDate: "2024-07-01", endDate: "2024-08-01" },
      { id: 2, jobName: "Frontend Developer", applications: 20, status: "Pending", startDate: "2024-07-15", endDate: "2024-08-15" },
      { id: 3, jobName: "Data Analyst", applications: 50, status: "Active", startDate: "2024-06-20", endDate: "2024-07-20" },
      { id: 4, jobName: "UX Designer", applications: 10, status: "Suspended", startDate: "2024-07-10", endDate: "2024-08-10" },
      { id: 5, jobName: "Backend Developer", applications: 42, status: "Active", startDate: "2024-07-18", endDate: "2024-08-18" },
    ];
  });

  // Save jobs to localStorage whenever jobData changes
  useEffect(() => {
    localStorage.setItem("recruiterJobs", JSON.stringify(jobData));
  }, [jobData]);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("User signed out");
  };

  const handleBellClick = () => {
    setBellOpen(!bellOpen);
    setHasUnread(false);
  };

  const filteredJobs = jobData.filter((job) => {
    const matchesSearch = job.jobName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || job.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Add Job Form State
  const [newJob, setNewJob] = useState({
    jobName: "",
    applications: 0,
    status: "Active",
    startDate: "",
    endDate: "",
  });

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.jobName || !newJob.startDate || !newJob.endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const newEntry = {
      id: Date.now(), // unique ID
      ...newJob,
      applications: Number(newJob.applications || 0),
    };

    setJobData((prev) => [...prev, newEntry]);
    setShowAddJob(false);
    setNewJob({ jobName: "", applications: 0, status: "Active", startDate: "", endDate: "" });
  };

  const handleDeleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobData(jobData.filter((job) => job.id !== id));
    }
  };

  return (
    <div className="recruiter-container">
      {/* Navbar */}
      <header className="dashboard-header">
        <h2 className="navbar-logo">Recruiter Dashboard</h2>

        <nav className="navbar-links">
          <Link to="/recruiterdashboard">Overview</Link>
          <Link to="/recruiterapplication">Applications</Link>
        </nav>

        <div className="nav-right">
          {/* Bell Icon */}
          <div className="bell-container" ref={bellRef}>
            <button className="bell-btn" onClick={handleBellClick}>
              <Bell size={22} />
              {hasUnread && <span className="bell-dot"></span>}
            </button>

            {bellOpen && (
              <div className="bell-dropdown">
                <h4>Notifications</h4>
                {notifications.length === 0 ? (
                  <p className="no-notifs">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="notif-item">
                      <p>{n.text}</p>
                      <span>{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-menu" ref={profileRef}>
            <div className="profile-avatar" onClick={() => setMenuOpen(!menuOpen)}>
              <img src={user.profilePic} alt="Profile" className="avatar-img" />
              <span className={`arrow ${menuOpen ? "open" : ""}`}>▼</span>
            </div>

            {menuOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <img src={user.profilePic} alt="Profile" className="avatar-img" />
                  <div>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="profile-actions">
                  <button className="dropdown-btn">Edit Profile</button>
                  <button className="dropdown-btn logout" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading recruiter dashboard...</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h3>Job Management</h3>
              <div className="table-controls">
                <input
                  type="text"
                  placeholder="Search by job name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <button className="add-job-btn" onClick={() => setShowAddJob(true)}>
                  <Plus size={18} /> Add Job
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="recruiter-table">
                <thead>
                  <tr>
                    <th>Job Name</th>
                    <th>No. of Applications</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.jobName}</td>
                      <td>{job.applications}</td>
                      <td>
                        <span className={`status-badge ${job.status.toLowerCase()}`}>{job.status}</span>
                      </td>
                      <td>{job.startDate}</td>
                      <td>{job.endDate}</td>
                      <td className="action-buttons">
                        <button className="view-btn">View</button>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteJob(job.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredJobs.length === 0 && <p className="no-results">No jobs found.</p>}
            </div>
          </>
        )}
      </main>

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Job</h3>
            <form onSubmit={handleAddJob}>
              <label>
                Job Name <span>*</span>
                <input
                  type="text"
                  value={newJob.jobName}
                  onChange={(e) => setNewJob({ ...newJob, jobName: e.target.value })}
                  required
                />
              </label>

              <label>
                Applications
                <input
                  type="number"
                  value={newJob.applications}
                  onChange={(e) => setNewJob({ ...newJob, applications: e.target.value })}
                />
              </label>

              <label>
                Status
                <select
                  value={newJob.status}
                  onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>

              <label>
                Start Date <span>*</span>
                <input
                  type="date"
                  value={newJob.startDate}
                  onChange={(e) => setNewJob({ ...newJob, startDate: e.target.value })}
                  required
                />
              </label>

              <label>
                End Date <span>*</span>
                <input
                  type="date"
                  value={newJob.endDate}
                  onChange={(e) => setNewJob({ ...newJob, endDate: e.target.value })}
                  required
                />
              </label>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Add Job</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddJob(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
