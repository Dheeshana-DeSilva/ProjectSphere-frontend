import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getMyProjects } from '../../services/projectService.js';

const statusClass = {
  Approved: 'status-approved',
  Pending: 'status-pending',
  Rejected: 'status-rejected',
};

export default function StudentRecentProjects() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getMyProjects(token, user)
      .then((data) => {
        if (active) setProjects((data || []).slice(0, 4));
      })
      .catch(() => {
        if (active) setProjects([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [token, user]);

  return (
    <div className="panel dashboard-content-panel">
      <div className="content-panel-header">
        <p className="eyebrow">Your work</p>
        <h2>Recent projects</h2>
      </div>

      {loading ? (
        <p className="content-panel-empty">Loading projects…</p>
      ) : projects.length === 0 ? (
        <div className="content-panel-empty">
          <p>You have not submitted any projects yet.</p>
          <Link className="button button-primary" to="/student/projects/create">Create your first project</Link>
        </div>
      ) : (
        <ul className="recent-list">
          {projects.map((project) => {
            const id = project._id || project.id;
            const status = project.status || 'Pending';
            return (
              <li key={id} className="recent-list-item">
                <div>
                  <strong>{project.title}</strong>
                  <span className={`status-pill ${statusClass[status] || 'status-pending'}`}>{status}</span>
                </div>
                <Link to={`/projects/${id}/edit`} className="recent-link">Edit</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
