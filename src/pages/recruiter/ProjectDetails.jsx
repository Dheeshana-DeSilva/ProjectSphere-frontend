import { useParams, Link } from 'react-router-dom';
import LikeButton from '../../components/recruiter/LikeButton';
import FollowButton from '../../components/recruiter/FollowButton';

const MOCK_PROJECTS = {
  '1': {
    id: '1',
    title: 'AI-Powered Study Assistant',
    description: `A machine-learning chatbot that helps students plan their study schedule, summarise lecture notes, and generate practice quizzes automatically.\n\nThis project uses a fine-tuned language model served through a FastAPI backend. The React frontend offers a clean chat interface, a timetable planner, and a quiz mode. Students can upload PDFs of their lecture slides and receive instant summaries and suggested questions.\n\nThe system achieved an 87% satisfaction rating in user testing with 50 undergraduate students.`,
    student: {
      id: 's1',
      name: 'Ashan Perera',
      degree: 'BSc Software Engineering',
      batch: '2021–2025',
      email: 'ashan.perera@university.lk',
      github: 'https://github.com/ashanperera',
      linkedin: 'https://linkedin.com/in/ashanperera',
    },
    technologies: ['Python', 'React', 'TensorFlow', 'FastAPI', 'PostgreSQL', 'Docker'],
    category: 'Artificial Intelligence',
    year: 2024,
    likes: 42,
    githubLink: 'https://github.com/ashanperera/ai-study-assistant',
    liveDemo: 'https://study-assistant-demo.vercel.app',
    highlights: [
      'Fine-tuned LLM on 5,000+ academic documents',
      '87% student satisfaction in user testing',
      'PDF upload → auto-summarisation pipeline',
      'Real-time quiz generation with scoring',
      'Deployed on AWS EC2 with Docker',
    ],
    recruiterNote: 'Demonstrates strong ML integration, REST API design, and full-stack skills. Ideal for AI engineering or backend development roles.',
  },
};

export default function ProjectDetails() {
  const { id } = useParams();
  const project = MOCK_PROJECTS[id];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-7xl mb-4">🚀</p>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Project not found</h2>
          <Link to="/projects" className="text-violet-600 hover:underline">← Back to projects</Link>
        </div>
      </div>
    );
  }

  const { student } = project;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 text-white pt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/projects" className="inline-flex items-center gap-1 text-indigo-200 hover:text-white text-sm mb-6 transition-colors">
            ← Back to Projects
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2">{project.title}</h1>
              <p className="text-indigo-200 text-sm">{project.year} · {project.technologies.length} technologies</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                  className="bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                  ⌥ GitHub
                </a>
              )}
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 text-sm font-bold px-4 py-2 rounded-xl shadow transition-all">
                  ▶ Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">📄 About the Project</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{project.description}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">✨ Key Highlights</h2>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 w-5 h-5 flex-shrink-0 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-violet-800 mb-3">🎯 Recruiter Insights</h2>
              <p className="text-violet-700 text-sm leading-relaxed">{project.recruiterNote}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">🛠 Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span key={tech}
                    className="bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 text-sm font-semibold px-4 py-1.5 rounded-full transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Created by</h2>
              <div className="flex flex-col items-center text-center gap-3 mb-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{student.name}</p>
                  <p className="text-slate-500 text-sm">{student.degree}</p>
                  <p className="text-slate-400 text-xs">{student.batch}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-5">
                <a href={`mailto:${student.email}`} className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors">
                  ✉ {student.email}
                </a>
                {student.github && (
                  <a href={student.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors">
                    ⌥ GitHub Profile
                  </a>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors">
                    🔗 LinkedIn
                  </a>
                )}
              </div>
              <div className="space-y-2">
                <FollowButton studentId={student.id} />
                <Link to={`/students/${student.id}`}
                  className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2.5 rounded-xl transition-colors">
                  View Full Profile
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-3">
              <p className="text-slate-500 text-sm">Did you like this project?</p>
              <LikeButton projectId={project.id} initialLikes={project.likes} large />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
