export const randomColors = [
  "bg-blue-200 text-blue-900",
  "bg-emerald-200 text-emerald-900",
  "bg-violet-200 text-violet-900",
  "bg-red-200 text-red-900",
  "bg-pink-200 text-pink-900",
  "bg-cyan-200 text-cyan-900",
  "bg-orange-200 text-orange-900",
  "bg-amber-200 text-amber-900",
  "bg-indigo-200 text-indigo-900",
  "bg-teal-200 text-teal-900",
  "bg-lime-200 text-lime-900",
  "bg-rose-200 text-rose-900",
];

export const DEFAULT_COLOR = "bg-slate-200 text-slate-800";
// export const randomColors = [
//   "bg-blue-600 text-white",
//   "bg-emerald-600 text-white",
//   "bg-violet-600 text-white",
//   "bg-red-600 text-white",
//   "bg-pink-600 text-white",
//   "bg-cyan-400 text-cyan-950",
//   "bg-orange-600 text-white",
//   "bg-amber-400 text-amber-950",
//   "bg-indigo-600 text-white",
//   "bg-teal-600 text-white",
//   "bg-lime-400 text-lime-950",
//   "bg-rose-600 text-white",
// ];

// /** Used when an activity has no category. */
// export const DEFAULT_COLOR = "bg-slate-600 text-white";

/**
 * Assigns each distinct category its own colour (alphabetical order), so a
 * category keeps the same colour on every date. Colours repeat once the
 * palette runs out.
 */
export const buildColorMap = (categories) => {
  const unique = [...new Set(categories.filter(Boolean))].sort();
  return Object.fromEntries(
    unique.map((name, i) => [name, randomColors[i % randomColors.length]])
  );
};