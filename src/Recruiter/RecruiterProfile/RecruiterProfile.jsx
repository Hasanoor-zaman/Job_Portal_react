import React, { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileRecruiter";
import styles from "./RecruiterProfile.module.css";

/* ================= Experience Section ================= */

function SectionExperience({ experience = [] }) {
  if (!experience || experience.length === 0) {
    return (
      <p className={styles.experienceEmpty}>
        No experience listed yet.
      </p>
    );
  }

  const getMonth = (monthVal) => {
    if (!monthVal) return "";
    if (typeof monthVal === "string") return monthVal;
    if (typeof monthVal === "object")
      return monthVal.month || monthVal.name || "";
    return String(monthVal);
  };

  const getYear = (yearVal) => {
    if (!yearVal) return "";
    if (typeof yearVal === "string" || typeof yearVal === "number")
      return String(yearVal);
    if (typeof yearVal === "object")
      return String(yearVal.year || yearVal.name || "");
    return "";
  };

  return (
    <div className={styles.experienceCardsWrap}>
      {experience.map((exp, i) => {
        const startMonth = getMonth(exp.start_date?.month);
        const startYear = getYear(exp.start_date?.year);
        const start = `${startMonth} ${startYear}`.trim();

        const isPresent =
          (!exp.end_date?.month && !exp.end_date?.year) ||
          exp.end_date === null ||
          exp.end_date?.present === true;

        const end = isPresent
          ? "Present"
          : (() => {
              const endMonth = getMonth(exp.end_date?.month);
              const endYear = getYear(exp.end_date?.year);
              return `${endMonth} ${endYear}`.trim();
            })();

        return (
          <div
            key={exp._id || exp.id || i}
            className={styles.experienceCard}
          >
            <div className={styles.experienceCardHeader}>
              <div>
                <h4 className={styles.experienceRole}>{exp.role}</h4>
                <p className={styles.experienceCompany}>{exp.company}</p>
                <p className={styles.experienceDuration}>
                  {start && end ? `${start} — ${end}` : start || end || ""}
                </p>
              </div>
            </div>

            {exp.description ? (
              <p className={styles.experienceDescription}>
                {exp.description}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ================= Education Section ================= */

function SectionEducation({ education = [] }) {
  if (!education || education.length === 0) {
    return (
      <p className={styles.educationEmpty}>
        No education records added yet.
      </p>
    );
  }

  return (
    <div className={styles.educationCardsWrap}>
      {education.map((e, i) => (
        <div
          key={e._id || e.id || i}
          className={styles.educationCard}
        >
          <div className={styles.educationCardHeader}>
            <div>
              <h4 className={styles.educationDegree}>{e.degree}</h4>
              <p className={styles.educationInstitution}>
                {e.institution}
              </p>
              <p className={styles.educationDuration}>
                {e?.year?.passoutyear || e.passoutyear || ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= Main Profile ================= */

export default function RecruiterProfile(user) {
  const [company, setCompany] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCompany({
        name: "Hassan Pagla",
        tagline: "Prepare the best FireCracker, Allah-hu-Fukbar",
        banner:
          "https://images.unsplash.com/photo-1603791452906-b6dfcf88f9a1?auto=format&fit=crop&w=1350&q=80",
        about:
          "GreenTech Solutions is a leading provider of eco-friendly software solutions, helping global businesses transition to sustainable and digital-first ecosystems. With over 200 employees worldwide, we deliver cloud, IoT, and AI solutions focused on energy efficiency and environmental impact.",
        EMPID: "Allah-hu-fukbar_6969",
        Work_Catagory: "Creative & Design",
        Designation: "Frontend Dev",
        skills: "React, Figma, Node.js",
        location: "New Town, India",
        pin: "Kol - 700001",
        Email: "HassanPagla69@gmail.com",
        Phno: "6969696969",

        experience: [
          {
            id: 1,
            role: "Senior Talent Acquisition Specialist",
            company: "GreenTech Solutions Pvt. Ltd.",
            start_date: { month: "Jan", year: 2020 },
            end_date: { present: true },
            description:
              "Leading the tech hiring team, building recruitment strategies, and collaborating with engineering managers to close niche roles across frontend, backend, and DevOps.",
          },
          {
            id: 2,
            role: "Talent Acquisition Partner",
            company: "NextGen Tech Labs",
            start_date: { month: "Jul", year: 2017 },
            end_date: { month: "Dec", year: 2019 },
            description:
              "Managed end-to-end recruitment for product and engineering roles, implemented campus hiring programs, and reduced average hiring time by 20%.",
          },
        ],

        education: [
          {
            id: 1,
            degree: "Master of Computer Applications (MCA)",
            institution: "ABC Institute of Technology",
            year: { passoutyear: "2024" },
          },
        ],
      });
    }, 500);
  }, []);

  if (!company)
    return <p style={{ textAlign: "center" }}>Loading recruiter profile...</p>;

  return (
    <div className={styles.recruiterPage}>
      <div className={styles.companyBanner}>
        <img
          src={company.banner}
          alt="Company Banner"
          className={styles.bannerImg}
        />
      </div>

      <div className={styles.companyProfileCard}>
        <div className={styles.companyHeader}>
          <img
            src={
              user.profile_image ||
              process.env.PUBLIC_URL + "/Images/Default.png"
            }
            alt="Profile"
            className={styles.userAvatar}
          />

          <div>
            <h2>{company.name}</h2>
            <p className={styles.tagline}>{company.tagline}</p>
            <p className={styles.location}>{company.Email}</p>
            <p className={styles.location}>{company.Phno}</p>
            <p className={styles.location}>
              {company.location}, {company.pin}
            </p>
          </div>

          <button
            className={styles.editBtn}
            onClick={() => setEditOpen(true)}
          >
            Edit Profile
          </button>
        </div>

        <div className={styles.section}>
          <h3>About Us</h3>
          <p>{company.about}</p>
        </div>

        <div className={`${styles.section} ${styles.detailsGrid}`}>
          <div><strong>Employee ID:</strong> {company.EMPID}</div>
          <div><strong>Work Catagory:</strong> {company.Work_Catagory}</div>
          <div><strong>Designation:</strong> {company.Designation}</div>
          <div><strong>Skills:</strong> {company.skills}</div>
        </div>

        <div className={styles.section}>
          <h3>Experience</h3>
          <SectionExperience experience={company.experience} />
        </div>

        <div className={styles.section}>
          <h3>Education</h3>
          <SectionEducation education={company.education} />
        </div>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        data={company}
        onSave={setCompany}
        type="recruiter"
      />
    </div>
  );
}
