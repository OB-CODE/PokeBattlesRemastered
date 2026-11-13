// Type-based colours shared by every Pokemon card (party, battle, details).
// Keep the Tailwind class names written out in full so they are not purged.
export const typeColors: Record<string, { from: string; to: string; border: string }> = {
  fire: { from: 'from-orange-500', to: 'to-red-600', border: 'border-orange-400' },
  water: { from: 'from-blue-400', to: 'to-blue-600', border: 'border-blue-400' },
  grass: { from: 'from-green-400', to: 'to-green-600', border: 'border-green-400' },
  electric: { from: 'from-yellow-400', to: 'to-amber-500', border: 'border-yellow-400' },
  ice: { from: 'from-cyan-300', to: 'to-cyan-500', border: 'border-cyan-300' },
  fighting: { from: 'from-red-600', to: 'to-red-800', border: 'border-red-500' },
  poison: { from: 'from-purple-400', to: 'to-purple-600', border: 'border-purple-400' },
  ground: { from: 'from-amber-600', to: 'to-amber-800', border: 'border-amber-500' },
  flying: { from: 'from-indigo-300', to: 'to-sky-400', border: 'border-indigo-300' },
  psychic: { from: 'from-pink-400', to: 'to-pink-600', border: 'border-pink-400' },
  bug: { from: 'from-lime-400', to: 'to-lime-600', border: 'border-lime-400' },
  rock: { from: 'from-stone-500', to: 'to-stone-700', border: 'border-stone-400' },
  ghost: { from: 'from-purple-600', to: 'to-indigo-800', border: 'border-purple-500' },
  dragon: { from: 'from-indigo-500', to: 'to-violet-700', border: 'border-indigo-400' },
  dark: { from: 'from-gray-700', to: 'to-gray-900', border: 'border-gray-600' },
  steel: { from: 'from-slate-400', to: 'to-slate-600', border: 'border-slate-400' },
  fairy: { from: 'from-pink-300', to: 'to-pink-500', border: 'border-pink-300' },
  normal: { from: 'from-slate-400', to: 'to-slate-600', border: 'border-slate-400' },
};

export const getTypeColors = (types?: string[]) => {
  const primaryType = types?.[0]?.toLowerCase() || 'normal';
  return typeColors[primaryType] || typeColors.normal;
};
