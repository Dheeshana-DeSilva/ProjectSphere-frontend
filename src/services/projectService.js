import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const STORAGE_KEY = 'projectsphere_student_projects';

const api = API_BASE_URL
  ? axios.create({
      baseURL: API_BASE_URL,
    })
  : null;

const readProjects = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const writeProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  if (!file) {
    resolve('');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Could not read image file.'));
  reader.readAsDataURL(file);
});

const createProjectPayload = async (project, user) => ({
  ...project,
  thumbnailUrl: project.thumbnailFile
    ? await readFileAsDataUrl(project.thumbnailFile)
    : project.thumbnailUrl || '',
  thumbnailFile: undefined,
  technologies: Array.isArray(project.technologies)
    ? project.technologies
    : project.technologies.split(',').map((item) => item.trim()).filter(Boolean),
  ownerId: user?.id || 'demo-student',
  student: {
    id: user?.id || 'demo-student',
    name: user?.name || 'Student',
    email: user?.email || '',
  },
});

const toFormData = (project) => {
  const formData = new FormData();

  Object.entries(project).forEach(([key, value]) => {
    if (key === 'thumbnailFile' && value) {
      formData.append('thumbnail', value);
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
};

const authHeaders = (token) => (
  token && !token.startsWith('session-token-')
    ? { Authorization: `Bearer ${token}` }
    : {}
);

export async function getMyProjects(token, user) {
  if (api) {
    const { data } = await api.get('/my-projects', {
      headers: authHeaders(token),
    });
    return data;
  }

  return readProjects().filter((project) => project.ownerId === (user?.id || 'demo-student'));
}

export async function getProjectById(id, token) {
  if (api) {
    const { data } = await api.get(`/projects/${id}`, {
      headers: authHeaders(token),
    });
    return data;
  }

  return readProjects().find((project) => String(project.id) === String(id)) || null;
}

export async function createProject(project, token, user) {
  if (api) {
    const { data } = await api.post('/projects', toFormData(project), {
      headers: authHeaders(token),
    });
    return data;
  }

  const projects = readProjects();
  const payload = await createProjectPayload(project, user);
  const savedProject = {
    ...payload,
    id: crypto.randomUUID(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  writeProjects([savedProject, ...projects]);
  return savedProject;
}

export async function updateProject(id, project, token) {
  if (api) {
    const { data } = await api.put(`/projects/${id}`, toFormData(project), {
      headers: authHeaders(token),
    });
    return data;
  }

  const projects = readProjects();
  const existing = projects.find((item) => String(item.id) === String(id));

  if (!existing) {
    throw new Error('Project not found.');
  }

  const payload = await createProjectPayload(project, existing.student);
  const updatedProject = {
    ...existing,
    ...payload,
    status: 'Pending',
    updatedAt: new Date().toISOString(),
  };

  writeProjects(projects.map((item) => (String(item.id) === String(id) ? updatedProject : item)));
  return updatedProject;
}

export async function deleteProject(id, token) {
  if (api) {
    await api.delete(`/projects/${id}`, {
      headers: authHeaders(token),
    });
    return true;
  }

  writeProjects(readProjects().filter((project) => String(project.id) !== String(id)));
  return true;
}
