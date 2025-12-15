import React, { useState, useEffect, useRef } from "react";
import "./RecruiterApplications.css";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  X,
  MessageSquare,
  Video,
  Check,
  Ban,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RecruiterApplications() {
  // Navbar states
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const profileRef = useRef(null);
  const bellRef = useRef(null);

  const user = {
    name: "Hasanoor zaman",
    email: "admin-01@gmail.com",
    profilePic: "https://via.placeholder.com/40",
  };

  const notifications = [
    { id: 1, text: "New Application Received", time: "2h ago" },
    { id: 2, text: "Candidate Shortlisted", time: "1d ago" },
  ];

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

  const handleLogout = () => console.log("User signed out");
  const handleBellClick = () => {
    setBellOpen(!bellOpen);
    setHasUnread(false);
  };

  // Application states
  const [filters, setFilters] = useState({});
  const [openSection, setOpenSection] = useState("category");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Riya Sharma",
      photo: "https://randomuser.me/api/portraits/women/65.jpg",
      position: "Frontend Developer",
      company: "TechNova",
      date: "2024-10-15",
      status: "Pending",
      type: "Full Time",
      email: "riya.sharma@example.com",
      phone: "+91 98765 43210",
      resume: "https://example.com/riya_resume.pdf",
      experience: "2 Years",
      education: "B.Tech in Computer Science",
      category: "Engineering",
    },
    {
      id: 2,
      name: "Arjun Mehta",
      photo: "https://randomuser.me/api/portraits/men/33.jpg",
      position: "Data Analyst",
      company: "InnoSoft",
      date: "2024-10-10",
      status: "Shortlisted",
      type: "Intern",
      email: "arjun.mehta@example.com",
      phone: "+91 99999 11111",
      resume: "https://example.com/arjun_resume.pdf",
      experience: "1 Year",
      education: "B.Sc in Data Science",
      category: "Finance & Accounting",
    },
    {
      id: 3,
      name: "Priya Patel",
      photo: "https://randomuser.me/api/portraits/women/79.jpg",
      position: "Backend Developer",
      company: "CodeWorks",
      date: "2024-09-22",
      status: "Rejected",
      type: "Full Time",
      email: "priya.patel@example.com",
      phone: "+91 91234 56789",
      resume: "https://example.com/priya_resume.pdf",
      experience: "3 Years",
      education: "MCA",
      category: "Engineering",
    },
  ]);

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus, animate: true } : app
      )
    );
    setTimeout(() => {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, animate: false } : app))
      );
    }, 600);
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filters.category || filters.category === app.category) &&
      (!filters.status || filters.status === app.type)
  );

  const handleChatMessage = (text) => {
    const candidate = selectedApp;
    const lower = text.toLowerCase();
    let reply = "";

    if (lower.includes("experience")) {
      reply = `${candidate.name} has ${candidate.experience} of experience.`;
    } else if (lower.includes("education")) {
      reply = `${candidate.name} completed ${candidate.education}.`;
    } else if (lower.includes("status")) {
      reply = `${candidate.name}'s current status is ${candidate.status}.`;
    } else {
      reply = `I'm ${candidate.name}'s AI assistant. I can share info like experience, education, or status.`;
    }

    setChatHistory((prev) => [
      ...prev,
      { from: "recruiter", text },
      { from: "ai", text: reply },
    ]);
  };

  return (
    <div className="applications-container">
      {/* ===== Navbar (copied from dashboard) ===== */}
      <header className="dashboard-header">
        <h2 className="navbar-logo">Recruiter Dashboard</h2>

        <nav className="navbar-links">
          <Link to="/recruiterdashboard">Overview</Link>
          {/* <Link to="/recruiter/jobs">Jobs</Link> */}
          <Link to="/recruiterapplication" className="active">
            Applications
          </Link>
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
            <div
              className="profile-avatar"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img src={user.profilePic} alt="Profile" className="avatar-img" />
              <span className={`arrow ${menuOpen ? "open" : ""}`}>▼</span>
            </div>

            {menuOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="avatar-img"
                  />
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

      {/* ===== Rest of your original Applications Section ===== */}
      <div className="applications-body">
        {/* Sidebar */}
        <aside className={`filter-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </div>

          {sidebarOpen && (
            <>
              <div className="filter-header">
                <h3>Filter</h3>
                <button className="reset-btn" onClick={() => setFilters({})}>
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="filter-section">
                <div
                  className="filter-title"
                  onClick={() => toggleSection("category")}
                >
                  <h4>Job Category</h4>
                  {openSection === "category" ? <ChevronUp /> : <ChevronDown />}
                </div>
                {openSection === "category" && (
                  <div className="filter-options">
                    {[
                      "Customer Support",
                      "Design & Creative",
                      "Engineering",
                      "Finance & Accounting",
                      "Healthcare",
                    ].map((cat, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat}
                          onChange={() => setFilters({ ...filters, category: cat })}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Status */}
              <div className="filter-section">
                <div className="filter-title">
                  <h4>Job Status</h4>
                </div>
                <div className="status-buttons">
                  {["Intern", "Part Time", "Full Time", "Remote"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters({ ...filters, status: type })}
                      className={filters.status === type ? "active" : ""}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Main Section */}
        <main className="applications-main">
          <div className="applications-header">
            <h2>Manage Applications</h2>
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by applicant name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="filter-btn">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="applications-list">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className={`application-card ${app.animate ? "updated" : ""}`}
              >
                <div className="app-info">
                  <img
                    src={app.photo}
                    alt={app.name}
                    className="candidate-photo"
                  />
                  <div>
                    <h4>{app.name}</h4>
                    <p>
                      <strong>{app.position}</strong> at {app.company}
                    </p>
                    <span className={`status-tag ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="app-meta">
                  <p>Applied on: {app.date}</p>
                  <p>Type: {app.type}</p>
                </div>
                <div className="app-actions">
                  <button className="view-btn" onClick={() => setSelectedApp(app)}>
                    View
                  </button>
                  <button
                    className="shortlist-btn"
                    onClick={() => handleStatusChange(app.id, "Shortlisted")}
                  >
                    <Check size={16} /> Shortlist
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusChange(app.id, "Rejected")}
                  >
                    <Ban size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modals & Chat Panel (same as before) */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="application-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedApp(null)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <img
                src={selectedApp.photo}
                alt={selectedApp.name}
                className="modal-photo"
              />
              <div>
                <h3>{selectedApp.name}</h3>
                <p className="modal-role">
                  <strong>{selectedApp.position}</strong> at {selectedApp.company}
                </p>
              </div>
            </div>

            <div className="modal-details">
              <p>
                <strong>Email:</strong> {selectedApp.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApp.phone}
              </p>
              <p>
                <strong>Experience:</strong> {selectedApp.experience}
              </p>
              <p>
                <strong>Education:</strong> {selectedApp.education}
              </p>
              <p>
                <strong>Applied on:</strong> {selectedApp.date}
              </p>
              <div className="modal-buttons">
                <a
                  href={selectedApp.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  View Resume
                </a>
                <button
                  className="chat-btn"
                  onClick={() => {
                    setChatOpen(true);
                    setChatHistory([]);
                  }}
                >
                  <MessageSquare size={18} /> Chat
                </button>
                <button
                  className="video-btn"
                  onClick={() => setVideoCallOpen(true)}
                >
                  <Video size={18} /> Video Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {chatOpen && selectedApp && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-user">
              <img
                src={selectedApp.photo}
                alt={selectedApp.name}
                className="chat-photo"
              />
              <h4>Chat with {selectedApp.name}</h4>
            </div>
            <button onClick={() => setChatOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${
                  msg.from === "recruiter" ? "recruiter" : "ai"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  handleChatMessage(e.target.value);
                  e.target.value = "";
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousSibling;
                if (input.value.trim()) {
                  handleChatMessage(input.value);
                  input.value = "";
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
