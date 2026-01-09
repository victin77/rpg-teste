import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import bgUrl from '../assets/background.png';
import { getChronicle } from '../data/chronicles.js';

export default function ChroniclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chronicle = useMemo(() => getChronicle(id), [id]);

  useEffect(() => {
    document.body.style.setProperty('--page-bg', `url(${bgUrl})`);
    return () => document.body.style.removeProperty('--page-bg');
  }, []);

  if (!chronicle) {
    return (
      <div className="min-h-screen text-white">
        <TopNav />
        <div className="mx-auto max-w-6xl px-4 pt-28">
          <div className="card-glass rounded-3xl p-8 shadow-soft">
            <div className="font-display text-3xl title-stroke">Crônica não encontrada</div>
            <p className="mt-3 text-white/80">Volte e escolha um card válido.</p>
            <button className="mt-6 btn btn-primary" onClick={() => navigate('/')}>Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-body">
      <TopNav />

      <div className="mx-auto max-w-3xl px-4 pt-28 pb-16">
        <article className="card-glass rounded-3xl p-8 shadow-soft">
          <h1 className="font-display text-3xl sm:text-4xl title-stroke">{chronicle.title}</h1>
          <p className="mt-3 text-white/80">{chronicle.subtitle}</p>

          <div className="mt-8 whitespace-pre-wrap leading-relaxed text-white/90">
            {chronicle.content}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => navigate('/')}>Voltar para início</button>
            <a href="#cronicas" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); navigate('/'); setTimeout(() => { window.location.hash = '#cronicas'; }, 0); }}>Ver crônicas</a>
          </div>
        </article>
      </div>
    </div>
  );
}
