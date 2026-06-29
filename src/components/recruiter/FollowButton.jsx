import { useState } from 'react';
import { Check, Plus } from 'lucide-react';

/**
 * FollowButton — follows/unfollows a student.
 *
 * Props:
 *   studentId — string — ID of the student to follow
 */
export default function FollowButton({ studentId }) {
  const [following, setFollowing] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('followed_students') || '[]');
      return stored.includes(studentId);
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    
    // Simulate network request
    await new Promise(r => setTimeout(r, 300));
    
    setFollowing(prev => {
      const isNowFollowing = !prev;
      try {
        const stored = JSON.parse(localStorage.getItem('followed_students') || '[]');
        if (isNowFollowing) {
          if (!stored.includes(studentId)) stored.push(studentId);
        } else {
          const index = stored.indexOf(studentId);
          if (index > -1) stored.splice(index, 1);
        }
        localStorage.setItem('followed_students', JSON.stringify(stored));
      } catch (err) {
        console.error('Failed to follow student', err);
      }
      return isNowFollowing;
    });
    
    setLoading(false);
  };

  return (
    <button
      id={`follow-btn-${studentId}`}
      onClick={toggle}
      disabled={loading}
      aria-label={following ? 'Unfollow student' : 'Follow student'}
      className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-2.5 rounded-xl transition-all duration-200 ${
        loading
          ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-400'
          : following
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-200'
      }`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : following ? (
        <Check className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      {loading ? 'Please wait…' : following ? 'Following' : 'Follow Student'}
    </button>
  );
}
