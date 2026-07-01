import { useState, useEffect, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { likeProject } from '../../services/projectService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getLikesCount, isLikedByUser } from '../../utils/projectLikes.js';

/**
 * LikeButton — toggles a like on a project.
 * Shows filled heart when liked, outline heart when not.
 */
export default function LikeButton({
  projectId,
  likes,
  likedByCurrentUser,
  initialLikes = 0,
  initialLiked,
  large = false,
}) {
  const { user, isAuthenticated } = useAuth();
  const likesArray = Array.isArray(likes) ? likes : [];

  const derivedLiked = useMemo(
    () => isLikedByUser(likesArray, user, likedByCurrentUser ?? initialLiked),
    [likesArray, user, likedByCurrentUser, initialLiked]
  );

  const derivedCount = useMemo(
    () => (likesArray.length > 0 ? likesArray.length : initialLikes),
    [likesArray, initialLikes]
  );

  const [liked, setLiked] = useState(derivedLiked);
  const [count, setCount] = useState(derivedCount);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(derivedLiked);
  }, [derivedLiked]);

  useEffect(() => {
    setCount(derivedCount);
  }, [derivedCount]);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || loading) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((prev) => (wasLiked ? Math.max(0, prev - 1) : prev + 1));
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    setLoading(true);
    try {
      const result = await likeProject(projectId);
      if (result && result.success) {
        setLiked(result.liked);
        setCount(result.likesCount ?? getLikesCount(likesArray));
      } else {
        setLiked(wasLiked);
        setCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch (error) {
      console.error('Failed to toggle project like:', error);
      setLiked(wasLiked);
      setCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLoading(false);
    }
  };

  if (large) {
    return (
      <button
        id={`like-btn-large-${projectId}`}
        onClick={toggle}
        disabled={loading}
        title={liked ? 'Click to remove your like' : 'Like this project'}
        aria-label={liked ? 'Unlike project' : 'Like project'}
        aria-pressed={liked}
        className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 disabled:cursor-not-allowed ${
          liked
            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
            : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500'
        }`}
      >
        <span className={`transition-transform duration-200 ${animating ? 'scale-125' : 'scale-100'}`}>
          <Heart
            className={`w-8 h-8 transition-colors duration-150 ${
              liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
            }`}
          />
        </span>
        <span>{count} {count === 1 ? 'Like' : 'Likes'}</span>
        {liked && <span className="text-xs font-normal text-rose-400">Liked ✓</span>}
      </button>
    );
  }

  return (
    <button
      id={`like-btn-${projectId}`}
      onClick={toggle}
      disabled={loading}
      title={liked ? 'Click to remove your like' : 'Like this project'}
      aria-label={liked ? 'Unlike project' : 'Like project'}
      aria-pressed={liked}
      className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 disabled:cursor-not-allowed ${
        liked
          ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
          : 'text-slate-400 hover:text-rose-400 hover:bg-rose-50'
      }`}
    >
      <span className={`transition-transform duration-200 ${animating ? 'scale-150' : 'scale-100'}`}>
        <Heart
          className={`w-4 h-4 transition-colors duration-150 ${
            liked ? 'fill-rose-500 text-rose-500' : ''
          }`}
        />
      </span>
      <span>{count}</span>
    </button>
  );
}
