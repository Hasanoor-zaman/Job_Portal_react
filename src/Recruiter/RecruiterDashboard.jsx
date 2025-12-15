import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./RecruiterDashboard.css";
import { Bell, Plus } from "lucide-react";

export default function RecruiterDashboard() {
  // UI state
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [sortBy, setSortBy] = useState({ key: "startDate", dir: "desc" });

  // Dropdowns
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // Modals
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

  // click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtering + searching + sorting
  const filtered = useMemo(() => {
    let list = jobData.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.jobName.toLowerCase().includes(q) ||
          (j.description || "").toLowerCase().includes(q) ||
          (j.location || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") list = list.filter((j) => j.status === statusFilter);
    if (locationFilter !== "All") list = list.filter((j) => j.location === locationFilter);
    if (experienceFilter !== "All") list = list.filter((j) => j.experience === experienceFilter);

    // sort
    list.sort((a, b) => {
      const { key, dir } = sortBy;
      let av = a[key];
      let bv = b[key];

      if (key === "applications") {
        av = Number(av);
        bv = Number(bv);
      }

      if (key.toLowerCase().includes("date")) {
        av = new Date(av);
        bv = new Date(bv);
      }

      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [jobData, search, statusFilter, locationFilter, experienceFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // derived lists for filter dropdowns
  //const locations = useMemo(() => ["All", ...Array.from(new Set(jobData.map((j) => j.location || "")))], [jobData]);
  //const experiences = useMemo(() => ["All", ...Array.from(new Set(jobData.map((j) => j.experience || "")))], [jobData]);

  // Job forms state (optional fields: description, experience, salary, location)
  const emptyJob = {
    jobName: "",
    description: "",
    experience: "",
    salary: "",
    location: "",
    applications: 0,
    status: "Active",
    startDate: "",
    endDate: "",
  };

  const [formJob, setFormJob] = useState(emptyJob);

  const openEdit = (job) => {
    setJobToEdit(job);
    setFormJob({ ...job });
    setShowEditJob(true);
  };

  const openView = (job) => {
    setJobToView(job);
    setShowViewJob(true);
  };

  const openDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    // required fields: jobName, startDate, endDate
    if (!formJob.jobName.trim() || !formJob.startDate || !formJob.endDate) {
      alert("Please fill Job Name, Start Date and End Date.");
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
          <div className="bell-container" ref={bellRef}>
            <button
              className="bell-btn"
              onClick={() => {
                setBellOpen((b) => !b);
                setHasUnread(false);
              }}
            >
              <Bell size={22} />
              {hasUnread && <span className="bell-dot" />}
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

          <div className="profile-menu" ref={profileRef}>
            <div className="profile-avatar" onClick={() => setMenuOpen((m) => !m)}>
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

      {/* Main */}
      <main className="dashboard">
        <div className="table-header">
          <h3>Job Management</h3>

          <div className="table-controls">
            <input
              type="text"
              placeholder="Search jobs, description or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All</option>
              <option value="Remote">Remote</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
            </select>

            <select
              value={experienceFilter}
              onChange={(e) => {
                setExperienceFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All</option>
              <option value="0-1 years">0-1 years</option>
              <option value="2-4 years">2-4 years</option>
              <option value="5+ years">5+ years</option>
            </select>


            <button
              className="add-job-btn"
              onClick={() => {
                setFormJob(emptyJob);
                setShowAddJob(true);
              }}
            >
              <Plus size={16} /> Add Job
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

            {filtered.length === 0 && <p className="no-results">No jobs match your criteria.</p>}

            {/* Pagination controls */}
            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>
          </div>
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
            <form onSubmit={handleAddSubmit}>
              <label>
                Job Name <span>*</span>
                <input
                  type="text"
                  value={formJob.jobName}
                  onChange={(e) => setFormJob({ ...formJob, jobName: e.target.value })}
                  required
                />
              </label>

              <label>
                Description
                <textarea rows={3} value={formJob.description} onChange={(e) => setFormJob({ ...formJob, description: e.target.value })} />
              </label>

              <label>
                Experience
                <input type="text" value={formJob.experience} onChange={(e) => setFormJob({ ...formJob, experience: e.target.value })} />
              </label>

              <label>
                Salary
                <input type="text" value={formJob.salary} onChange={(e) => setFormJob({ ...formJob, salary: e.target.value })} />
              </label>

              <label>
                Location
                <input type="text" value={formJob.location} onChange={(e) => setFormJob({ ...formJob, location: e.target.value })} />
              </label>

              <label>
                Applications
                <input type="number" value={formJob.applications} onChange={(e) => setFormJob({ ...formJob, applications: e.target.value })} />
              </label>

              <label>
                Status
                <select value={formJob.status} onChange={(e) => setFormJob({ ...formJob, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>

              <label>
                Start Date <span>*</span>
                <input type="date" value={formJob.startDate} onChange={(e) => setFormJob({ ...formJob, startDate: e.target.value })} required />
              </label>

              <label>
                End Date <span>*</span>
                <input type="date" value={formJob.endDate} onChange={(e) => setFormJob({ ...formJob, endDate: e.target.value })} required />
              </label>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Add Job</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddJob(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJob && (
  <div 
    className="modal-overlay"
    onClick={() => setShowEditJob(false)}
    onKeyDown={(e) => e.key === "Escape" && setShowEditJob(false)}
    tabIndex={0}
  >
    <div 
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Edit Job</h3>

      <form onSubmit={handleEditSubmit}>
        <label>
          Job Name <span>*</span>
          <input type="text" value={formJob.jobName} onChange={(e) => setFormJob({ ...formJob, jobName: e.target.value })} required />
        </label>

        <label>
          Description
          <textarea rows={3} value={formJob.description} onChange={(e) => setFormJob({ ...formJob, description: e.target.value })} />
        </label>

        <label>
          Experience
          <input type="text" value={formJob.experience} onChange={(e) => setFormJob({ ...formJob, experience: e.target.value })} />
        </label>

        <label>
          Salary
          <input type="text" value={formJob.salary} onChange={(e) => setFormJob({ ...formJob, salary: e.target.value })} />
        </label>

        <label>
          Location
          <input type="text" value={formJob.location} onChange={(e) => setFormJob({ ...formJob, location: e.target.value })} />
        </label>

        <label>
          Applications
          <input type="number" value={formJob.applications} onChange={(e) => setFormJob({ ...formJob, applications: e.target.value })} />
        </label>

        <label>
          Status
          <select value={formJob.status} onChange={(e) => setFormJob({ ...formJob, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </label>

        <label>
          Start Date <span>*</span>
          <input type="date" value={formJob.startDate} onChange={(e) => setFormJob({ ...formJob, startDate: e.target.value })} required />
        </label>

        <label>
          End Date <span>*</span>
          <input type="date" value={formJob.endDate} onChange={(e) => setFormJob({ ...formJob, endDate: e.target.value })} required />
        </label>

        <div className="modal-actions">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="cancel-btn" onClick={() => setShowEditJob(false)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* View Job Modal */}
      {showViewJob && jobToView && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{jobToView.jobName}</h3>
            <p><strong>Description:</strong> {jobToView.description || "—"}</p>
            <p><strong>Experience:</strong> {jobToView.experience || "—"}</p>
            <p><strong>Salary:</strong> {jobToView.salary || "—"}</p>
            <p><strong>Location:</strong> {jobToView.location || "—"}</p>
            <p><strong>Applications:</strong> {jobToView.applications}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${jobToView.status.toLowerCase()}`}>{jobToView.status}</span></p>
            <p><strong>Start:</strong> {jobToView.startDate} &nbsp; <strong>End:</strong> {jobToView.endDate}</p>

            <div className="modal-actions">
              <button className="save-btn" onClick={() => setShowViewJob(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && jobToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{jobToDelete.jobName}</strong>?</p>
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleConfirmDelete}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


