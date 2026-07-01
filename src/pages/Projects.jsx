import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getAllProjects } from '../services/projectService';

// ─── Normalise backend project shape ──────────────────────────────────────────
function normaliseProject(p) {
  return {
    ...p,
    id: p._id || p.id,
    student: p.owner
      ? { id: p.owner._id || p.owner, name: p.owner.name || 'Student' }
      : p.student || { id: '', name: 'Unknown' },
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    category: p.category || 'General',
    description: p.description || '',
  };
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllProjects()
      .then(data => {
        if (!cancelled) {
          setProjects((data || []).map(normaliseProject));
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Failed to fetch projects:', err);
          setError('Failed to load projects.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filtered = projects.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.student.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">Public projects</p>
          <h1 className="page-title">Project gallery</h1>
          <p className="page-copy">Explore approved student work from different departments, technologies, and skill areas.</p>
        </div>
        <div className="panel project-toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Search by project, student, or technology"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Link className="button button-secondary" to="/login">Recruiter sign in</Link>
        </div>

        <div className="project-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <Loader2 className="animate-spin" style={{ width: 32, height: 32, margin: '0 auto 1rem', color: 'var(--color-primary, #3b82f6)' }} />
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading projects…</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {searchQuery ? 'No projects match your search.' : 'No approved projects yet. Check back soon!'}
              </p>
            </div>
          ) : (
            filtered.map(project => (
              <article className="panel project-row" key={project.id}>
                <div>
                  <span className="badge blue">{project.category}</span>
                  <h2>{project.title}</h2>
                  <p>{project.description.length > 150 ? project.description.slice(0, 150) + '…' : project.description}</p>
                </div>
                <Link className="button button-primary" to={`/projects/${project.id}`}>View details</Link>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Projects;
