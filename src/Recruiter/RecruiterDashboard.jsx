import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";
import { Bell, Plus } from "lucide-react";

// Inlined API helper (previously in src/Recruiter/api.js)
const API_BASE = "https://demo-api.example.com/recruiter/jobs";

async function handleResponse(res) {
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.message || res.statusText || 'API error');
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(res.statusText || 'API error');
    return text;
  }
}

async function getJobs() {
  const res = await fetch(API_BASE, { method: 'GET' });
  return handleResponse(res);
}

async function getJob(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'GET' });
  return handleResponse(res);
}

async function addJob(job) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  return handleResponse(res);
}

async function updateJob(id, job) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  return handleResponse(res);
}

async function deleteJob(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
// import RecruiterProfile from "./RecruiterProfile/RecruiterProfile";

export default function RecruiterDashboard() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showAddJob, setShowAddJob] = useState(false);

  const navigate = useNavigate();
  const recruiterprofile = () => {
    navigate("/recruiterprofile");
  };

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

  // Jobs loaded from API
  const [jobData, setJobData] = useState([]);
  const [viewJob, setViewJob] = useState(null);

  // Fetch jobs from API on mount
  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      try {
        const jobs = await getJobs();
        if (mounted) setJobData(Array.isArray(jobs) ? jobs : []);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJobs();
    return () => {
      mounted = false;
    };
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
    (async () => {
      try {
        const payload = { ...newJob, applications: Number(newJob.applications || 0) };
        const created = await addJob(payload);
        // expect API to return created object with id
        setJobData((prev) => [...prev, created || payload]);
        setShowAddJob(false);
        setNewJob({ jobName: "", applications: 0, status: "Active", startDate: "", endDate: "" });
      } catch (err) {
        console.error('Add job failed', err);
        alert('Failed to add job. Check console for details.');
      }
    })();
  };

  const handleDeleteJob = (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    (async () => {
      try {
        await deleteJob(id);
        setJobData((prev) => prev.filter((job) => job.id !== id));
      } catch (err) {
        console.error('Delete failed', err);
        alert('Failed to delete job. Check console for details.');
      }
    })();
  };

  const handleViewJob = async (id) => {
    try {
      const job = await getJob(id);
      setViewJob(job);
    } catch (err) {
      console.error('View job failed', err);
      alert('Failed to load job details.');
    }
  };

  const handleEditJob = (id) => {
    const existing = jobData.find((j) => j.id === id);
    if (!existing) return alert('Job not found');
    const newName = window.prompt('Edit job name:', existing.jobName);
    if (newName === null) return; // cancelled
    const updated = { ...existing, jobName: newName };
    (async () => {
      try {
        const res = await updateJob(id, updated);
        setJobData((prev) => prev.map((j) => (j.id === id ? (res || updated) : j)));
      } catch (err) {
        console.error('Update failed', err);
        alert('Failed to update job.');
      }
    })();
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
                  <button onClick={recruiterprofile} className="dropdown-btn">View Profile</button>
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
                        <button className="view-btn" onClick={() => handleViewJob(job.id)}>View</button>
                        <button className="edit-btn" onClick={() => handleEditJob(job.id)}>Edit</button>
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

      {/* View Job Modal (from API) */}
      {viewJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Job Details</h3>
            <p><strong>{viewJob.jobName}</strong></p>
            <p>Applications: {viewJob.applications}</p>
            <p>Status: {viewJob.status}</p>
            <p>Start Date: {viewJob.startDate}</p>
            <p>End Date: {viewJob.endDate}</p>
            <div className="modal-actions">
              <button onClick={() => setViewJob(null)} className="cancel-btn">Close</button>
            </div>
          </div>
        </div>
      )}

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
