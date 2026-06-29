export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg select-none">
        🔍
      </span>
      <input
        id="project-search"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by project title, student name, or technology…"
        className="w-full bg-white/95 backdrop-blur-sm text-slate-800 placeholder-slate-400 text-sm rounded-2xl pl-11 pr-4 py-3.5 shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
