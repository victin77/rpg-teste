import { useEffect } from 'react';
import TopNav from '../components/TopNav.jsx';
import CharacterCard from '../components/CharacterCard.jsx';
import ChronicleCard from '../components/ChronicleCard.jsx';
import bgUrl from '../assets/background.png';
import { CHARACTERS } from '../data/characters.js';
import { CHRONICLES } from '../data/chronicles.js';

export default function Home() {
  useEffect(() => {
    // Define o fundo da página (não fixo)
    document.body.style.setProperty('--page-bg', `url(${bgUrl})`);
    return () => {
      document.body.style.removeProperty('--page-bg');
    };
  }, []);

  return (
    <div className="min-h-screen text-white font-body">
      <TopNav />

      {/* Hero */}
      <section className="min-h-screen flex items-end">
        <div className="w-full page-soft-haze">
          <div className="mx-auto max-w-6xl px-4 pt-24 pb-14">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl title-stroke tracking-wide">
              DE DIGNIS INSANIS OPERA
            </h1>
            <p className="mt-4 max-w-xl text-white/85 text-base sm:text-lg">
              Bem-vindo ao nosso mundo. Aqui ficam referências, recaps e o painel da campanha.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#personagens" className="btn btn-primary">Ver personagens</a>
              <a href="#cronicas" className="btn btn-ghost">Ler crônicas</a>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="card-glass rounded-3xl p-8 shadow-soft">
            <div className="font-display text-2xl sm:text-3xl title-stroke">ABOUT</div>
            <p className="mt-4 text-white/85 leading-relaxed">
              Você pode trocar os textos e links por qualquer conteúdo do grupo. A ideia é ter um site limpo,
              com o fundo visível (sem escurecer) e cards clicáveis.
            </p>
          </div>
        </div>
      </section>

      {/* Personagens */}
      <section id="personagens">
        <div className="mx-auto max-w-6xl px-4 pb-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-display text-2xl sm:text-3xl title-stroke">CHARACTERS</div>
              <p className="mt-2 text-white/80">Clique no centro do card para abrir a página do personagem.</p>
            </div>
            <a href="#cronicas" className="hidden sm:inline-flex btn btn-ghost">Pular para crônicas</a>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
            {CHARACTERS.map((c) => (
              <div key={c.slug} className="snap-center">
                <CharacterCard character={c} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-white/70 text-sm">
            Dica: as imagens dos cards ficam em <span className="font-mono">/public/cards</span>.
          </p>
        </div>
      </section>

      {/* Crônicas */}
      <section id="cronicas" className="">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-display text-2xl sm:text-3xl title-stroke">CRÔNICAS</div>
              <p className="mt-2 text-white/80">Resumo de cada sessão (card clicável).</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHRONICLES.map((c) => (
              <ChronicleCard key={c.id} chronicle={c} />
            ))}
          </div>

          <footer className="mt-16 pb-10 text-center text-white/60 text-sm">
            <div className="font-display tracking-wide">De Dignis Insanis Opera</div>
            <div className="mt-1">Feito para sua campanha — você controla as artes e os conteúdos.</div>
          </footer>
        </div>
      </section>
    </div>
  );
}
