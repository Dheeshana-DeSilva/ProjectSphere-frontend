import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/recruiter/SearchBar';
import FilterPanel from '../../components/recruiter/FilterPanel';
import LikeButton from '../../components/recruiter/LikeButton';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'AI-Powered Study Assistant',
    description: 'A machine-learning chatbot that helps students plan their study schedule, summarise lecture notes, and generate practice quizzes automatically.',
    student: { id: 's1', name: 'Ashan Perera', avatar: null },
    technologies: ['Python', 'React', 'TensorFlow', 'FastAPI'],
    category: 'Artificial Intelligence',
    year: 2024,
    likes: 42,
    thumbnail: null,
  },
  {
    id: '2',
    title: 'Campus Event Management System',
    description: 'A full-stack web app that lets students discover, register for, and manage campus events with QR-code ticketing and real-time seat tracking.',
    student: { id: 's2', name: 'Nimasha Fernando', avatar: null },
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    category: 'Web Development',
    year: 2024,
    likes: 31,
    thumbnail: null,
  },
  {
    id: '3',
    title: 'Smart Greenhouse IoT Controller',
    description: 'An IoT dashboard to monitor and automate temperature, humidity, and irrigation in a greenhouse using Raspberry Pi sensors and a React frontend.',
    student: { id: 's3', name: 'Dulshan Bandara', avatar: null },
    technologies: ['React', 'Python', 'MQTT', 'InfluxDB'],
    category: 'IoT',
    year: 2023,
    likes: 58,
    thumbnail: null,
  },
  {
    id: '4',
    title: 'E-Commerce Mobile App',
    description: 'A cross-platform mobile shopping app with product recommendations, cart, payments via Stripe, and real-time order tracking using push notifications.',
    student: { id: 's4', name: 'Sachini Jayawardena', avatar: null },
    technologies: ['React Native', 'Firebase', 'Stripe', 'Redux'],
    category: 'Mobile Development',
    year: 2024,
    likes: 27,
    thumbnail: null,
  },
  {
    id: '5',
    title: 'Hospital Appointment Portal',
    description: 'A web portal streamlining outpatient appointment booking, doctor availability management, and automated SMS reminders for Sri Lankan hospitals.',
    student: { id: 's5', name: 'Kavindra Silva', avatar: null },
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Twilio'],
    category: 'Healthcare',
    year: 2023,
    likes: 19,
    thumbnail: null,
  },
  {
    id: '6',
    title: 'Blockchain Voting System',
    description: 'A tamper-proof student union voting platform built on Ethereum smart contracts, with MetaMask authentication and transparent vote tallying.',
    student: { id: 's6', name: 'Tharushi Rathnayake', avatar: null },
    technologies: ['Solidity', 'React', 'Web3.js', 'Hardhat'],
    category: 'Blockchain',
    year: 2024,
    likes: 65,
    thumbnail: null,
  },
];

// Gradient pool for project cards
const CARD_GRADIENTS = [
  'from-violet-600 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-fuchsia-500 to-purple-600',
];

function ProjectCard({ project, index }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className={`h-44 bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} relative flex items-center justify-center`}>
        <span className="text-white/30 text-8xl font-black select-none">
          {project.title.charAt(0)}
        </span>
        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 gap-3">
        <h3 className="text-slate-800 font-bold text-lg leading-snug group-hover:text-violet-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map(tech => (
            <span
              key={tech}
              className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Link
            to={`/students/${project.student.id}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-2 group/student"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              {project.student.name.charAt(0)}
            </div>
            <span className="text-sm text-slate-600 group-hover/student:text-violet-600 transition-colors">
              {project.student.name}
            </span>
          </Link>
          <LikeButton projectId={project.id} initialLikes={project.likes} />
        </div>
      </div>
    </Link>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ technology: '', category: '', year: '' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filtered = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.student.name.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q));

    const matchTech = !filters.technology || p.technologies.includes(filters.technology);
    const matchCat = !filters.category || p.category === filters.category;
    const matchYear = !filters.year || p.year === Number(filters.year);

    return matchSearch && matchTech && matchCat && matchYear;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-violet-300 text-sm font-semibold uppercase tracking-widest mb-3">
            ProjectSphere
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Student Projects Showcase
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
            Discover innovative projects built by talented undergraduates. Find your next hire or collaborate with bright minds.
          </p>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              {/* Mobile toggle */}
              <button
                onClick={() => setIsFilterOpen(v => !v)}
                className="lg:hidden w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 mb-3 text-sm font-semibold text-slate-700 shadow-sm"
              >
                <span>🎛 Filters</span>
                <span>{isFilterOpen ? '▲' : '▼'}</span>
              </button>
              <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                <FilterPanel filters={filters} onChange={setFilters} />
              </div>
            </div>
          </aside>

          {/* Project grid */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> projects
              </p>
              {(searchQuery || Object.values(filters).some(Boolean)) && (
                <button
                  onClick={() => { setSearchQuery(''); setFilters({ technology: '', category: '', year: '' }); }}
                  className="text-sm text-violet-600 hover:text-violet-800 font-medium underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-6xl mb-4">🔍</p>
                <p className="text-slate-500 text-lg">No projects match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((project, i) => (
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
