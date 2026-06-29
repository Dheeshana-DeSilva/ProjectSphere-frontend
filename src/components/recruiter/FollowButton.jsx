import { useState } from 'react';

/**
 * FollowButton — follows/unfollows a student.
 *
 * Props:
 *   studentId — string — ID of the student to follow
 */
export default function FollowButton({ studentId }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    // TODO: call API  POST /api/students/:studentId/follow  or DELETE to unfollow
    await new Promise(r => setTimeout(r, 400)); // simulate network request
    setFollowing(prev => !prev);
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
          ? 'bg-violet-100 text-violet-700 hover:bg-violet-200 border border-violet-300'
          : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-200'
      }`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>{following ? '✓' : '+'}</span>
      )}
      {loading ? 'Please wait…' : following ? 'Following' : 'Follow Student'}
    </button>
  );
}
