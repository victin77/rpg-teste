import { Link } from 'react-router-dom';

export default function ChronicleCard({ chronicle }) {
  return (
    <Link
      to={`/cronicas/${chronicle.id}`}
      className="card-glass rounded-3xl p-6 shadow-soft transition hover:-translate-y-1 hover:bg-white/20"
    >
      <div className="font-display text-xl sm:text-2xl text-white title-stroke">
        {chronicle.title}
      </div>
      <div className="mt-2 text-white/80">
        {chronicle.subtitle}
      </div>
      <div className="mt-4 text-white/70 text-sm">
        Ler crônica →
      </div>
    </Link>
  );
}
