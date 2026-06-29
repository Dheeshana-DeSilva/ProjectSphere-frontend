import { useState } from 'react';

/**
 * LikeButton — toggles a like on a project.
 *
 * Props:
 *   projectId    — string  — ID of the project
 *   initialLikes — number — like count from the server
 *   large        — bool   — render in large (centered) style
 */
export default function LikeButton({ projectId, initialLikes = 0, large = false }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // TODO: call API  POST /api/projects/:projectId/like  or DELETE to unlike
    setLiked(prev => !prev);
    setCount(prev => liked ? prev - 1 : prev + 1);

    // Heartbeat animation
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  if (large) {
    return (
      <button
        id={`like-btn-large-${projectId}`}
        onClick={toggle}
        aria-label={liked ? 'Unlike project' : 'Like project'}
        className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
          liked
            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
            : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500'
        }`}
      >
        <span className={`text-3xl transition-transform duration-200 ${animating ? 'scale-125' : 'scale-100'}`}>
          {liked ? '❤️' : '🤍'}
        </span>
        <span>{count} {count === 1 ? 'Like' : 'Likes'}</span>
      </button>
    );
  }

  return (
    <button
      id={`like-btn-${projectId}`}
      onClick={toggle}
      aria-label={liked ? 'Unlike project' : 'Like project'}
      className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 ${
        liked
          ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
          : 'text-slate-400 hover:text-rose-400 hover:bg-rose-50'
      }`}
    >
      <span className={`transition-transform duration-200 ${animating ? 'scale-150' : 'scale-100'}`}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span>{count}</span>
    </button>
  );
}
