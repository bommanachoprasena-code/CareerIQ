import { useState } from "react";

function Resume() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [projects, setProjects] = useState("");
  const [achievements, setAchievements] = useState("");
  const [interests, setInterests] = useState("");
  const [certifications, setCertifications] = useState("");

  // =========================
  // SAVE RESUME
  // =========================

  const saveResume = () => {
    const resumeData = {
      name,
      email,
      phone,
      github,
      linkedin,
      summary,
      education,
      skills,
      experience,
      projects,
      achievements,
      interests,
      certifications,
    };

    localStorage.setItem(
      "careerIQResume",
      JSON.stringify(resumeData)
    );

    alert("Resume saved successfully! ✅");
  };

  // =========================
  // CLEAR RESUME
  // =========================

  const clearResume = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your resume?"
    );

    if (!confirmClear) {
      return;
    }

    setName("");
    setEmail("");
    setPhone("");
    setGithub("");
    setLinkedin("");
    setSummary("");
    setEducation("");
    setSkills("");
    setExperience("");
    setProjects("");
    setAchievements("");
    setInterests("");
    setCertifications("");

    localStorage.removeItem("careerIQResume");
  };

  // =========================
  // DOWNLOAD PDF
  // =========================

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="resume-page">

      {/* =========================================
          RESUME EDITOR
      ========================================== */}

      <div className="resume-editor">

        <div className="page-header">

          <h1>
            Resume Builder 📄
          </h1>

          <p>
            Create your professional resume with CareerIQ.
          </p>

        </div>


        <div className="form-section">

          {/* =========================
              PERSONAL INFORMATION
          ========================== */}

          <div className="form-heading">
            Personal Information
          </div>


          {/* NAME */}

          <label>
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />


          {/* EMAIL */}

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          {/* PHONE */}

          <label>
            Phone
          </label>

          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />


          {/* GITHUB */}

          <label>
            GitHub Profile
          </label>

          <input
            type="url"
            placeholder="https://github.com/yourusername"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />


          {/* LINKEDIN */}

          <label>
            LinkedIn Profile
          </label>

          <input
            type="url"
            placeholder="https://linkedin.com/in/yourusername"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />


          {/* =========================
              PROFESSIONAL SUMMARY
          ========================== */}

          <div className="form-heading">
            Professional Information
          </div>


          <label>
            Professional Summary 📝
          </label>

          <textarea
            placeholder="Write a short professional summary about yourself..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />


          {/* =========================
              EDUCATION
          ========================== */}

          <label>
            Education 🎓
          </label>

          <textarea
            placeholder={
              "Example:\nB.Tech Computer Science - XYZ University - 2026"
            }
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />


          {/* =========================
              SKILLS
          ========================== */}

          <label>
            Skills 💻
          </label>

          <textarea
            placeholder={
              "Example: JavaScript, React, Python, Java, SQL"
            }
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />


          {/* =========================
              EXPERIENCE
          ========================== */}

          <label>
            Experience 💼
          </label>

          <textarea
            placeholder={
              "Example:\nSoftware Developer Intern - ABC Company\nJune 2025 - August 2025\nWorked on React applications and REST APIs."
            }
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />


          {/* =========================
              PROJECTS
          ========================== */}

          <label>
            Projects 🚀
          </label>

          <textarea
            placeholder={
              "Example:\nCareerIQ - Resume Builder\nBuilt a resume builder using React.js.\n\nE-Commerce Website\nDeveloped an online shopping application."
            }
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />


          {/* =========================
              ACHIEVEMENTS
          ========================== */}

          <label>
            Achievements 🏆
          </label>

          <textarea
            placeholder={
              "Example:\n• Won first prize in college hackathon\n• Secured top 10 position in coding competition\n• Organized technical symposium"
            }
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
          />


          {/* =========================
              AREA OF INTEREST
          ========================== */}

          <label>
            Area of Interest 🎯
          </label>

          <textarea
            placeholder={
              "Example: Web Development, Artificial Intelligence, Data Science, Cybersecurity"
            }
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />


          {/* =========================
              CERTIFICATIONS
          ========================== */}

          <label>
            Certifications 📜
          </label>

          <textarea
            placeholder={
              "Example:\n• AWS Cloud Practitioner\n• Google Data Analytics Certificate\n• Microsoft Azure Fundamentals"
            }
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
          />

        </div>


        {/* =========================
            BUTTONS
        ========================== */}

        <div className="button-row">

          <button
            className="save-btn"
            onClick={saveResume}
          >
            💾 Save Resume
          </button>


          <button
            className="clear-btn"
            onClick={clearResume}
          >
            🗑️ Clear
          </button>


          <button
            className="pdf-btn"
            onClick={downloadPDF}
          >
            📥 Download PDF
          </button>


          <button
            className="back-btn"
            onClick={() => (window.location.href = "/")}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>


      {/* =========================================
          RESUME PREVIEW
      ========================================== */}

      <div className="preview-container">

        <h2 className="preview-title">
          Resume Preview
        </h2>


        <div className="resume-preview">

          {/* =========================
              RESUME HEADER
          ========================== */}

          <div className="preview-header">

            <h1>
              {name || "Your Name"}
            </h1>


            {/* CONTACT INFORMATION */}

            <div className="contact-info">

              {email && (
                <span>
                  {email}
                </span>
              )}

              {phone && (
                <span>
                  {phone}
                </span>
              )}

            </div>


            {/* SOCIAL PROFILES */}

            {(github || linkedin) && (
              <div className="social-info">

                {github && (
                  <a
                    href={
                      github.startsWith("http")
                        ? github
                        : `https://${github}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                )}


                {linkedin && (
                  <a
                    href={
                      linkedin.startsWith("http")
                        ? linkedin
                        : `https://${linkedin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                )}

              </div>
            )}

          </div>


          {/* =========================
              PROFESSIONAL SUMMARY
          ========================== */}

          {summary && (
            <section className="preview-section">

              <h2>
                Professional Summary
              </h2>

              <p>
                {summary}
              </p>

            </section>
          )}


          {/* =========================
              EDUCATION
          ========================== */}

          {education && (
            <section className="preview-section">

              <h2>
                Education
              </h2>

              <p>
                {education}
              </p>

            </section>
          )}


          {/* =========================
              SKILLS
          ========================== */}

          {skills && (
            <section className="preview-section">

              <h2>
                Skills
              </h2>

              <p>
                {skills}
              </p>

            </section>
          )}


          {/* =========================
              EXPERIENCE
          ========================== */}

          {experience && (
            <section className="preview-section">

              <h2>
                Experience
              </h2>

              <p>
                {experience}
              </p>

            </section>
          )}


          {/* =========================
              PROJECTS
          ========================== */}

          {projects && (
            <section className="preview-section">

              <h2>
                Projects
              </h2>

              <p>
                {projects}
              </p>

            </section>
          )}


          {/* =========================
              ACHIEVEMENTS
          ========================== */}

          {achievements && (
            <section className="preview-section">

              <h2>
                Achievements
              </h2>

              <p>
                {achievements}
              </p>

            </section>
          )}


          {/* =========================
              AREA OF INTEREST
          ========================== */}

          {interests && (
            <section className="preview-section">

              <h2>
                Area of Interest
              </h2>

              <p>
                {interests}
              </p>

            </section>
          )}


          {/* =========================
              CERTIFICATIONS
          ========================== */}

          {certifications && (
            <section className="preview-section">

              <h2>
                Certifications
              </h2>

              <p>
                {certifications}
              </p>

            </section>
          )}

        </div>

      </div>


      {/* =========================================
          STYLES
      ========================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        body {
          margin: 0;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background: #f3f4f6;
        }


        /* =====================================
           MAIN PAGE
        ====================================== */

        .resume-page {
          max-width: 1150px;

          margin: 0 auto;

          padding:
            40px
            20px
            70px;
        }


        /* =====================================
           EDITOR
        ====================================== */

        .resume-editor {
          background: white;

          padding: 35px;

          border-radius: 14px;

          box-shadow:
            0 5px 25px
            rgba(0, 0, 0, 0.08);
        }


        .page-header {
          text-align: center;

          margin-bottom: 30px;
        }


        .page-header h1 {
          margin: 0;

          font-size: 34px;

          color: #1f2937;
        }


        .page-header p {
          color: #6b7280;

          margin-top: 10px;

          font-size: 16px;
        }


        /* =====================================
           FORM HEADINGS
        ====================================== */

        .form-heading {
          margin-top: 35px;

          margin-bottom: 10px;

          padding-bottom: 10px;

          border-bottom:
            2px solid #2446a8;

          font-size: 20px;

          font-weight: 700;

          color: #2446a8;
        }


        /* =====================================
           FORM
        ====================================== */

        label {
          display: block;

          margin-top: 20px;

          margin-bottom: 8px;

          font-size: 15px;

          font-weight: 600;

          color: #374151;
        }


        input,
        textarea {
          display: block;

          width: 100%;

          padding:
            13px
            15px;

          border:
            1px solid
            #d1d5db;

          border-radius: 7px;

          font-size: 15px;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background: white;

          color: #111827;

          outline: none;

          transition:
            0.2s;
        }


        input:focus,
        textarea:focus {
          border-color:
            #2446a8;

          box-shadow:
            0 0 0 3px
            rgba(
              36,
              70,
              168,
              0.12
            );
        }


        textarea {
          min-height: 115px;

          resize: vertical;

          line-height: 1.5;
        }


        /* =====================================
           BUTTONS
        ====================================== */

        .button-row {
          display: flex;

          flex-wrap: wrap;

          gap: 12px;

          margin-top: 30px;
        }


        .button-row button {
          border: none;

          border-radius: 7px;

          padding:
            13px
            21px;

          font-size: 15px;

          cursor: pointer;

          color: white;

          transition:
            all 0.2s;
        }


        .button-row button:hover {
          transform:
            translateY(-1px);

          opacity: 0.9;
        }


        .save-btn {
          background:
            #2446a8;
        }


        .clear-btn {
          background:
            #e63946;
        }


        .pdf-btn {
          background:
            #198754;
        }


        .back-btn {
          background:
            #666666;
        }


        /* =====================================
           PREVIEW
        ====================================== */

        .preview-container {
          margin-top: 45px;
        }


        .preview-title {
          text-align: center;

          color: #1f2937;

          font-size: 26px;

          margin-bottom: 20px;
        }


        .resume-preview {
          background: white;

          width: 100%;

          max-width: 850px;

          min-height: 1100px;

          margin: 0 auto;

          padding:
            55px
            65px;

          box-shadow:
            0 5px 25px
            rgba(
              0,
              0,
              0,
              0.12
            );

          color: #222;
        }


        /* =====================================
           RESUME HEADER
        ====================================== */

        .preview-header {
          text-align: center;

          border-bottom:
            2px solid
            #222;

          padding-bottom: 20px;

          margin-bottom: 30px;
        }


        .preview-header h1 {
          font-size: 35px;

          margin:
            0
            0
            12px;

          color: #111827;

          word-break:
            break-word;
        }


        .contact-info {
          display: flex;

          justify-content:
            center;

          align-items:
            center;

          gap: 20px;

          flex-wrap: wrap;

          font-size: 14px;

          color: #555;
        }


        /* =====================================
           SOCIAL LINKS
        ====================================== */

        .social-info {
          display: flex;

          justify-content:
            center;

          align-items:
            center;

          gap: 20px;

          margin-top: 10px;

          font-size: 14px;
        }


        .social-info a {
          color:
            #2446a8;

          text-decoration:
            none;

          font-weight:
            600;
        }


        .social-info a:hover {
          text-decoration:
            underline;
        }


        /* =====================================
           RESUME SECTIONS
        ====================================== */

        .preview-section {
          margin-bottom: 28px;

          page-break-inside:
            avoid;
        }


        .preview-section h2 {
          font-size: 18px;

          text-transform:
            uppercase;

          border-bottom:
            1px solid
            #bdbdbd;

          padding-bottom: 7px;

          margin:
            0
            0
            12px;

          color: #222;
        }


        .preview-section p {
          white-space:
            pre-line;

          line-height:
            1.7;

          font-size: 15px;

          color: #444;

          margin: 0;

          word-break:
            break-word;
        }


        /* =====================================
           PRINT / PDF
        ====================================== */

        @media print {

          body {
            background:
              white;
          }


          .resume-page {
            padding: 0;

            margin: 0;

            max-width:
              none;
          }


          .resume-editor {
            display:
              none !important;
          }


          .preview-title {
            display:
              none !important;
          }


          .preview-container {
            margin: 0;
          }


          .resume-preview {
            display:
              block;

            width: 100%;

            max-width:
              none;

            min-height:
              auto;

            margin: 0;

            padding:
              40px
              50px;

            box-shadow:
              none;
          }


          .preview-section {
            page-break-inside:
              avoid;
          }


          .social-info a {
            color:
              #2446a8;

            text-decoration:
              none;
          }


          @page {
            size:
              A4;

            margin: 0;
          }

        }


        /* =====================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .resume-page {
            padding:
              20px
              12px
              40px;
          }


          .resume-editor {
            padding:
              20px;
          }


          .page-header h1 {
            font-size:
              27px;
          }


          .resume-preview {
            padding:
              30px
              25px;
          }


          .preview-header h1 {
            font-size:
              28px;
          }


          .contact-info {
            flex-direction:
              column;

            gap:
              6px;
          }


          .social-info {
            flex-direction:
              column;

            gap:
              6px;
          }


          .button-row {
            flex-direction:
              column;
          }


          .button-row button {
            width:
              100%;
          }

        }

      `}</style>

    </div>
  );
}

export default Resume;