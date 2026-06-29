import { useParams, Link } from 'react-router-dom';
import LikeButton from '../../components/recruiter/LikeButton';
import FollowButton from '../../components/recruiter/FollowButton';

const MOCK_STUDENTS = {
  's1': {
    id: 's1',
    name: 'Ashan Perera',
    degree: 'BSc Software Engineering',
    batch: '2021–2025',
    email: 'ashan.perera@university.lk',
    github: 'https://github.com/ashanperera',
    linkedin: 'https://linkedin.com/in/ashanperera',
    bio: 'Final-year Software Engineering student passionate about AI/ML and scalable backend systems. Looking for opportunities in machine learning engineering and cloud architecture.',
    skills: ['Python', 'React', 'TensorFlow', 'FastAPI', 'Docker', 'AWS', 'PostgreSQL'],
    projects: [
      {
        id: '1',
        title: 'AI-Powered Study Assistant',
        description: 'ML chatbot for study scheduling, note summarisation and quiz generation.',
        technologies: ['Python', 'React', 'TensorFlow', 'FastAPI'],
        category: 'Artificial Intelligence',
        year: 2024,
        likes: 42,
      },
      {
        id: '7',
        title: 'Real-time Chat Application',
        description: 'WebSocket-based group chat with end-to-end encryption and file sharing.',
        technologies: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
        category: 'Web Development',
        year: 2023,
        likes: 18,
      },
    ],
    followers: 12,
  },
};

const CARD_GRADIENTS = [
  'from-violet-600 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
];

export default function StudentProfile() {
  const { id } = useParams();
  const student = MOCK_STUDENTS[id];

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-7xl mb-4">👤</p>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Student not found</h2>
          <Link to="/projects" className="text-violet-600 hover:underline">← Browse Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 text-white pt-12 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/projects" className="inline-flex items-center gap-1 text-indigo-200 hover:text-white text-sm mb-8 transition-colors">
            ← Back to Projects
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center text-5xl font-black shadow-2xl">
              {student.name.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold">{student.name}</h1>
              <p className="text-indigo-200 mt-1">{student.degree} · {student.batch}</p>
              <p className="text-indigo-300 text-sm mt-1">{student.followers} followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contact card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact</h2>
              <div className="space-y-3 text-sm">
                <a href={`mailto:${student.email}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors break-all">
                  ✉ {student.email}
                </a>
                {student.github && (
                  <a href={student.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors">
                    ⌥ GitHub
                  </a>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors">
                    🔗 LinkedIn
                  </a>
                )}
              </div>
              <div className="mt-5">
                <FollowButton studentId={student.id} />
              </div>
            </div>

            {/* Skills card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {student.skills.map(skill => (
                  <span key={skill}
                    className="bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full border border-violet-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <section className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3">About</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{student.bio}</p>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Projects <span className="text-slate-400 font-normal text-base">({student.projects.length})</span>
              </h2>
              <div className="space-y-4">
                {student.projects.map((project, i) => (
                  <Link key={project.id} to={`/projects/${project.id}`}
                    className="group flex gap-4 bg-white rounded-2xl shadow-md hover:shadow-lg p-5 transition-all hover:-translate-y-0.5">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} flex items-center justify-center text-white text-xl font-black shadow`}>
                      {project.title.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex-shrink-0">
                          {project.year}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.slice(0, 4).map(t => (
                          <span key={t} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center" onClick={e => e.preventDefault()}>
                      <LikeButton projectId={project.id} initialLikes={project.likes} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
