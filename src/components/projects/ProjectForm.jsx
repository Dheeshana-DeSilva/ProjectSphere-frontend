import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from './ImageUpload.jsx';

const categories = [
  'Artificial Intelligence',
  'Web Development',
  'Mobile Development',
  'IoT',
  'Healthcare',
  'Blockchain',
  'Data Science',
  'Cybersecurity',
  'Other',
];

const initialValues = {
  title: '',
  category: '',
  year: new Date().getFullYear(),
  description: '',
  technologies: '',
  githubLink: '',
  liveDemo: '',
  thumbnailUrl: '',
  thumbnailFile: null,
};

const normalizeProject = (project) => ({
  ...initialValues,
  ...project,
  technologies: Array.isArray(project?.technologies)
    ? project.technologies.join(', ')
    : project?.technologies || '',
});

function validate(form) {
  const errors = {};
  const currentYear = new Date().getFullYear();
  const techList = form.technologies.split(',').map((item) => item.trim()).filter(Boolean);

  if (!form.title.trim()) errors.title = 'Project title is required.';
  if (form.title.trim().length > 90) errors.title = 'Keep the title under 90 characters.';
  if (!form.category) errors.category = 'Select a category.';
  if (!form.description.trim()) errors.description = 'Project description is required.';
  if (form.description.trim().length < 80) errors.description = 'Write at least 80 characters.';
  if (techList.length < 2) errors.technologies = 'Add at least two technologies.';
  if (!form.year || Number(form.year) < 2020 || Number(form.year) > currentYear + 1) {
    errors.year = `Use a year between 2020 and ${currentYear + 1}.`;
  }

  if (form.githubLink && !/^https?:\/\/.+/i.test(form.githubLink)) {
    errors.githubLink = 'Enter a valid GitHub URL.';
  }

  if (form.liveDemo && !/^https?:\/\/.+/i.test(form.liveDemo)) {
    errors.liveDemo = 'Enter a valid live demo URL.';
  }

  if (form.thumbnailFile && form.thumbnailFile.size > 5 * 1024 * 1024) {
    errors.thumbnail = 'Image must be smaller than 5 MB.';
  }

  return errors;
}

function ProjectForm({ initialProject, mode = 'create', onSubmit, submitting = false, submitError = '' }) {
  const [form, setForm] = useState(() => normalizeProject(initialProject));
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '', thumbnail: field === 'thumbnailFile' ? '' : current.thumbnail }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      technologies: form.technologies.split(',').map((item) => item.trim()).filter(Boolean),
      year: Number(form.year),
    });
  };

  return (
    <form className="project-form panel" onSubmit={handleSubmit} noValidate>
      {submitError ? <div className="alert alert-error">{submitError}</div> : null}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="title">Project title</label>
          <input
            id="title"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="AI-powered study assistant"
          />
          {errors.title ? <span className="field-error">{errors.title}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(event) => updateField('category', event.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category ? <span className="field-error">{errors.category}</span> : null}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="technologies">Technologies</label>
          <input
            id="technologies"
            value={form.technologies}
            onChange={(event) => updateField('technologies', event.target.value)}
            placeholder="React, Node.js, MongoDB"
          />
          <span className="field-hint">Separate each technology with a comma.</span>
          {errors.technologies ? <span className="field-error">{errors.technologies}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="year">Project year</label>
          <input
            id="year"
            type="number"
            min="2020"
            value={form.year}
            onChange={(event) => updateField('year', event.target.value)}
          />
          {errors.year ? <span className="field-error">{errors.year}</span> : null}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Explain the problem, solution, main features, architecture, and outcomes."
          rows={8}
        />
        {errors.description ? <span className="field-error">{errors.description}</span> : null}
      </div>

      <ImageUpload
        imageUrl={form.thumbnailUrl}
        error={errors.thumbnail}
        onChange={(file, previewUrl) => {
          updateField('thumbnailFile', file);
          updateField('thumbnailUrl', previewUrl);
        }}
      />

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="githubLink">GitHub link</label>
          <input
            id="githubLink"
            value={form.githubLink}
            onChange={(event) => updateField('githubLink', event.target.value)}
            placeholder="https://github.com/name/project"
          />
          {errors.githubLink ? <span className="field-error">{errors.githubLink}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="liveDemo">Live demo link</label>
          <input
            id="liveDemo"
            value={form.liveDemo}
            onChange={(event) => updateField('liveDemo', event.target.value)}
            placeholder="https://project-demo.vercel.app"
          />
          {errors.liveDemo ? <span className="field-error">{errors.liveDemo}</span> : null}
        </div>
      </div>

      <div className="project-form-actions">
        <Link className="button button-secondary" to="/student/projects">Cancel</Link>
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'edit' ? 'Update project' : 'Create project'}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
