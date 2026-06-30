import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { createProject } from '../../services/projectService.js';
import ProjectForm from './ProjectForm.jsx';

function CreateProject() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (project) => {
    setSubmitting(true);
    setError('');

    try {
      await createProject(project, token, user);
      navigate('/student/projects', {
        state: { message: 'Project created and sent for lecturer approval.' },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not create project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="project-page">
      <div className="container project-page-shell">
        <div className="project-page-header">
          <span className="badge blue"><FolderPlus size={16} /> New submission</span>
          <h1 className="section-title">Create project</h1>
          <p className="page-copy">
            Add the project details recruiters and lecturers need to understand your work.
          </p>
        </div>

        <ProjectForm
          mode="create"
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={error}
        />
      </div>
    </section>
  );
}

export default CreateProject;
