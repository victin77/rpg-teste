import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const { pathname } = useLocation();
  const onHome = pathname === '/' || pathname === '/inicio';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to={"/"} className="font-display tracking-wide text-white/90 hover:text-white transition">
          De Dignis Insanis Opera
        </Link>
        {onHome ? (
          <nav className="hidden sm:flex items-center gap-2">
            <a href="#sobre" className="btn btn-ghost">Sobre</a>
            <a href="#personagens" className="btn btn-ghost">Personagens</a>
            <a href="#cronicas" className="btn btn-ghost">Crônicas</a>
          </nav>
        ) : (
          <Link to={"/"} className="btn btn-ghost">Voltar</Link>
        )}
      </div>
    </header>
  );
}
