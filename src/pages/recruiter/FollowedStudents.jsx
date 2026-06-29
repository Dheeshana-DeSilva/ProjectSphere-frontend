import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { MOCK_STUDENTS } from '../../data/mockStudents';
import FollowButton from '../../components/recruiter/FollowButton';

export default function FollowedStudents() {
  const [followedStudentIds, setFollowedStudentIds] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('followed_students') || '[]');
      setFollowedStudentIds(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const students = followedStudentIds.map(id => MOCK_STUDENTS[id]).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Followed Students</h1>
        <p className="text-slate-500 mb-8">Students you are tracking for potential opportunities.</p>

        {students.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
            <Users className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No followed students</h3>
            <p className="text-slate-500 mt-2 mb-6">You aren't following any students yet.</p>
            <Link to="/projects" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">
              Discover Talent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(student => (
              <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-black mb-4">
                  {student.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
                <p className="text-slate-500 text-sm mb-1">{student.degree}</p>
                <p className="text-slate-400 text-xs mb-4">{student.batch}</p>
                
                <div className="mt-auto w-full space-y-2">
                  <FollowButton studentId={student.id} />
                  <Link 
                    to={`/students/${student.id}`} 
                    className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2 rounded-xl transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
