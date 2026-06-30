import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Edit3, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { deleteProject, getMyProjects } from '../../services/projectService.js';
import { useAuth } from '../../hooks/useAuth.js';

const statusClasses = {
  Pending: 'status-pending',
  Approved: 'status-approved',
  Rejected: 'status-rejected',
};

function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function ProjectStatus({ status }) {
  const label = status || 'Pending';
  return <span className={`project-status ${statusClasses[label] || statusClasses.Pending}`}>{label}</span>;
}

function MyProjects() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const data = await getMyProjects(token, user);
        if (active) setProjects(data);
      } catch (err) {
        if (active) setError(err.response?.data?.message || err.message || 'Could not load projects.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, [token, user]);

  const stats = useMemo(() => ({
    total: projects.length,
    pending: projects.filter((project) => (project.status || 'Pending') === 'Pending').length,
    approved: projects.filter((project) => project.status === 'Approved').length,
    rejected: projects.filter((project) => project.status === 'Rejected').length,
  }), [projects]);

  const handleDelete = async (project) => {
    const confirmed = window.confirm(`Delete "${project.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(project.id);
    setError('');

    try {
      await deleteProject(project.id, token);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      setMessage('Project deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not delete project.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <section className="project-page">
      <div className="container project-page-shell">
        <div className="project-page-header project-page-header-row">
          <div>
            <span className="badge blue">Student projects</span>
            <h1 className="section-title">My projects</h1>
            <p className="page-copy">
              Track submissions, approval status, and keep your project details up to date.
            </p>
          </div>
          <Link className="button button-primary" to="/student/projects/create">
            <Plus size={18} /> Create project
          </Link>
        </div>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-error">{error}</div> : null}

        <div className="project-stat-grid">
          <article className="panel stat-card"><strong>{stats.total}</strong><span>Total projects</span></article>
          <article className="panel stat-card"><strong>{stats.pending}</strong><span>Pending</span></article>
          <article className="panel stat-card"><strong>{stats.approved}</strong><span>Approved</span></article>
          <article className="panel stat-card"><strong>{stats.rejected}</strong><span>Rejected</span></article>
        </div>

        {loading ? (
          <div className="panel placeholder-panel">Loading your projects...</div>
        ) : projects.length === 0 ? (
          <div className="panel project-empty-state">
            <h2>No projects yet</h2>
            <p>Create your first project submission and send it for lecturer review.</p>
            <Link className="button button-primary" to="/student/projects/create">
              <Plus size={18} /> Create project
            </Link>
          </div>
        ) : (
          <div className="my-project-list">
            {projects.map((project) => (
              <article className="panel my-project-card" key={project.id}>
                <div className="my-project-thumb">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={`${project.title} thumbnail`} />
                  ) : (
                    <span>{project.title.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="my-project-content">
                  <div className="my-project-title-row">
                    <h2>{project.title}</h2>
                    <ProjectStatus status={project.status} />
                  </div>
                  <p>{project.description}</p>

                  <div className="my-project-meta">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                    <span>Updated {formatDate(project.updatedAt || project.createdAt)}</span>
                  </div>

                  <div className="my-project-tech">
                    {(project.technologies || []).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="my-project-actions">
                  <Link className="button button-secondary" to={`/projects/${project.id}/edit`}>
                    <Edit3 size={17} /> Edit
                  </Link>
                  {project.status === 'Approved' ? (
                    <Link className="button button-secondary" to={`/projects/${project.id}`}>
                      <ExternalLink size={17} /> View
                    </Link>
                  ) : null}
                  <button
                    className="button button-danger"
                    type="button"
                    disabled={deletingId === project.id}
                    onClick={() => handleDelete(project)}
                  >
                    <Trash2 size={17} /> {deletingId === project.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyProjects;
