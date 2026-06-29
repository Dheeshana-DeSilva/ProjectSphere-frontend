const TECHNOLOGIES = [
  'React', 'Vue.js', 'Node.js', 'Python', 'FastAPI', 'Laravel',
  'TensorFlow', 'Docker', 'MongoDB', 'PostgreSQL', 'MySQL',
  'React Native', 'Firebase', 'Redux', 'Web3.js', 'Solidity',
];

const CATEGORIES = [
  'Artificial Intelligence',
  'Web Development',
  'Mobile Development',
  'IoT',
  'Healthcare',
  'Blockchain',
  'Data Science',
  'Cybersecurity',
];

const YEARS = [2023, 2024, 2025];

function Select({ id, label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function FilterPanel({ filters, onChange }) {
  const hasActiveFilter = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800">Filters</h2>
        {hasActiveFilter && (
          <button
            onClick={() => onChange({ technology: '', category: '', year: '' })}
            className="text-xs text-violet-600 hover:text-violet-800 font-semibold transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <Select
        id="filter-technology"
        label="Technology"
        value={filters.technology}
        onChange={v => onChange({ ...filters, technology: v })}
        options={TECHNOLOGIES}
        placeholder="All technologies"
      />

      <Select
        id="filter-category"
        label="Category"
        value={filters.category}
        onChange={v => onChange({ ...filters, category: v })}
        options={CATEGORIES}
        placeholder="All categories"
      />

      <Select
        id="filter-year"
        label="Year"
        value={filters.year}
        onChange={v => onChange({ ...filters, year: v })}
        options={YEARS}
        placeholder="All years"
      />

      {/* Active filter chips */}
      {hasActiveFilter && (
        <div className="pt-1 flex flex-wrap gap-1.5">
          {filters.technology && (
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {filters.technology}
              <button onClick={() => onChange({ ...filters, technology: '' })} className="hover:text-violet-900 ml-0.5">×</button>
            </span>
          )}
          {filters.category && (
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {filters.category}
              <button onClick={() => onChange({ ...filters, category: '' })} className="hover:text-violet-900 ml-0.5">×</button>
            </span>
          )}
          {filters.year && (
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {filters.year}
              <button onClick={() => onChange({ ...filters, year: '' })} className="hover:text-violet-900 ml-0.5">×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
