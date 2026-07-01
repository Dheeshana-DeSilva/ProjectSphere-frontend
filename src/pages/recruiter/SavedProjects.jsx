import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Loader2 } from 'lucide-react';
import LikeButton from '../../components/recruiter/LikeButton';
import SaveButton from '../../components/recruiter/SaveButton';
import { getAllProjects } from '../../services/projectService';

// ─── Normalise backend project shape ──────────────────────────────────────────
function normaliseProject(p) {
  return {
    ...p,
    id: p._id || p.id,
    student: p.owner
      ? { id: p.owner._id || p.owner, name: p.owner.name || 'Student', email: p.owner.email || '' }
      : p.student || { id: '', name: 'Unknown', email: '' },
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    likes: typeof p.likes === 'number' ? p.likes : Array.isArray(p.likes) ? p.likes.length : 0,
    description: p.description || '',
  };
}

export default function SavedProjects() {
  const [savedProjectIds, setSavedProjectIds] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('saved_projects') || '[]');
      setSavedProjectIds(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch all projects from the API, then filter by saved IDs
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getAllProjects()
      .then(data => {
        if (!cancelled) {
          setAllProjects((data || []).map(normaliseProject));
        }
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const savedProjects = allProjects.filter(p => savedProjectIds.includes(p.id) || savedProjectIds.includes(p._id));

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Saved Projects</h1>
        <p className="text-slate-500 mb-8">Projects you have bookmarked for later review.</p>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Loading saved projects…</p>
          </div>
        ) : savedProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
            <Bookmark className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No saved projects</h3>
            <p className="text-slate-500 mt-2 mb-6">You haven't saved any projects yet.</p>
            <Link to="/projects" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">
              Explore Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map(project => (
              <article key={project.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col flex-grow p-5 gap-3">
                  <h2 className="text-slate-800 font-bold text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h2>
                  <p className="text-slate-500 text-xs line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      {project.student.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <SaveButton projectId={project.id} compact />
                      <LikeButton projectId={project.id} initialLikes={project.likes} />
                    </div>
                  </div>
                  
                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-2 block w-full text-center bg-slate-100 hover:bg-blue-50 text-blue-700 font-semibold text-sm py-2 rounded-xl transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
