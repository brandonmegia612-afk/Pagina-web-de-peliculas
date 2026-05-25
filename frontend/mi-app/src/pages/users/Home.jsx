import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = event => {
    event.preventDefault();
    const term = searchText.trim();
    if (!term) return;
    navigate(`/users/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <section className="bg-[radial-gradient(circle_at_top,_rgba(148,0,211,0.85),_transparent_45%),linear-gradient(180deg,#120b17,#1f1527)] rounded-3xl p-8 text-center shadow-2xl shadow-black/50">
        <h1 className="font-black text-4xl md:text-5xl text-white tracking-widest uppercase">Bienvenido a la Página de Usuarios</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Busca cualquier contenido y descubre resultados relevantes al instante dentro de un estilo gótico oscuro y elegante.</p>
      </section>

      <nav className="mt-8 bg-black/80 p-5 rounded-3xl border border-red-700/40 shadow-xl shadow-red-900/20 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-6">
          <div className="text-xl font-semibold uppercase tracking-[0.3em] text-red-300">Mi Sitio Web</div>
          <ul className="flex flex-wrap gap-4 text-lg text-gray-100">
            <li><Link to="/users" className="hover:text-red-400">Inicio</Link></li>
            <li><Link to="/users/acerca" className="hover:text-red-400">Acerca</Link></li>
            <li><Link to="/users/contact" className="hover:text-red-400">Contacto</Link></li>
            <li><Link to="/users/search" className="hover:text-red-400">Buscar</Link></li>
          </ul>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-2xl gap-3 md:w-auto">
          <input
            type="search"
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
            placeholder="Busca cualquier cosa o contenido..."
            className="w-full rounded-full border border-red-600 bg-black/80 px-5 py-3 text-lg text-white placeholder:text-gray-400 focus:border-red-400 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600">
            Buscar
          </button>
        </form>
      </nav>

      <div className="container mx-auto mt-10 p-5">
        <div className="rounded-[2rem] border border-red-800/60 bg-black/70 p-8 shadow-2xl shadow-black/70">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Explora contenido en la aplicación</h2>
          <p className="mt-4 text-xl text-gray-300 leading-relaxed">Inicia una búsqueda rápida o usa los accesos directos para encontrar temas especiales con un estilo oscuro y poderoso.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/users/search?q=perfil')}
              className="rounded-3xl border border-red-700/60 bg-red-900/60 px-6 py-5 text-left text-xl font-semibold text-white shadow-xl shadow-red-900/20 transition hover:bg-red-800"
            >
              Buscar por perfil
            </button>
            <button
              onClick={() => navigate('/users/search?q=contacto')}
              className="rounded-3xl border border-red-700/60 bg-red-900/60 px-6 py-5 text-left text-xl font-semibold text-white shadow-xl shadow-red-900/20 transition hover:bg-red-800"
            >
              Buscar por contacto
            </button>
            <button
              onClick={() => navigate('/users/search?q=seguridad')}
              className="rounded-3xl border border-red-700/60 bg-red-900/60 px-6 py-5 text-left text-xl font-semibold text-white shadow-xl shadow-red-900/20 transition hover:bg-red-800"
            >
              Buscar por seguridad
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;