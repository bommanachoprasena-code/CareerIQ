import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
      }

      setUser(data?.session?.user || null);
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/login";
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to CareerIQ 🚀</h1>

        <p>
          Logged in as: <strong>{user.email}</strong>
        </p>

        <p className="subtitle">
          Your personal career development platform.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>📄 Resume</h2>
          <p>
            Build and improve your professional resume.
          </p>
          <button onClick={() => (window.location.href = "/resume")}>
  Build Resume
</button>
        </div>

        <div className="dashboard-card">
          <h2>🎯 Career Goals</h2>
          <p>
            Set your career goals and track your progress.
          </p>
          <button>Set Goals</button>
        </div>

        <div className="dashboard-card">
          <h2>💼 Job Opportunities</h2>
          <p>
            Discover job opportunities that match your skills.
          </p>
          <button>Explore Jobs</button>
        </div>

        <div className="dashboard-card">
          <h2>📊 Career Assessment</h2>
          <p>
            Understand your strengths and find suitable career paths.
          </p>
          <button>Take Assessment</button>
        </div>
      </div>

      <div className="logout-section">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;