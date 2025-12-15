// EditProfileRecruiter.jsx
import React, { useEffect, useState, useRef } from "react";
import styles from "./EditProfileRecruiter.module.css";

/**
 * Exported as EditProfileModal so it plugs into RecruiterProfile.jsx import:
 * import EditProfileModal from "./EditProfileRecruiter";
 *
 * Props:
 *  - isOpen: boolean (show/hide)
 *  - onClose: fn()
 *  - data: recruiter/company object (same structure used in RecruiterProfile.jsx)
 *  - onSave: fn(updatedData)
 *  - type: string (optional)
 */
export default function EditProfileModal({
  isOpen,
  onClose,
  data = {},
  onSave,
}) {
  const DEFAULT_AVATAR = (process.env.PUBLIC_URL || "") + "/Images/Default.png";

  // local form state
  const [local, setLocal] = useState({
    name: "",
    profile_image: "",
    Email: "",
    Phno: "",
    location: "",
    pin: "",
    EMPID: "",
    Work_Catagory: "",
    Designation: "",
    skills: "",
    about: "",
    experience: [],
    education: [],
  });

  // image preview
  const [imagePreview, setImagePreview] = useState(DEFAULT_AVATAR);
  const fileRef = useRef(null);

  // small UI pieces
  const [tab, setTab] = useState("basic"); // "basic" | "experience" | "education"

  // Experience/education temporary forms + index for editing
  const emptyExp = () => ({
    role: "",
    company: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    present: false,
    description: "",
  });
  const emptyEdu = () => ({ degree: "", institution: "", passoutyear: "" });

  const [expForm, setExpForm] = useState(emptyExp());
  const [expEditIndex, setExpEditIndex] = useState(null);
  const [eduForm, setEduForm] = useState(emptyEdu());
  const [eduEditIndex, setEduEditIndex] = useState(null);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);

  // errors
  const [errors, setErrors] = useState({});

  // initialize local state from data when opened / data changes
  useEffect(() => {
    if (!data) return;
    setLocal({
      name: data.name || "",
      profile_image: data.profile_image || data.logo || "",
      Email: data.Email || "",
      Phno: data.Phno || data.phone || "",
      location: data.location || "",
      pin: data.pin || "",
      EMPID: data.EMPID || "",
      Work_Catagory: data.Work_Catagory || "",
      Designation: data.Designation || "",
      skills: data.skills || "",
      about: data.about || "",
      experience: Array.isArray(data.experience)
        ? data.experience.map(normalizeExp)
        : [],
      education: Array.isArray(data.education)
        ? data.education.map(normalizeEdu)
        : [],
    });

    const img = data.profile_image || data.logo || DEFAULT_AVATAR;
    setImagePreview(img);
    // reset editing forms
    setExpForm(emptyExp());
    setEduForm(emptyEdu());
    setExpEditIndex(null);
    setEduEditIndex(null);
    setShowExpForm(false);
    setShowEduForm(false);
    setErrors({});
    setTab("basic");
  }, [data, isOpen]);

  // lock background scroll while modal open (match reference UX)
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // close on Escape for better UX
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // normalizers to ensure consistent UI fields
  function normalizeExp(e = {}) {
    const startMonth = e.start_date?.month || e.startMonth || "";
    const startYear = e.start_date?.year || e.startYear || "";
    const endMonth = e.end_date?.month || e.endMonth || "";
    const endYear = e.end_date?.year || e.endYear || "";
    const present =
      e.end_date === null ||
      e.end_date?.present === true ||
      (!endMonth && !endYear && !!e.present);
    return {
      id: e.id || e._id || Math.random().toString(36).slice(2, 9),
      role: e.role || "",
      company: e.company || "",
      startMonth: startMonth || "",
      startYear: startYear || "",
      endMonth: endMonth || "",
      endYear: endYear || "",
      present: !!present,
      description: e.description || "",
    };
  }
  function normalizeEdu(ed = {}) {
    return {
      id: ed.id || ed._id || Math.random().toString(36).slice(2, 9),
      degree: ed.degree || "",
      institution: ed.institution || "",
      passoutyear: ed.year?.passoutyear || ed.passoutyear || ed.passout || "",
    };
  }

  /* ---------- Basic handlers ---------- */
  function handleBasicChange(e) {
    const { name, value } = e.target;
    setLocal((s) => ({ ...s, [name]: value }));
  }

  function handleImageChange(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setLocal((s) => ({ ...s, profile_image: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  /* ---------- Experience handlers ---------- */
  function handleExpInput(e) {
    const { name, value, type, checked } = e.target;
    setExpForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function startAddExp() {
    setExpForm(emptyExp());
    setExpEditIndex(null);
    setShowExpForm(true);
    setTab("experience");
  }
  function editExp(i) {
    setExpForm(local.experience[i]);
    setExpEditIndex(i);
    setShowExpForm(true);
    setTab("experience");
  }
  function saveExp() {
    // basic validation
    if (!expForm.role || !expForm.company || !expForm.startYear) {
      setErrors({ exp: "Role, Company and Start Year are required." });
      return;
    }
    setErrors((e) => ({ ...e, exp: null }));
    const newExp = {
      ...expForm,
      id: expForm.id || Math.random().toString(36).slice(2, 9),
    };
    setLocal((s) => {
      const arr = [...s.experience];
      if (
        expEditIndex !== null &&
        expEditIndex >= 0 &&
        expEditIndex < arr.length
      ) {
        arr[expEditIndex] = newExp;
      } else {
        arr.unshift(newExp);
      }
      return { ...s, experience: arr };
    });
    setExpForm(emptyExp());
    setExpEditIndex(null);
    setShowExpForm(false);
  }
  function removeExp(i) {
    setLocal((s) => {
      const arr = s.experience.filter((_, idx) => idx !== i);
      return { ...s, experience: arr };
    });
  }

  /* ---------- Education handlers ---------- */
  function handleEduInput(e) {
    const { name, value } = e.target;
    setEduForm((f) => ({ ...f, [name]: value }));
  }
  function startAddEdu() {
    setEduForm(emptyEdu());
    setEduEditIndex(null);
    setShowEduForm(true);
    setTab("education");
  }
  function editEdu(i) {
    setEduForm(local.education[i]);
    setEduEditIndex(i);
    setShowEduForm(true);
    setTab("education");
  }
  function saveEdu() {
    if (!eduForm.degree || !eduForm.institution) {
      setErrors({ edu: "Degree and Institution are required." });
      return;
    }
    setErrors((e) => ({ ...e, edu: null }));
    const newEdu = {
      ...eduForm,
      id: eduForm.id || Math.random().toString(36).slice(2, 9),
    };
    setLocal((s) => {
      const arr = [...s.education];
      if (
        eduEditIndex !== null &&
        eduEditIndex >= 0 &&
        eduEditIndex < arr.length
      ) {
        arr[eduEditIndex] = newEdu;
      } else {
        arr.unshift(newEdu);
      }
      return { ...s, education: arr };
    });
    setEduForm(emptyEdu());
    setEduEditIndex(null);
    setShowEduForm(false);
  }
  function removeEdu(i) {
    setLocal((s) => {
      const arr = s.education.filter((_, idx) => idx !== i);
      return { ...s, education: arr };
    });
  }

  /* ---------- Save / Cancel ---------- */
  function validateBasic() {
    const errs = {};
    if (!local.name) errs.name = "Name is required.";
    if (!local.Email) errs.Email = "Email is required.";
    // minimal phone check
    if (local.Phno && !/^\d{7,15}$/.test(local.Phno))
      errs.Phno = "Phone should be digits (7-15).";
    return errs;
  }

  function handleSave() {
    const vb = validateBasic();
    if (Object.keys(vb).length > 0) {
      setErrors(vb);
      setTab("basic");
      return;
    }
    setErrors({});
    // convert experience/education to a shape similar to RecruiterProfile's sample if needed
    const payload = {
      ...data,
      name: local.name,
      profile_image: local.profile_image || imagePreview,
      Email: local.Email,
      Phno: local.Phno,
      location: local.location,
      pin: local.pin,
      EMPID: local.EMPID,
      Work_Catagory: local.Work_Catagory,
      Designation: local.Designation,
      skills: local.skills,
      about: local.about,
      experience: local.experience.map((e) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        start_date: { month: e.startMonth, year: e.startYear },
        end_date: e.present
          ? { present: true }
          : { month: e.endMonth, year: e.endYear },
        description: e.description,
      })),
      education: local.education.map((ed) => ({
        id: ed.id,
        degree: ed.degree,
        institution: ed.institution,
        year: { passoutyear: ed.passoutyear },
      })),
    };

    if (typeof onSave === "function") onSave(payload);
    if (typeof onClose === "function") onClose();
  }

  function handleCancel() {
    if (typeof onClose === "function") onClose();
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Edit Recruiter Profile</h2>
          <nav className={styles.nav}>
            <button
              className={tab === "basic" ? styles.activeTab : ""}
              onClick={() => setTab("basic")}
            >
              Basic
            </button>
            <button
              className={tab === "experience" ? styles.activeTab : ""}
              onClick={() => setTab("experience")}
            >
              Experience
            </button>
            <button
              className={tab === "education" ? styles.activeTab : ""}
              onClick={() => setTab("education")}
            >
              Education
            </button>
          </nav>
        </header>

        <div className={styles.body}>
          <aside className={styles.side}>
            <div className={styles.avatarWrap}>
              <img
                src={imagePreview || DEFAULT_AVATAR}
                alt="avatar"
                className={styles.avatar}
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <div className={styles.avatarActions}>
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => fileRef.current && fileRef.current.click()}
                >
                  Change
                </button>
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => {
                    setImagePreview(DEFAULT_AVATAR);
                    setLocal((s) => ({ ...s, profile_image: "" }));
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className={styles.quickInfo}>
              <div>
                <strong>Employee ID</strong>
                <div className={styles.qval}>{local.EMPID}</div>
              </div>
              <div>
                <strong>Category</strong>
                <div className={styles.qval}>{local.Work_Catagory}</div>
              </div>
              <div>
                <strong>Designation</strong>
                <div className={styles.qval}>{local.Designation}</div>
              </div>
            </div>
          </aside>

          <main className={styles.content}>
            {/* BASIC */}
            {tab === "basic" && (
              <section className={styles.section}>
                <h3>Basic</h3>
                <div className={styles.grid}>
                  <label>
                    Name
                    <input
                      name="name"
                      value={local.name}
                      onChange={handleBasicChange}
                    />
                    {errors.name && (
                      <small className={styles.err}>{errors.name}</small>
                    )}
                  </label>

                  <label>
                    Email
                    <input
                      name="Email"
                      value={local.Email}
                      onChange={handleBasicChange}
                    />
                    {errors.Email && (
                      <small className={styles.err}>{errors.Email}</small>
                    )}
                  </label>

                  <label>
                    Phone
                    <input
                      name="Phno"
                      value={local.Phno}
                      onChange={handleBasicChange}
                    />
                    {errors.Phno && (
                      <small className={styles.err}>{errors.Phno}</small>
                    )}
                  </label>

                  <label>
                    Address / Location
                    <input
                      name="location"
                      value={local.location}
                      onChange={handleBasicChange}
                    />
                  </label>

                  <label>
                    Pin Code
                    <input
                      name="pin"
                      value={local.pin}
                      onChange={handleBasicChange}
                    />
                  </label>

                  <label>
                    Employee ID
                    <input
                      name="EMPID"
                      value={local.EMPID}
                      onChange={handleBasicChange}
                    />
                  </label>

                  <label>
                    Work Category
                    <input
                      name="Work_Catagory"
                      value={local.Work_Catagory}
                      onChange={handleBasicChange}
                    />
                  </label>

                  <label>
                    Designation
                    <input
                      name="Designation"
                      value={local.Designation}
                      onChange={handleBasicChange}
                    />
                  </label>

                  <label className={styles.fullWidth}>
                    Skills (comma separated)
                    <input
                      name="skills"
                      value={local.skills}
                      onChange={handleBasicChange}
                    />
                  </label>

                  <label className={styles.fullWidth}>
                    About
                    <textarea
                      name="about"
                      value={local.about}
                      onChange={handleBasicChange}
                      rows={4}
                    />
                  </label>
                </div>
              </section>
            )}

            {/* EXPERIENCE */}
            {tab === "experience" && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Experience</h3>
                  <div>
                    <button
                      className={styles.smallPrimary}
                      onClick={startAddExp}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className={styles.list}>
                  {local.experience.length === 0 && (
                    <p className={styles.empty}>No experience added yet.</p>
                  )}
                  {local.experience.map((e, idx) => (
                    <div key={e.id} className={styles.listItem}>
                      <div>
                        <div className={styles.itemTitle}>
                          {e.role || "(no role)"}
                        </div>
                        <div className={styles.itemMeta}>
                          {e.company} • {e.startMonth} {e.startYear} —{" "}
                          {e.present ? "Present" : `${e.endMonth} ${e.endYear}`}
                        </div>
                        {e.description && (
                          <div className={styles.itemDesc}>{e.description}</div>
                        )}
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          onClick={() => editExp(idx)}
                          className={styles.iconBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeExp(idx)}
                          className={styles.iconBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showExpForm && (
                  <div
                    className={styles.overlayBackdrop}
                    onMouseDown={() => {
                      setShowExpForm(false);
                      setExpEditIndex(null);
                      setExpForm(emptyExp());
                      setErrors((e) => ({ ...e, exp: null }));
                    }}
                  >
                    <div
                      className={styles.overlayPanel}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className={styles.cardHeaderRow}>
                        <h4>
                          {expEditIndex === null
                            ? "Add experience"
                            : "Edit experience"}
                        </h4>
                        <button
                          className={styles.closeBtn}
                          onClick={() => {
                            setShowExpForm(false);
                            setExpEditIndex(null);
                            setExpForm(emptyExp());
                            setErrors((e) => ({ ...e, exp: null }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      {errors.exp && (
                        <small className={styles.err}>{errors.exp}</small>
                      )}
                      <div className={styles.formRow}>
                        <label>
                          Role
                          <input
                            name="role"
                            value={expForm.role}
                            onChange={handleExpInput}
                          />
                        </label>
                        <label>
                          Company
                          <input
                            name="company"
                            value={expForm.company}
                            onChange={handleExpInput}
                          />
                        </label>
                      </div>
                      <div className={styles.formRow}>
                        <label>
                          Start Month
                          <div className={styles.customSelectWrap}>
                            <button
                              type="button"
                              className={styles.customSelectTrigger}
                              onClick={() =>
                                setExpForm((f) => ({
                                  ...f,
                                  __openStartMonth: !f.__openStartMonth,
                                }))
                              }
                            >
                              {expForm.startMonth || "Select Month"}
                              <span>▾</span>
                            </button>

                            {expForm.__openStartMonth && (
                              <ul className={styles.customSelectMenu}>
                                {[
                                  "January",
                                  "February",
                                  "March",
                                  "April",
                                  "May",
                                  "June",
                                  "July",
                                  "August",
                                  "September",
                                  "October",
                                  "November",
                                  "December",
                                ].map((m) => (
                                  <li
                                    key={m}
                                    onClick={() =>
                                      setExpForm((f) => ({
                                        ...f,
                                        startMonth: m,
                                        __openStartMonth: false,
                                      }))
                                    }
                                  >
                                    {m}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </label>

                        <label>
                          Start Year
                          <div className={styles.customSelectWrap}>
                            <button
                              type="button"
                              className={styles.customSelectTrigger}
                              onClick={() =>
                                setExpForm((f) => ({
                                  ...f,
                                  __openStartYear: !f.__openStartYear,
                                }))
                              }
                            >
                              {expForm.startYear || "Select Year"}
                              <span>▾</span>
                            </button>

                            {expForm.__openStartYear && (
                              <ul className={styles.customSelectMenu}>
                                {[
                                  "2025",
                                  "2024",
                                  "2023",
                                  "2022",
                                  "2021",
                                  "2020",
                                ].map((y) => (
                                  <li
                                    key={y}
                                    onClick={() =>
                                      setExpForm((f) => ({
                                        ...f,
                                        startYear: y,
                                        __openStartYear: false,
                                      }))
                                    }
                                  >
                                    {y}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </label>
                      </div>
                      <div>
                        <div className={styles.formRow}>
                          <label>
                            End Month
                            <div
                              className={`${styles.customSelectWrap} ${
                                expForm.present
                                  ? styles.customSelectDisabled
                                  : ""
                              }`}
                            >
                              <button
                                type="button"
                                className={styles.customSelectTrigger}
                                disabled={expForm.present}
                                onClick={() =>
                                  !expForm.present &&
                                  setExpForm((f) => ({
                                    ...f,
                                    __openEndMonth: !f.__openEndMonth,
                                  }))
                                }
                              >
                                {expForm.endMonth || "Select Month"}
                                <span>▾</span>
                              </button>

                              {expForm.__openEndMonth && !expForm.present && (
                                <ul className={styles.customSelectMenu}>
                                  {[
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December",
                                  ].map((m) => (
                                    <li
                                      key={m}
                                      onClick={() =>
                                        setExpForm((f) => ({
                                          ...f,
                                          endMonth: m,
                                          __openEndMonth: false,
                                        }))
                                      }
                                    >
                                      {m}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </label>

                          <label>
                            End Year
                            <div
                              className={`${styles.customSelectWrap} ${
                                expForm.present
                                  ? styles.customSelectDisabled
                                  : ""
                              }`}
                            >
                              <button
                                type="button"
                                className={styles.customSelectTrigger}
                                disabled={expForm.present}
                                onClick={() =>
                                  !expForm.present &&
                                  setExpForm((f) => ({
                                    ...f,
                                    __openEndYear: !f.__openEndYear,
                                  }))
                                }
                              >
                                {expForm.endYear || "Select Year"}
                                <span>▾</span>
                              </button>

                              {expForm.__openEndYear && !expForm.present && (
                                <ul className={styles.customSelectMenu}>
                                  {[
                                    "2025",
                                    "2024",
                                    "2023",
                                    "2022",
                                    "2021",
                                    "2020",
                                  ].map((y) => (
                                    <li
                                      key={y}
                                      onClick={() =>
                                        setExpForm((f) => ({
                                          ...f,
                                          endYear: y,
                                          __openEndYear: false,
                                        }))
                                      }
                                    >
                                      {y}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </label>
                        </div>

                        <div className={styles.checkboxformRow}>
                          {/* Checkbox wrapped with label (keeps same behaviour) */}
                          <label className={styles.checkboxInline}>
                            <input
                              id="exp-present"
                              className={styles.checkboxInput}
                              type="checkbox"
                              name="present"
                              checked={expForm.present}
                              onChange={handleExpInput}
                            />
                            <span className={styles.checkboxLabelText}>
                              Present
                            </span>
                          </label>
                        </div>
                      </div>
                      <br></br>
                      <div className={styles.formGroup}>
                        <label>
                          Description
                          <textarea
                            name="description"
                            value={expForm.description}
                            onChange={handleExpInput}
                            rows={3}
                          />
                        </label>
                      </div>
                      <div className={styles.cardActions}>
                        <button
                          onClick={() => {
                            setExpForm(emptyExp());
                            setExpEditIndex(null);
                            setShowExpForm(false);
                            setErrors((e) => ({ ...e, exp: null }));
                          }}
                          className={styles.secondary}
                        >
                          Cancel
                        </button>
                        <button onClick={saveExp} className={styles.primary}>
                          {expEditIndex === null ? "Add Experience" : "Update"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* EDUCATION */}
            {tab === "education" && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Education</h3>
                  <div>
                    <button
                      className={styles.smallPrimary}
                      onClick={startAddEdu}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className={styles.list}>
                  {local.education.length === 0 && (
                    <p className={styles.empty}>
                      No education records added yet.
                    </p>
                  )}
                  {local.education.map((ed, idx) => (
                    <div key={ed.id} className={styles.listItem}>
                      <div>
                        <div className={styles.itemTitle}>
                          {ed.degree || "(no degree)"}
                        </div>
                        <div className={styles.itemMeta}>
                          {ed.institution} • {ed.passoutyear}
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          onClick={() => editEdu(idx)}
                          className={styles.iconBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeEdu(idx)}
                          className={styles.iconBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showEduForm && (
                  <div
                    className={styles.overlayBackdrop}
                    onMouseDown={() => {
                      setShowEduForm(false);
                      setEduEditIndex(null);
                      setEduForm(emptyEdu());
                      setErrors((e) => ({ ...e, edu: null }));
                    }}
                  >
                    <div
                      className={styles.overlayPanel}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className={styles.cardHeaderRow}>
                        <h4>
                          {eduEditIndex === null
                            ? "Add education"
                            : "Edit education"}
                        </h4>
                        <button
                          className={styles.closeBtn}
                          onClick={() => {
                            setShowEduForm(false);
                            setEduEditIndex(null);
                            setEduForm(emptyEdu());
                            setErrors((e) => ({ ...e, edu: null }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      {errors.edu && (
                        <small className={styles.err}>{errors.edu}</small>
                      )}
                      <div className={styles.formRow}>
                        <label>
                          Degree
                          <input
                            name="degree"
                            value={eduForm.degree}
                            onChange={handleEduInput}
                          />
                        </label>
                        <label>
                          Institution
                          <input
                            name="institution"
                            value={eduForm.institution}
                            onChange={handleEduInput}
                          />
                        </label>
                      </div>
                      <div className={styles.formRow}>
                        <label>
                          Passout Year
                          <div className={styles.customSelectWrap}>
                            <button
                              type="button"
                              className={styles.customSelectTrigger}
                              onClick={() =>
                                setEduForm((f) => ({
                                  ...f,
                                  __openPassoutYear: !f.__openPassoutYear,
                                }))
                              }
                            >
                              {eduForm.passoutyear || "Select Year"}
                              <span>▾</span>
                            </button>

                            {eduForm.__openPassoutYear && (
                              <ul className={styles.customSelectMenu}>
                                {[
                                  "2025",
                                  "2024",
                                  "2023",
                                  "2022",
                                  "2021",
                                  "2020",
                                ].map((y) => (
                                  <li
                                    key={y}
                                    onClick={() =>
                                      setEduForm((f) => ({
                                        ...f,
                                        passoutyear: y,
                                        __openPassoutYear: false,
                                      }))
                                    }
                                  >
                                    {y}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </label>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          onClick={() => {
                            setEduForm(emptyEdu());
                            setEduEditIndex(null);
                            setShowEduForm(false);
                            setErrors((e) => ({ ...e, edu: null }));
                          }}
                          className={styles.secondary}
                        >
                          Cancel
                        </button>
                        <button onClick={saveEdu} className={styles.primary}>
                          {eduEditIndex === null ? "Add Education" : "Update"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <small>Tip: Fill basic information before saving.</small>
          </div>
          <div className={styles.footerRight}>
            <button className={styles.secondary} onClick={handleCancel}>
              Close
            </button>
            <button className={styles.primary} onClick={handleSave}>
              Save All
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
