import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import bgUrl from '../assets/background.png';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.setProperty('--page-bg', `url(${bgUrl})`);
    return () => document.body.style.removeProperty('--page-bg');
  }, []);

  return (
    <div className="min-h-screen text-white font-body">
      <TopNav />
      <div className="mx-auto max-w-6xl px-4 pt-28">
        <div className="card-glass rounded-3xl p-8 shadow-soft">
          <div className="font-display text-3xl title-stroke">Página não encontrada</div>
          <p className="mt-3 text-white/80">Esse caminho não existe.</p>
          <button className="mt-6 btn btn-primary" onClick={() => navigate('/')}>Voltar</button>
        </div>
      </div>
    </div>
  );
}
