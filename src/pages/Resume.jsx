import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const emptyEducation = { degree: "", institution: "", start_year: "", end_year: "", description: "" };
const emptyExperience = { job_title: "", company: "", start_date: "", end_date: "", description: "" };
const emptyProject = { name: "", description: "", technologies: "", url: "" };
const emptyCertification = { name: "", organization: "", issue_date: "", credential_id: "", credential_url: "" };

const blankResume = {
  full_name: "",
  email: "",
  phone: "",
  location: "",
  profile_photo_url: "",
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: "",
  interests: "",
  github_url: "",
  linkedin_url: "",
};

function Resume() {
  const [resume, setResume] = useState(blankResume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [skillDraft, setSkillDraft] = useState("");

  const showMessage = (text, kind = "success") => {
    setMessage({ text, kind });
    window.setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user || null;

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setAuthUser(user);

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        showMessage(`Could not load your resume: ${error.message}`, "error");
      } else if (data) {
        setResume({
          ...blankResume,
          ...data,
          education: Array.isArray(data.education) ? data.education : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          skills: Array.isArray(data.skills) ? data.skills : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
        });
      }

      setLoading(false);
    };

    init();
  }, []);

  const setField = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setResume((prev) => {
      const next = [...prev[field]];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, [field]: next };
    });
  };

  const addArrayItem = (field, emptyItem) => {
    setResume((prev) => ({ ...prev, [field]: [...prev[field], { ...emptyItem }] }));
  };

  const removeArrayItem = (field, index) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    if (!resume.full_name.trim()) return "Please enter your full name.";
    if (!resume.email.trim()) return "Please enter your email.";
    return null;
  };

  const saveResume = async () => {
    const validationError = validate();
    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    setSaving(true);

    const payload = {
      ...resume,
      user_id: authUser.id,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("resumes")
      .select("id")
      .eq("user_id", authUser.id)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from("resumes")
        .update(payload)
        .eq("user_id", authUser.id)
        .select("*")
        .maybeSingle();
    } else {
      result = await supabase
        .from("resumes")
        .insert(payload)
        .select("*")
        .maybeSingle();
    }

    setSaving(false);

    if (result.error) {
      showMessage(`Save failed: ${result.error.message}`, "error");
      return;
    }

    if (result.data) {
      setResume({
        ...blankResume,
        ...result.data,
        education: Array.isArray(result.data.education) ? result.data.education : [],
        experience: Array.isArray(result.data.experience) ? result.data.experience : [],
        skills: Array.isArray(result.data.skills) ? result.data.skills : [],
        projects: Array.isArray(result.data.projects) ? result.data.projects : [],
        certifications: Array.isArray(result.data.certifications) ? result.data.certifications : [],
      });
    }

    showMessage("Resume saved successfully!", "success");
  };

  const clearResume = async () => {
    const confirmClear = window.confirm("Are you sure you want to clear your resume? This will remove it from your account.");
    if (!confirmClear) return;

    setResume(blankResume);

    if (authUser) {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("user_id", authUser.id);

      if (error) {
        showMessage(`Could not clear saved resume: ${error.message}`, "error");
        return;
      }
    }

    showMessage("Resume cleared.", "success");
  };

  const downloadPDF = () => {
    window.print();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    const ext = file.name.split(".").pop();
    const path = `${authUser.id}/profile.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("resume-photos")
      .upload(path, file, { upsert: true });

    if (upErr) {
      showMessage(`Photo upload failed: ${upErr.message}`, "error");
      return;
    }

    const { data: pub } = supabase.storage
      .from("resume-photos")
      .getPublicUrl(path);

    setField("profile_photo_url", pub.publicUrl);
    showMessage("Profile photo updated. Click Save to keep it.", "success");
  };

  if (loading) {
    return (
      <div className="resume-page">
        <p className="loading-text">Loading your resume...</p>
      </div>
    );
  }

  const addSkill = () => {
    const trimmed = skillDraft.trim();
    if (!trimmed) return;
    setResume((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillDraft("");
  };

  return (
    <div className="resume-page">
      <div className="resume-editor">
        <div className="page-header">
          <h1>Resume Builder</h1>
          <p>Create your professional resume with CareerIQ.</p>
        </div>

        {message && (
          <div className={`status-banner ${message.kind}`}>{message.text}</div>
        )}

        {/* PERSONAL INFORMATION */}
        <div className="form-heading">Personal Information</div>

        <div className="photo-row">
          <div className="photo-preview">
            {resume.profile_photo_url ? (
              <img src={resume.profile_photo_url} alt="Profile" />
            ) : (
              <div className="photo-placeholder">No photo</div>
            )}
          </div>
          <div className="photo-input">
            <label className="file-label">
              Upload Profile Photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </label>
            {resume.profile_photo_url && (
              <button
                type="button"
                className="link-btn"
                onClick={() => setField("profile_photo_url", "")}
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={resume.full_name}
          onChange={(e) => setField("full_name", e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={resume.email}
          onChange={(e) => setField("email", e.target.value)}
        />

        <label>Phone</label>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={resume.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />

        <label>Location</label>
        <input
          type="text"
          placeholder="City, Country"
          value={resume.location}
          onChange={(e) => setField("location", e.target.value)}
        />

        <label>GitHub Profile URL</label>
        <input
          type="url"
          placeholder="https://github.com/yourusername"
          value={resume.github_url}
          onChange={(e) => setField("github_url", e.target.value)}
        />

        <label>LinkedIn Profile URL</label>
        <input
          type="url"
          placeholder="https://linkedin.com/in/yourusername"
          value={resume.linkedin_url}
          onChange={(e) => setField("linkedin_url", e.target.value)}
        />

        {/* PROFESSIONAL SUMMARY */}
        <div className="form-heading">Professional Summary</div>
        <textarea
          placeholder="Write a short professional summary about yourself..."
          value={resume.summary}
          onChange={(e) => setField("summary", e.target.value)}
        />

        {/* EDUCATION */}
        <div className="form-heading-row">
          <div className="form-heading">Education</div>
          <button type="button" className="add-btn" onClick={() => addArrayItem("education", emptyEducation)}>
            + Add Education
          </button>
        </div>
        {resume.education.map((edu, i) => (
          <div className="repeat-item" key={i}>
            <label>Degree</label>
            <input
              type="text"
              placeholder="B.Tech Computer Science"
              value={edu.degree}
              onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)}
            />
            <label>Institution</label>
            <input
              type="text"
              placeholder="XYZ University"
              value={edu.institution}
              onChange={(e) => updateArrayItem("education", i, "institution", e.target.value)}
            />
            <div className="two-col">
              <div>
                <label>Start Year</label>
                <input
                  type="text"
                  placeholder="2022"
                  value={edu.start_year}
                  onChange={(e) => updateArrayItem("education", i, "start_year", e.target.value)}
                />
              </div>
              <div>
                <label>End Year</label>
                <input
                  type="text"
                  placeholder="2026"
                  value={edu.end_year}
                  onChange={(e) => updateArrayItem("education", i, "end_year", e.target.value)}
                />
              </div>
            </div>
            <label>Description</label>
            <textarea
              placeholder="Relevant coursework, honors, activities..."
              value={edu.description}
              onChange={(e) => updateArrayItem("education", i, "description", e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => removeArrayItem("education", i)}>
              Remove
            </button>
          </div>
        ))}

        {/* EXPERIENCE */}
        <div className="form-heading-row">
          <div className="form-heading">Experience</div>
          <button type="button" className="add-btn" onClick={() => addArrayItem("experience", emptyExperience)}>
            + Add Experience
          </button>
        </div>
        {resume.experience.map((exp, i) => (
          <div className="repeat-item" key={i}>
            <label>Job Title</label>
            <input
              type="text"
              placeholder="Software Developer Intern"
              value={exp.job_title}
              onChange={(e) => updateArrayItem("experience", i, "job_title", e.target.value)}
            />
            <label>Company</label>
            <input
              type="text"
              placeholder="ABC Company"
              value={exp.company}
              onChange={(e) => updateArrayItem("experience", i, "company", e.target.value)}
            />
            <div className="two-col">
              <div>
                <label>Start Date</label>
                <input
                  type="text"
                  placeholder="June 2025"
                  value={exp.start_date}
                  onChange={(e) => updateArrayItem("experience", i, "start_date", e.target.value)}
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="text"
                  placeholder="August 2025"
                  value={exp.end_date}
                  onChange={(e) => updateArrayItem("experience", i, "end_date", e.target.value)}
                />
              </div>
            </div>
            <label>Description</label>
            <textarea
              placeholder="What you worked on and achieved..."
              value={exp.description}
              onChange={(e) => updateArrayItem("experience", i, "description", e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => removeArrayItem("experience", i)}>
              Remove
            </button>
          </div>
        ))}

        {/* SKILLS */}
        <div className="form-heading-row">
          <div className="form-heading">Skills</div>
        </div>
        <div className="skills-input">
          <input
            type="text"
            placeholder="Add a skill and press Enter"
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <button type="button" className="add-btn" onClick={addSkill}>
            Add Skill
          </button>
          <div className="skill-chips">
            {resume.skills.map((skill, i) => (
              <span className="skill-chip" key={i}>
                {skill}
                <button type="button" onClick={() => removeArrayItem("skills", i)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="form-heading-row">
          <div className="form-heading">Projects</div>
          <button type="button" className="add-btn" onClick={() => addArrayItem("projects", emptyProject)}>
            + Add Project
          </button>
        </div>
        {resume.projects.map((proj, i) => (
          <div className="repeat-item" key={i}>
            <label>Project Name</label>
            <input
              type="text"
              placeholder="CareerIQ - Resume Builder"
              value={proj.name}
              onChange={(e) => updateArrayItem("projects", i, "name", e.target.value)}
            />
            <label>Description</label>
            <textarea
              placeholder="What the project does..."
              value={proj.description}
              onChange={(e) => updateArrayItem("projects", i, "description", e.target.value)}
            />
            <label>Technologies</label>
            <input
              type="text"
              placeholder="React, Node.js, Supabase"
              value={proj.technologies}
              onChange={(e) => updateArrayItem("projects", i, "technologies", e.target.value)}
            />
            <label>Project URL</label>
            <input
              type="url"
              placeholder="https://github.com/user/project"
              value={proj.url}
              onChange={(e) => updateArrayItem("projects", i, "url", e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => removeArrayItem("projects", i)}>
              Remove
            </button>
          </div>
        ))}

        {/* CERTIFICATIONS */}
        <div className="form-heading-row">
          <div className="form-heading">Certifications</div>
          <button type="button" className="add-btn" onClick={() => addArrayItem("certifications", emptyCertification)}>
            + Add Certification
          </button>
        </div>
        {resume.certifications.map((cert, i) => (
          <div className="repeat-item" key={i}>
            <label>Certification Name</label>
            <input
              type="text"
              placeholder="AWS Cloud Practitioner"
              value={cert.name}
              onChange={(e) => updateArrayItem("certifications", i, "name", e.target.value)}
            />
            <label>Issuing Organization</label>
            <input
              type="text"
              placeholder="Amazon Web Services"
              value={cert.organization}
              onChange={(e) => updateArrayItem("certifications", i, "organization", e.target.value)}
            />
            <label>Issue Date</label>
            <input
              type="text"
              placeholder="January 2025"
              value={cert.issue_date}
              onChange={(e) => updateArrayItem("certifications", i, "issue_date", e.target.value)}
            />
            <label>Credential ID</label>
            <input
              type="text"
              placeholder="ABC-12345"
              value={cert.credential_id}
              onChange={(e) => updateArrayItem("certifications", i, "credential_id", e.target.value)}
            />
            <label>Credential URL</label>
            <input
              type="url"
              placeholder="https://credential.example.com/..."
              value={cert.credential_url}
              onChange={(e) => updateArrayItem("certifications", i, "credential_url", e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => removeArrayItem("certifications", i)}>
              Remove
            </button>
          </div>
        ))}

        {/* ACHIEVEMENTS */}
        <div className="form-heading">Achievements</div>
        <textarea
          placeholder={"• Won first prize in college hackathon\n• Secured top 10 position in coding competition"}
          value={resume.achievements}
          onChange={(e) => setField("achievements", e.target.value)}
        />

        {/* AREA OF INTEREST */}
        <div className="form-heading">Area of Interest</div>
        <textarea
          placeholder="Web Development, Artificial Intelligence, Data Science, Cybersecurity"
          value={resume.interests}
          onChange={(e) => setField("interests", e.target.value)}
        />

        {/* BUTTONS */}
        <div className="button-row">
          <button className="save-btn" onClick={saveResume} disabled={saving}>
            {saving ? "Saving..." : "Save Resume"}
          </button>
          <button className="clear-btn" onClick={clearResume}>
            Clear
          </button>
          <button className="pdf-btn" onClick={downloadPDF}>
            Download PDF
          </button>
          <button className="back-btn" onClick={() => (window.location.href = "/")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="preview-container">
        <h2 className="preview-title">Resume Preview</h2>
        <div className="resume-preview">
          <div className="preview-header">
            {resume.profile_photo_url && (
              <img src={resume.profile_photo_url} alt="Profile" className="preview-photo" />
            )}
            <h1>{resume.full_name || "Your Name"}</h1>
            <div className="contact-info">
              {resume.email && <span>{resume.email}</span>}
              {resume.phone && <span>{resume.phone}</span>}
              {resume.location && <span>{resume.location}</span>}
            </div>
            {(resume.github_url || resume.linkedin_url) && (
              <div className="social-info">
                {resume.github_url && (
                  <a href={resume.github_url.startsWith("http") ? resume.github_url : `https://${resume.github_url}`} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
                {resume.linkedin_url && (
                  <a href={resume.linkedin_url.startsWith("http") ? resume.linkedin_url : `https://${resume.linkedin_url}`} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>

          {resume.summary && (
            <section className="preview-section">
              <h2>Professional Summary</h2>
              <p>{resume.summary}</p>
            </section>
          )}

          {resume.education.length > 0 && (
            <section className="preview-section">
              <h2>Education</h2>
              {resume.education.map((edu, i) => (
                <div className="preview-entry" key={i}>
                  <div className="entry-head">
                    <strong>{edu.degree || "Degree"}</strong>
                    <span className="entry-date">
                      {[edu.start_year, edu.end_year].filter(Boolean).join(" - ")}
                    </span>
                  </div>
                  <div className="entry-sub">{edu.institution}</div>
                  {edu.description && <p>{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {resume.experience.length > 0 && (
            <section className="preview-section">
              <h2>Experience</h2>
              {resume.experience.map((exp, i) => (
                <div className="preview-entry" key={i}>
                  <div className="entry-head">
                    <strong>{exp.job_title || "Job Title"}</strong>
                    <span className="entry-date">
                      {[exp.start_date, exp.end_date].filter(Boolean).join(" - ")}
                    </span>
                  </div>
                  <div className="entry-sub">{exp.company}</div>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {resume.skills.length > 0 && (
            <section className="preview-section">
              <h2>Skills</h2>
              <p>{resume.skills.join(", ")}</p>
            </section>
          )}

          {resume.projects.length > 0 && (
            <section className="preview-section">
              <h2>Projects</h2>
              {resume.projects.map((proj, i) => (
                <div className="preview-entry" key={i}>
                  <div className="entry-head">
                    <strong>{proj.name || "Project"}</strong>
                    {proj.url && (
                      <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noreferrer" className="entry-link">
                        Link
                      </a>
                    )}
                  </div>
                  {proj.technologies && <div className="entry-sub">{proj.technologies}</div>}
                  {proj.description && <p>{proj.description}</p>}
                </div>
              ))}
            </section>
          )}

          {resume.certifications.length > 0 && (
            <section className="preview-section">
              <h2>Certifications</h2>
              {resume.certifications.map((cert, i) => (
                <div className="preview-entry" key={i}>
                  <div className="entry-head">
                    <strong>{cert.name || "Certification"}</strong>
                    {cert.issue_date && <span className="entry-date">{cert.issue_date}</span>}
                  </div>
                  <div className="entry-sub">{cert.organization}</div>
                  {cert.credential_id && <p>Credential ID: {cert.credential_id}</p>}
                  {cert.credential_url && (
                    <p>
                      <a href={cert.credential_url.startsWith("http") ? cert.credential_url : `https://${cert.credential_url}`} target="_blank" rel="noreferrer">
                        View Credential
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {resume.achievements && (
            <section className="preview-section">
              <h2>Achievements</h2>
              <p>{resume.achievements}</p>
            </section>
          )}

          {resume.interests && (
            <section className="preview-section">
              <h2>Area of Interest</h2>
              <p>{resume.interests}</p>
            </section>
          )}
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f3f4f6; }

        .resume-page { max-width: 1150px; margin: 0 auto; padding: 40px 20px 70px; }
        .loading-text { text-align: center; padding: 60px 0; color: #6b7280; font-size: 16px; }

        .resume-editor { background: white; padding: 35px; border-radius: 14px; box-shadow: 0 5px 25px rgba(0,0,0,0.08); }
        .page-header { text-align: center; margin-bottom: 30px; }
        .page-header h1 { margin: 0; font-size: 34px; color: #1f2937; }
        .page-header p { color: #6b7280; margin-top: 10px; font-size: 16px; }

        .status-banner { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; font-weight: 600; }
        .status-banner.success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .status-banner.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

        .form-heading { margin-top: 35px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #2446a8; font-size: 20px; font-weight: 700; color: #2446a8; }
        .form-heading-row { display: flex; justify-content: space-between; align-items: center; margin-top: 35px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #2446a8; }
        .form-heading-row .form-heading { margin: 0; border: none; padding: 0; }

        label { display: block; margin-top: 20px; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151; }
        input, textarea { display: block; width: 100%; padding: 13px 15px; border: 1px solid #d1d5db; border-radius: 7px; font-size: 15px; font-family: Arial, Helvetica, sans-serif; background: white; color: #111827; outline: none; transition: 0.2s; }
        input:focus, textarea:focus { border-color: #2446a8; box-shadow: 0 0 0 3px rgba(36,70,168,0.12); }
        textarea { min-height: 100px; resize: vertical; line-height: 1.5; }

        .photo-row { display: flex; align-items: center; gap: 18px; margin-top: 18px; }
        .photo-preview img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb; }
        .photo-placeholder { width: 80px; height: 80px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #9ca3af; border: 2px dashed #d1d5db; }
        .photo-input { display: flex; flex-direction: column; gap: 8px; }
        .file-label { display: inline-block; padding: 10px 16px; background: #2446a8; color: white; border-radius: 7px; cursor: pointer; font-size: 14px; font-weight: 600; margin: 0; }
        .file-label input { display: none; }
        .link-btn { background: none; border: none; color: #e63946; cursor: pointer; font-size: 13px; padding: 0; text-decoration: underline; }

        .repeat-item { border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; margin: 14px 0; background: #fafbff; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .two-col label { margin-top: 14px; }

        .add-btn { background: #2446a8; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; }
        .add-btn:hover { background: #183680; }
        .remove-btn { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; padding: 7px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; margin-top: 10px; }

        .skills-input input { margin-bottom: 10px; }
        .skill-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-chip { background: #e0e7ff; color: #2446a8; padding: 6px 12px; border-radius: 16px; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; }
        .skill-chip button { background: none; border: none; color: #2446a8; cursor: pointer; font-size: 16px; padding: 0; line-height: 1; }

        .button-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .button-row button { border: none; border-radius: 7px; padding: 13px 21px; font-size: 15px; cursor: pointer; color: white; transition: all 0.2s; }
        .button-row button:disabled { opacity: 0.6; cursor: not-allowed; }
        .button-row button:hover:not(:disabled) { transform: translateY(-1px); opacity: 0.9; }
        .save-btn { background: #2446a8; }
        .clear-btn { background: #e63946; }
        .pdf-btn { background: #198754; }
        .back-btn { background: #666666; }

        .preview-container { margin-top: 45px; }
        .preview-title { text-align: center; color: #1f2937; font-size: 26px; margin-bottom: 20px; }
        .resume-preview { background: white; width: 100%; max-width: 850px; min-height: 1100px; margin: 0 auto; padding: 55px 65px; box-shadow: 0 5px 25px rgba(0,0,0,0.12); color: #222; }

        .preview-header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 20px; margin-bottom: 30px; }
        .preview-photo { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; margin-bottom: 14px; border: 2px solid #e5e7eb; }
        .preview-header h1 { font-size: 35px; margin: 0 0 12px; color: #111827; word-break: break-word; }
        .contact-info { display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 14px; color: #555; }
        .social-info { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 10px; font-size: 14px; }
        .social-info a { color: #2446a8; text-decoration: none; font-weight: 600; }
        .social-info a:hover { text-decoration: underline; }

        .preview-section { margin-bottom: 28px; page-break-inside: avoid; }
        .preview-section h2 { font-size: 18px; text-transform: uppercase; border-bottom: 1px solid #bdbdbd; padding-bottom: 7px; margin: 0 0 12px; color: #222; }
        .preview-section p { white-space: pre-line; line-height: 1.7; font-size: 15px; color: #444; margin: 0; word-break: break-word; }

        .preview-entry { margin-bottom: 14px; }
        .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
        .entry-head strong { font-size: 16px; color: #111827; }
        .entry-date { font-size: 13px; color: #6b7280; white-space: nowrap; }
        .entry-sub { font-size: 14px; color: #2446a8; font-weight: 600; margin: 2px 0 4px; }
        .entry-link { font-size: 13px; color: #2446a8; text-decoration: none; }
        .entry-link:hover { text-decoration: underline; }

        @media print {
          body { background: white; }
          .resume-page { padding: 0; margin: 0; max-width: none; }
          .resume-editor { display: none !important; }
          .preview-title { display: none !important; }
          .preview-container { margin: 0; }
          .resume-preview { display: block; width: 100%; max-width: none; min-height: auto; margin: 0; padding: 40px 50px; box-shadow: none; }
          .preview-section { page-break-inside: avoid; }
          .social-info a { color: #2446a8; text-decoration: none; }
          @page { size: A4; margin: 0; }
        }

        @media (max-width: 700px) {
          .resume-page { padding: 20px 12px 40px; }
          .resume-editor { padding: 20px; }
          .page-header h1 { font-size: 27px; }
          .resume-preview { padding: 30px 25px; }
          .preview-header h1 { font-size: 28px; }
          .contact-info { flex-direction: column; gap: 6px; }
          .social-info { flex-direction: column; gap: 6px; }
          .button-row { flex-direction: column; }
          .button-row button { width: 100%; }
          .two-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default Resume;
