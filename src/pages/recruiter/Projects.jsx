import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Globe, Smartphone, Plug, HeartPulse, Link as LinkIcon, BarChart3, ShieldCheck, Folder, Settings2, Loader2 } from 'lucide-react';
import SearchBar from '../../components/recruiter/SearchBar';
import FilterPanel from '../../components/recruiter/FilterPanel';
import LikeButton from '../../components/recruiter/LikeButton';
import { getAllProjects } from '../../services/projectService';
import { normalizeProjectLikes } from '../../utils/projectLikes.js';
import { useAuth } from '../../hooks/useAuth.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CARD_GRADIENTS = [
  'from-violet-600 to-indigo-500',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-purple-600',
  'from-sky-500 to-cyan-600',
  'from-green-500 to-emerald-600',
];

const CATEGORY_ICONS = {
  'Artificial Intelligence': <Bot className="w-3.5 h-3.5" />,
  'Web Development': <Globe className="w-3.5 h-3.5" />,
  'Mobile Development': <Smartphone className="w-3.5 h-3.5" />,
  IoT: <Plug className="w-3.5 h-3.5" />,
  Healthcare: <HeartPulse className="w-3.5 h-3.5" />,
  Blockchain: <LinkIcon className="w-3.5 h-3.5" />,
  'Data Science': <BarChart3 className="w-3.5 h-3.5" />,
  Cybersecurity: <ShieldCheck className="w-3.5 h-3.5" />,
};

const SORT_OPTIONS = [
  { value: 'likes', label: 'Most Liked' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'A → Z' },
];

// ─── Normalise backend project shape ──────────────────────────────────────────
function normaliseProject(p) {
  const likeMeta = normalizeProjectLikes(p);
  return {
    ...p,
    id: p._id || p.id,
    student: p.owner
      ? { id: p.owner._id || p.owner, name: p.owner.name || 'Student', email: p.owner.email || '' }
      : p.student || { id: '', name: 'Unknown', email: '' },
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    ...likeMeta,
    year: p.year || (p.createdAt ? new Date(p.createdAt).getFullYear() : new Date().getFullYear()),
    category: p.category || 'General',
    description: p.description || '',
    githubLink: p.githubUrl || p.githubLink || null,
    liveDemo: p.liveDemo || null,
  };
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const icon = CATEGORY_ICONS[project.category] ?? <Folder className="w-3.5 h-3.5" />;

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-violet-200 transition-all duration-300 hover:-translate-y-1">

      {/* ── Thumbnail banner ── */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {/* Large watermark letter */}
        <span className="text-white/20 text-9xl font-black select-none leading-none">
          {project.title.charAt(0)}
        </span>

        {/* Category badge */}
        <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          {icon}
          {project.category}
        </span>

        {/* Year badge */}
        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {project.year}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-grow p-5 gap-3">

        {/* Title */}
        <h2 className="text-slate-800 font-bold text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          {project.title}
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map(tech => (
            <span
              key={tech}
              className="bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-violet-100"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* ── Footer row ── */}
        <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between gap-2">

          {/* Student avatar + name */}
          <Link
            to={`/students/${project.student.id}`}
            className="flex items-center gap-2 min-w-0 group/student"
            onClick={e => e.stopPropagation()}
          >
            <div className={`w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
              {project.student.name.charAt(0)}
            </div>
            <span className="text-sm text-slate-600 truncate group-hover/student:text-blue-600 transition-colors">
              {project.student.name}
            </span>
          </Link>

          {/* Likes */}
          <LikeButton
            projectId={project.id}
            likes={project.likesArray}
            likedByCurrentUser={project.likedByCurrentUser}
            initialLikes={project.likes}
          />
        </div>

        {/* View Details button */}
        <Link
          to={`/projects/${project.id}`}
          className="mt-1 block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-all duration-200 hover:shadow-md hover:shadow-blue-300 active:scale-95"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Projects() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ technology: '', category: '', year: '' });
  const [sortBy, setSortBy] = useState('likes');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ── Fetch projects from API ──
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError('Failed to load projects. Please try again later.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [user?._id, user?.id]);

  // Filter
  const filtered = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.student.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q));

    const matchTech = !filters.technology || p.technologies.includes(filters.technology);
    const matchCat = !filters.category || p.category === filters.category;
    const matchYear = !filters.year || p.year === Number(filters.year);

    return matchSearch && matchTech && matchCat && matchYear;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'likes') return b.likes - a.likes;
    if (sortBy === 'newest') return b.year - a.year;
    if (sortBy === 'oldest') return a.year - b.year;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const hasActiveFilter = searchQuery || Object.values(filters).some(Boolean);

  const clearAll = () => {
    setSearchQuery('');
    setFilters({ technology: '', category: '', year: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 text-white pt-14 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-white/15 backdrop-blur-sm text-violet-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            ProjectSphere
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Explore Projects
          </h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto mb-8">
            Browse innovative projects built by talented undergraduates. Discover skills, connect with students, and find your next hire.
          </p>

          {/* Search bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Stats strip */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-indigo-200">
            <span><strong className="text-white text-lg font-bold">{projects.length}</strong> Projects</span>
            <span className="w-px h-5 bg-white/20" />
            <span><strong className="text-white text-lg font-bold">{new Set(projects.map(p => p.student.id)).size}</strong> Students</span>
            <span className="w-px h-5 bg-white/20" />
            <span><strong className="text-white text-lg font-bold">{new Set(projects.map(p => p.category)).size}</strong> Categories</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              {/* Mobile toggle */}
              <button
                id="filter-toggle"
                onClick={() => setIsFilterOpen(v => !v)}
                className="lg:hidden w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm font-semibold text-slate-700 shadow-sm"
              >
                <span className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> Filters {hasActiveFilter && <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">!</span>}</span>
                <span className="text-slate-400">{isFilterOpen ? '▲' : '▼'}</span>
              </button>

              <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                <FilterPanel filters={filters} onChange={setFilters} />
              </div>
            </div>
          </aside>

          {/* ── Project grid ── */}
          <div className="flex-grow">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm">
              <p className="text-slate-500 text-sm">
                Showing{' '}
                <span className="font-semibold text-slate-800">{sorted.length}</span>{' '}
                of{' '}
                <span className="font-semibold text-slate-800">{projects.length}</span>{' '}
                projects
              </p>

              <div className="flex items-center gap-3">
                {hasActiveFilter && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Clear filters
                  </button>
                )}

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-xs text-slate-500 font-medium hidden sm:block">Sort:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="text-center py-28">
                <Loader2 className="w-10 h-10 mx-auto text-violet-500 animate-spin mb-4" />
                <p className="text-slate-500 text-sm">Loading projects…</p>
              </div>
            ) : error ? (
              <div className="text-center py-28">
                <p className="text-6xl mb-5">⚠️</p>
                <h2 className="text-xl font-bold text-slate-700 mb-2">Something went wrong</h2>
                <p className="text-slate-400 text-sm mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-28">
                <p className="text-6xl mb-5">🔍</p>
                <h2 className="text-xl font-bold text-slate-700 mb-2">No projects found</h2>
                <p className="text-slate-400 text-sm mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sorted.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
