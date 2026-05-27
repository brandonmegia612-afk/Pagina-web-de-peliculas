import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const getEmbedUrl = url => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtube.com') {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch {
    return url;
  }
};

const MoviePlayer = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (!token) return;

    axios
      .get(`/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setItem(response.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken('');
          setError('Tu sesion vencio. Inicia sesion otra vez para reproducir este contenido.');
          return;
        }

        setError('No se pudo abrir esta pelicula.');
      });
  }, [id, token]);

  if (!token) {
    return (
      <div className="rounded-lg border border-red-700/60 bg-black/90 p-8 text-center">
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-white">Acceso socios</h1>
        <p className="mt-4 text-gray-300">{error || 'Inicia sesion para reproducir este contenido.'}</p>
        <Link to="/users/login" className="mt-6 inline-block rounded-full bg-red-700 px-6 py-3 font-semibold uppercase tracking-[0.15em] text-white">
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/users/movies" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-red-200 hover:text-white">
        <ArrowLeft size={18} />
        Volver al catalogo
      </Link>

      {error && <div className="rounded-lg bg-red-950 p-4 text-red-200">{error}</div>}

      {item && (
        <>
          <section className="overflow-hidden rounded-lg border border-red-900/50 bg-black shadow-2xl shadow-black/60">
            <div className="aspect-video bg-zinc-950">
              <iframe
                src={getEmbedUrl(item.embedUrl)}
                title={item.title}
                allow="fullscreen; autoplay; encrypted-media"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </section>

          <section className="max-w-4xl space-y-3">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-300">{item.category || 'general'}</p>
            <h1 className="text-4xl font-black uppercase text-white md:text-6xl">{item.title}</h1>
            <p className="text-lg leading-8 text-zinc-300">{item.description || 'Sin descripcion'}</p>
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Duracion aproximada: {item.durationMinutes || 0} minutos</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MoviePlayer;
