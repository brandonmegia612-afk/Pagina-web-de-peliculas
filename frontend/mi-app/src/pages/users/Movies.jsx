import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';

const categoryLabels = {
  destacados: 'Destacados',
  terror: 'Terror',
  suspenso: 'Suspenso',
  anime: 'Anime',
  accion: 'Accion',
  drama: 'Drama',
  documentales: 'Documentales',
  general: 'General',
};

const fallbackCover = item =>
  `linear-gradient(135deg, rgba(185,28,28,.92), rgba(17,24,39,.96)), radial-gradient(circle at top, rgba(250,204,21,.35), transparent 42%)`;

const MovieCard = ({ item }) => (
  <article className="group w-[210px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-xl shadow-black/40 transition hover:-translate-y-1 hover:border-red-500/60 md:w-[250px]">
    <div
      className="relative aspect-[2/3] bg-cover bg-center"
      style={item.coverUrl ? { backgroundImage: `url(${item.coverUrl})` } : { background: fallbackCover(item) }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      {item.featured && (
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-xs font-black uppercase text-black">
          <Star size={12} fill="currentColor" />
          Top
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">{categoryLabels[item.category] || item.category || 'General'}</p>
        <h3 className="mt-1 line-clamp-2 text-xl font-black leading-tight text-white">{item.title}</h3>
      </div>
    </div>

    <div className="space-y-3 p-4">
      <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-zinc-300">{item.description || 'Sin descripcion'}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.durationMinutes || 0} min</span>
        <Link
          to={`/users/movies/${item.id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white transition hover:bg-red-600"
          aria-label={`Ver ${item.title}`}
        >
          <Play size={18} fill="currentColor" />
        </Link>
      </div>
    </div>
  </article>
);

const Movies = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (!token) return;

    axios
      .get('/api/content?type=video', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setItems(response.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken('');
          setError('Tu sesion vencio. Inicia sesion otra vez para ver peliculas y videos.');
          return;
        }

        setError('No se pudieron cargar las peliculas.');
      });
  }, [token]);

  const featuredItems = useMemo(() => items.filter(item => item.featured), [items]);
  const heroItems = featuredItems.length ? featuredItems : items;
  const hero = heroItems[heroIndex] || heroItems[0];
  const rows = useMemo(() => {
    const groups = items.reduce((acc, item) => {
      const category = item.category || 'general';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    const ordered = [];
    const highlighted = [...featuredItems, ...(groups.destacados || [])].filter(
      (item, index, list) => list.findIndex(candidate => candidate.id === item.id) === index
    );
    if (highlighted.length) ordered.push(['destacados', highlighted]);
    Object.entries(groups).forEach(([category, categoryItems]) => {
      if (category !== 'destacados') ordered.push([category, categoryItems]);
    });
    return ordered;
  }, [items, featuredItems]);

  useEffect(() => {
    setHeroIndex(0);
  }, [heroItems.length]);

  useEffect(() => {
    if (heroItems.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setHeroIndex(current => (current + 1) % heroItems.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [heroItems.length]);

  const showPreviousHero = () => {
    if (heroItems.length <= 1) return;
    setHeroIndex(current => (current - 1 + heroItems.length) % heroItems.length);
  };

  const showNextHero = () => {
    if (heroItems.length <= 1) return;
    setHeroIndex(current => (current + 1) % heroItems.length);
  };

  if (!token) {
    return (
      <div className="rounded-lg border border-red-700/60 bg-black/90 p-8 text-center">
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-white">Acceso socios</h1>
        <p className="mt-4 text-gray-300">{error || 'Inicia sesion para ver peliculas y videos.'}</p>
        <Link to="/users/login" className="mt-6 inline-block rounded-full bg-red-700 px-6 py-3 font-semibold uppercase tracking-[0.15em] text-white">
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {hero && (
        <section
          className="relative -mx-6 min-h-[520px] overflow-hidden bg-cover bg-center px-6 py-10 md:rounded-lg"
          style={hero.coverUrl ? { backgroundImage: `url(${hero.coverUrl})` } : { background: fallbackCover(hero) }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
          {heroItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousHero}
                className="absolute left-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white transition hover:bg-red-700"
                aria-label="Pelicula destacada anterior"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={showNextHero}
                className="absolute right-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white transition hover:bg-red-700"
                aria-label="Siguiente pelicula destacada"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <div className="relative flex min-h-[440px] max-w-3xl flex-col justify-end">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-red-300">Ahora en cartelera</p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-none text-white md:text-7xl">{hero.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-200">{hero.description || 'Contenido agregado por el administrador.'}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/users/movies/${hero.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-black uppercase tracking-[0.12em] text-black hover:bg-red-100"
              >
                <Play size={18} fill="currentColor" />
                Ver ahora
              </Link>
              <span className="rounded-full border border-white/20 bg-black/60 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white">
                {categoryLabels[hero.category] || hero.category || 'General'}
              </span>
            </div>
            {heroItems.length > 1 && (
              <div className="mt-8 flex items-center gap-2">
                {heroItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHeroIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === heroIndex ? 'w-10 bg-red-500' : 'w-2.5 bg-white/35 hover:bg-white/70'
                    }`}
                    aria-label={`Ver destacado ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {error && <div className="rounded-lg bg-red-950 p-4 text-red-200">{error}</div>}

      {rows.map(([category, categoryItems]) => (
        <section key={category} className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-[0.14em] text-white">{categoryLabels[category] || category}</h2>
            <span className="text-sm uppercase tracking-[0.18em] text-zinc-500">{categoryItems.length} titulos</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {categoryItems.map(item => (
              <MovieCard key={`${category}-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      ))}

      {items.length === 0 && <div className="rounded-lg bg-white/5 p-6 text-gray-300">Aun no hay peliculas publicadas.</div>}
    </div>
  );
};

export default Movies;
