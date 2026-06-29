import { Link } from 'react-router-dom';

function Projects() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">Public projects</p>
          <h1 className="page-title">Project gallery</h1>
          <p className="page-copy">Explore approved student work from different departments, technologies, and skill areas.</p>
        </div>
        <div className="panel project-toolbar">
          <input className="search-input" type="search" placeholder="Search by project, student, or technology" />
          <Link className="button button-secondary" to="/login">Recruiter sign in</Link>
        </div>
        <div className="project-list">
          <article className="panel project-row">
            <div>
              <span className="badge blue">Web app</span>
              <h2>Smart Campus Project Tracker</h2>
              <p>A dashboard concept for managing student submissions, approvals, and project discovery.</p>
            </div>
            <Link className="button button-primary" to="/login">View details</Link>
          </article>
          <article className="panel project-row">
            <div>
              <span className="badge">Machine learning</span>
              <h2>Placement Prediction System</h2>
              <p>A student-built analytics project prepared for lecturer review and recruiter browsing.</p>
            </div>
            <Link className="button button-primary" to="/login">View details</Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Projects;
