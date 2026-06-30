import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { getProjectById, updateProject } from '../../services/projectService.js';
import { useAuth } from '../../hooks/useAuth.js';
import ProjectForm from './ProjectForm.jsx';

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const data = await getProjectById(id, token);

        if (!active) return;

        if (!data || (data.ownerId && data.ownerId !== user.id)) {
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (err) {
        if (active) setError(err.response?.data?.message || err.message || 'Could not load project.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();
    return () => {
      active = false;
    };
  }, [id, token, user.id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');

    try {
      await updateProject(id, values, token);
      navigate('/student/projects', {
        state: { message: 'Project updated and moved back to pending review.' },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not update project.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="project-page">
        <div className="container">
          <div className="panel placeholder-panel">Loading project...</div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="project-page">
        <div className="container">
          <div className="panel placeholder-panel text-center">
            <h1 className="section-title">Project not found</h1>
            <p className="page-copy">This project may have been deleted or belongs to another student.</p>
            <div className="actions center-actions">
              <Link className="button button-primary" to="/student/projects">Back to my projects</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="project-page">
      <div className="container project-page-shell">
        <div className="project-page-header">
          <span className="badge blue"><Pencil size={16} /> Edit submission</span>
          <h1 className="section-title">Edit project</h1>
          <p className="page-copy">
            Changes are saved as a new pending version so lecturers can review the latest details.
          </p>
        </div>

        <ProjectForm
          mode="edit"
          initialProject={project}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={error}
        />
      </div>
    </section>
  );
}

export default EditProject;
