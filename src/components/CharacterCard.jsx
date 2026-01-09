import { Link } from 'react-router-dom';

export default function CharacterCard({ character }) {
  return (
    <Link
      to={`/characters/${character.slug}`}
      className="group relative h-[220px] sm:h-[260px] w-[82vw] sm:w-[640px] flex-shrink-0 rounded-3xl overflow-hidden shadow-soft character-card-bg transition-transform duration-300 hover:-translate-y-1"
      style={{ backgroundImage: `url(${character.cardBg})` }}
      aria-label={`Abrir ${character.name}`}
    >
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/15" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="relative h-full p-6 flex flex-col justify-end">
        <div className="font-display text-2xl sm:text-3xl text-white title-stroke">
          {character.name}
        </div>
        <div className="text-white/80 text-sm sm:text-base">
          {character.subtitle}
        </div>
        <div className="mt-3 text-white/70 text-xs sm:text-sm overflow-hidden">
          {character.blurb}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-white/90">
          <span className="text-sm">Abrir</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
