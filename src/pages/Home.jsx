import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="hero">
          <div className="hero-content">
            <p className="eyebrow">Student project platform</p>
            <h1 className="page-title">ProjectSphere</h1>
            <p className="page-copy">
              A professional space for students to publish projects, lecturers to approve submissions, and recruiters to discover emerging talent.
            </p>
            <div className="actions">
              <Link className="button button-primary" to="/projects">Browse projects</Link>
              <Link className="button button-secondary" to="/login">Sign in</Link>
            </div>
          </div>

          <div className="panel hero-visual" aria-label="ProjectSphere dashboard preview">
            <div className="preview-window">
              <div className="preview-topbar">
                <span className="window-dot"></span>
                <span className="window-dot"></span>
                <span className="window-dot"></span>
              </div>
              <div className="preview-body">
                <div className="preview-card">
                  <span className="badge blue">Approved project</span>
                  <div className="preview-line medium"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
                <div className="preview-grid">
                  <div className="preview-stat">
                    <strong>48</strong>
                    <span>Projects</span>
                  </div>
                  <div className="preview-stat">
                    <strong>16</strong>
                    <span>Pending</span>
                  </div>
                  <div className="preview-stat">
                    <strong>24</strong>
                    <span>Recruiters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-grid">
          <article className="panel feature-card">
            <span className="badge blue">Students</span>
            <h2>Create and manage projects</h2>
            <p>Upload work, edit details, and track whether each project is pending, approved, or rejected.</p>
          </article>
          <article className="panel feature-card">
            <span className="badge">Lecturers</span>
            <h2>Review submissions</h2>
            <p>Check pending projects and approve quality work before it becomes visible publicly.</p>
          </article>
          <article className="panel feature-card">
            <span className="badge gold">Recruiters</span>
            <h2>Discover talent</h2>
            <p>Search approved projects, like interesting work, and follow promising student profiles.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Home;
