import { useState } from 'react';
import { Bookmark } from 'lucide-react';

/**
 * SaveButton — saves/unsaves a project.
 *
 * Props:
 *   projectId — string — ID of the project to save
 *   compact — boolean — true if inside a small card, false for large button
 */
export default function SaveButton({ projectId, compact = false }) {
  const [saved, setSaved] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('saved_projects') || '[]');
      return stored.includes(projectId);
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(false);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    
    // Simulate network request
    await new Promise(r => setTimeout(r, 300)); 

    setSaved(prev => {
      const isNowSaved = !prev;
      try {
        const stored = JSON.parse(localStorage.getItem('saved_projects') || '[]');
        if (isNowSaved) {
          if (!stored.includes(projectId)) stored.push(projectId);
        } else {
          const index = stored.indexOf(projectId);
          if (index > -1) stored.splice(index, 1);
        }
        localStorage.setItem('saved_projects', JSON.stringify(stored));
      } catch (err) {
        console.error('Failed to save project', err);
      }
      return isNowSaved;
    });
    
    setLoading(false);
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        title={saved ? "Unsave project" : "Save project"}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
          saved
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
        } disabled:opacity-50`}
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-2.5 rounded-xl transition-all duration-200 ${
        loading
          ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-400'
          : saved
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
      }`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      )}
      {loading ? 'Please wait…' : saved ? 'Project Saved' : 'Save Project'}
    </button>
  );
}
