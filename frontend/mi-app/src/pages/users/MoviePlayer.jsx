import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Star } from 'lucide-react';

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
  const [userTier, setUserTier] = useState('free');
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserTier(userData.subscriptionTier || 'free');
        setUserId(userData.id);
      } catch {
        setUserTier('free');
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setItem(response.data);
        setSelectedEpisodeIndex(0);
      })
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

  useEffect(() => {
    if (!token || userTier !== 'premium') return;

    setCommentsLoading(true);
    axios
      .get(`/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setComments(response.data || []))
      .catch(err => console.error('Error loading comments:', err))
      .finally(() => setCommentsLoading(false));
  }, [id, token, userTier]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || userTier !== 'premium') return;

    setSubmittingComment(true);
    try {
      const response = await axios.post(
        '/api/comments',
        { ContentItemId: parseInt(id), text: newComment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
      setRating(5);
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const episodes = (item?.SeriesEpisodes || []).slice().sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
  const selectedEpisode = episodes[selectedEpisodeIndex] || episodes[0];
  const playerUrl = item?.type === 'series' ? selectedEpisode?.embedUrl : item?.embedUrl;
  const playerTitle = item?.type === 'series' && selectedEpisode ? `${item.title} - ${selectedEpisode.title}` : item?.title;

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;

    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

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
                src={getEmbedUrl(playerUrl)}
                title={playerTitle}
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
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
              {item.type === 'series' ? `${episodes.length} capitulos disponibles` : `Duracion aproximada: ${item.durationMinutes || 0} minutos`}
            </p>
          </section>

          {item.type === 'series' && (
            <section className="max-w-5xl space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
              <h2 className="text-2xl font-black uppercase tracking-[0.18em] text-white">Capitulos</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {episodes.map((episode, index) => (
                  <button
                    key={episode.id || index}
                    type="button"
                    onClick={() => setSelectedEpisodeIndex(index)}
                    className={`rounded-lg border p-4 text-left transition ${
                      selectedEpisodeIndex === index
                        ? 'border-red-500 bg-red-950/50 text-white'
                        : 'border-zinc-800 bg-black/50 text-gray-300 hover:border-red-700'
                    }`}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">Capitulo {episode.episodeNumber}</p>
                    <h3 className="mt-1 text-lg font-bold">{episode.title}</h3>
                    {episode.description && <p className="mt-2 line-clamp-2 text-sm text-gray-400">{episode.description}</p>}
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-zinc-500">{episode.durationMinutes || 0} minutos</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {userTier === 'premium' && (
            <>
              <section className="max-w-4xl space-y-6 border-t border-zinc-800 pt-6">
                <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Comentarios</h2>

                <form onSubmit={handleAddComment} className="space-y-3 rounded-lg border border-purple-700/50 bg-purple-950/30 p-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Tu comentario</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Comparte tu opinión..."
                      className="w-full rounded-lg bg-zinc-900 p-3 text-white placeholder-gray-500 border border-zinc-700 focus:border-purple-500 outline-none resize-none"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Calificación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="w-full rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white uppercase tracking-[0.1em] transition hover:bg-purple-600 disabled:opacity-50"
                  >
                    {submittingComment ? 'Publicando...' : 'Publicar comentario'}
                  </button>
                </form>

                <div className="space-y-3">
                  {commentsLoading ? (
                    <p className="text-gray-400">Cargando comentarios...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-400">Sin comentarios aún. ¡Sé el primero!</p>
                  ) : (
                    comments.map((comment) => (
                      <article key={comment.id} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-white">{comment.User?.username || 'Usuario'}</p>
                              {comment.rating && (
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={star <= comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-gray-300">{comment.text}</p>
                            <p className="mt-2 text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          {userId === comment.userId && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 hover:text-red-400 transition"
                              aria-label="Eliminar comentario"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MoviePlayer;
