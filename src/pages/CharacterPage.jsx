import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import bgUrl from '../assets/background.png';
import { getCharacter } from '../data/characters.js';

const STORAGE_KEY = 'rpg_master_authed';

function isAuthed() {
  return localStorage.getItem(STORAGE_KEY) === '1';
}

export default function CharacterPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const character = useMemo(() => getCharacter(slug), [slug]);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    document.body.style.setProperty('--page-bg', `url(${bgUrl})`);
    return () => document.body.style.removeProperty('--page-bg');
  }, []);

  useEffect(() => {
    setAuthed(isAuthed());
  }, []);

  if (!character) {
    return (
      <div className="min-h-screen text-white">
        <TopNav />
        <div className="mx-auto max-w-6xl px-4 pt-28">
          <div className="card-glass rounded-3xl p-8 shadow-soft">
            <div className="font-display text-3xl title-stroke">Personagem não encontrado</div>
            <p className="mt-3 text-white/80">Volte e escolha um card válido.</p>
            <button className="mt-6 btn btn-primary" onClick={() => navigate('/')}>Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  const masterLocked = character.slug === 'mestre' && !authed;
  const masterPass = import.meta.env.VITE_MASTER_PASS || 'mestre';

  const handleUnlock = (e) => {
    e.preventDefault();
    setError('');
    if (pass.trim() === masterPass) {
      localStorage.setItem(STORAGE_KEY, '1');
      setAuthed(true);
      setPass('');
      return;
    }
    setError('Senha incorreta.');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  };

  return (
    <div className="min-h-screen text-white font-body">
      <TopNav />

      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <div className="card-glass rounded-3xl overflow-hidden shadow-soft">
          <div
            className="h-56 sm:h-72 w-full"
            style={{
              backgroundImage: `url(${character.cardBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl title-stroke">{character.name}</h1>
                <p className="mt-2 text-white/80">{character.subtitle}</p>
              </div>
              {character.slug === 'mestre' && authed ? (
                <button className="btn btn-ghost" onClick={handleLogout}>Sair do modo Mestre</button>
              ) : null}
            </div>

            {masterLocked ? (
              <div className="mt-8">
                <div className="font-display text-2xl title-stroke">Acesso restrito</div>
                <p className="mt-2 text-white/80">Digite a senha para acessar a página do Mestre.</p>

                <form onSubmit={handleUnlock} className="mt-5 flex flex-col sm:flex-row gap-3">
                  <input
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    type="password"
                    className="w-full sm:w-96 rounded-2xl px-4 py-3 bg-white/15 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                    placeholder="Senha do Mestre"
                  />
                  <button className="btn btn-primary">Entrar</button>
                </form>
                {error ? <div className="mt-3 text-red-200">{error}</div> : null}

                <div className="mt-6 text-white/70 text-sm">
                  Você pode mudar a senha usando a variável <span className="font-mono">VITE_MASTER_PASS</span> no Render.
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                <div>
                  <div className="font-display text-2xl title-stroke">Informações</div>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    Essa página é um template. Você vai decidir quais campos entram (atributos, itens, história, magias, etc.).
                    Aqui já está pronto o roteamento e o visual.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card-glass rounded-2xl p-5">
                    <div className="font-display title-stroke">Ficha</div>
                    <p className="mt-2 text-white/80 text-sm">Atributos, classe, nível, PV, CA...</p>
                  </div>
                  <div className="card-glass rounded-2xl p-5">
                    <div className="font-display title-stroke">História</div>
                    <p className="mt-2 text-white/80 text-sm">Background, motivações, segredos.</p>
                  </div>
                  <div className="card-glass rounded-2xl p-5">
                    <div className="font-display title-stroke">Itens</div>
                    <p className="mt-2 text-white/80 text-sm">Inventário, ouro, equipamentos.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-primary" onClick={() => navigate('/')}>Voltar para início</button>
                  <a className="btn btn-ghost" href="#/">Home</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
