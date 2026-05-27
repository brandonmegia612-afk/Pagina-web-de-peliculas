import React, { useEffect, useState } from 'react';
import axios from 'axios';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const emptyEpisode = {
  title: '',
  episodeNumber: 1,
  embedUrl: '',
  durationMinutes: 45,
  description: '',
};

const emptyForm = {
  title: '',
  description: '',
  type: 'video',
  embedUrl: '',
  coverUrl: '',
  category: 'destacados',
  featured: true,
  body: '',
  durationMinutes: 60,
  premiumOnly: false,
  episodes: [{ ...emptyEpisode }],
};

const categories = [
  { value: 'destacados', label: 'Destacados' },
  { value: 'series', label: 'Series' },
  { value: 'kpop', label: 'K-pop' },
  { value: 'novelas_coreanas', label: 'Novelas surcoreanas' },
  { value: 'doramas', label: 'Doramas' },
  { value: 'animaciones', label: 'Animaciones' },
  { value: 'infantil', label: 'Ninos' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'terror', label: 'Terror' },
  { value: 'suspenso', label: 'Suspenso' },
  { value: 'anime', label: 'Anime' },
  { value: 'accion', label: 'Accion' },
  { value: 'drama', label: 'Drama' },
  { value: 'romance', label: 'Romance' },
  { value: 'comedia', label: 'Comedia' },
  { value: 'ciencia_ficcion', label: 'Ciencia ficcion' },
  { value: 'documentales', label: 'Documentales' },
  { value: 'general', label: 'General' },
];

const mapItemToForm = item => ({
  title: item.title || '',
  description: item.description || '',
  type: item.type || 'video',
  embedUrl: item.embedUrl || '',
  coverUrl: item.coverUrl || '',
  category: item.category || 'general',
  featured: Boolean(item.featured),
  body: item.body || '',
  durationMinutes: item.durationMinutes || 60,
  premiumOnly: Boolean(item.premiumOnly),
  episodes: (item.SeriesEpisodes || [])
    .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0))
    .map(episode => ({
      title: episode.title || '',
      episodeNumber: episode.episodeNumber || 1,
      embedUrl: episode.embedUrl || '',
      durationMinutes: episode.durationMinutes || 45,
      description: episode.description || '',
    }))
    .concat((item.SeriesEpisodes || []).length ? [] : [{ ...emptyEpisode }]),
});

const ManageContent = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadItems = () => {
    axios
      .get('/api/admin/content', authHeaders())
      .then(response => setItems(response.data))
      .catch(() => setError('No se pudo cargar el contenido.'));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateField = event => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setForm(current => ({
      ...current,
      [name]: nextValue,
      category: name === 'type' && value === 'series' ? 'series' : current.category,
    }));
  };

  const updateEpisode = (index, field, value) => {
    setForm(current => ({
      ...current,
      episodes: current.episodes.map((episode, episodeIndex) =>
        episodeIndex === index ? { ...episode, [field]: value } : episode
      ),
    }));
  };

  const addEpisode = () => {
    setForm(current => ({
      ...current,
      episodes: [
        ...current.episodes,
        { ...emptyEpisode, episodeNumber: current.episodes.length + 1 },
      ],
    }));
  };

  const removeEpisode = index => {
    setForm(current => ({
      ...current,
      episodes: current.episodes
        .filter((_, episodeIndex) => episodeIndex !== index)
        .map((episode, episodeIndex) => ({ ...episode, episodeNumber: episodeIndex + 1 })),
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setMessage('');
  };

  const submitItem = async event => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await axios.put(`/api/admin/content/${editingId}`, form, authHeaders());
        setMessage('Contenido actualizado correctamente.');
      } else {
        await axios.post('/api/admin/content', form, authHeaders());
        setMessage('Contenido guardado correctamente.');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadItems();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar el contenido.');
    }
  };

  const editItem = item => {
    setForm(mapItemToForm(item));
    setEditingId(item.id);
    setError('');
    setMessage('Editando contenido existente. Cambia solo lo necesario y guarda.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async id => {
    if (!window.confirm('Eliminar este contenido?')) return;

    try {
      await axios.delete(`/api/admin/content/${id}`, authHeaders());
      setItems(current => current.filter(item => item.id !== id));
      if (editingId === id) resetForm();
    } catch {
      setError('No se pudo eliminar el contenido.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6">
        <h1 className="text-3xl font-bold text-white">Peliculas, series, videos y notas</h1>
        <p className="mt-3 text-gray-300">
          Agrega contenido nuevo o edita el ya publicado sin perder sus datos. Para series, crea una portada principal y agrega capitulos con iframe propio.
        </p>
      </section>

      <form onSubmit={submitItem} className="grid gap-4 rounded-3xl border border-white/10 bg-black/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">{editingId ? 'Editar contenido' : 'Nuevo contenido'}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-white/10">
              Cancelar edicion
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Tipo</span>
            <select name="type" value={form.type} onChange={updateField} className="w-full rounded-2xl bg-slate-900 p-3 text-white">
              <option value="video">Pelicula / video iframe</option>
              <option value="series">Serie con capitulos</option>
              <option value="blog">Nota de blog</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Titulo</span>
            <input name="title" value={form.title} onChange={updateField} className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Descripcion</span>
          <textarea name="description" value={form.description} onChange={updateField} rows="2" className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
        </label>

        {(form.type === 'video' || form.type === 'series') ? (
          <div className="grid gap-4">
            {form.type === 'video' && (
              <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                <label className="space-y-2">
                  <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">URL para iframe</span>
                  <input name="embedUrl" value={form.embedUrl} onChange={updateField} placeholder="https://..." className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Minutos</span>
                  <input type="number" min="1" name="durationMinutes" value={form.durationMinutes} onChange={updateField} className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
                </label>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-[220px_1fr_180px]">
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Genero / seccion</span>
                <select name="category" value={form.category} onChange={updateField} className="w-full rounded-2xl bg-slate-900 p-3 text-white">
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">URL de portada</span>
                <input name="coverUrl" value={form.coverUrl} onChange={updateField} placeholder="https://imagen.jpg" className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-slate-900 p-3">
                <input type="checkbox" name="featured" checked={form.featured} onChange={updateField} className="h-5 w-5 accent-cyan-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-100">Destacado</span>
              </label>
            </div>

            {form.type === 'series' && (
              <section className="space-y-4 rounded-3xl border border-cyan-500/20 bg-slate-950/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">Capitulos de la serie</h3>
                    <p className="text-sm text-gray-400">Cada capitulo tiene su propio iframe y orden.</p>
                  </div>
                  <button type="button" onClick={addEpisode} className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-cyan-600">
                    Agregar capitulo
                  </button>
                </div>

                {form.episodes.map((episode, index) => (
                  <article key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-black/50 p-4">
                    <div className="grid gap-3 md:grid-cols-[110px_1fr_150px_auto]">
                      <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.18em] text-cyan-200">Numero</span>
                        <input type="number" min="1" value={episode.episodeNumber} onChange={event => updateEpisode(index, 'episodeNumber', event.target.value)} className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.18em] text-cyan-200">Titulo</span>
                        <input value={episode.title} onChange={event => updateEpisode(index, 'title', event.target.value)} placeholder={`Capitulo ${index + 1}`} className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.18em] text-cyan-200">Minutos</span>
                        <input type="number" min="1" value={episode.durationMinutes} onChange={event => updateEpisode(index, 'durationMinutes', event.target.value)} className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
                      </label>
                      <button type="button" onClick={() => removeEpisode(index)} disabled={form.episodes.length === 1} className="self-end rounded-full bg-red-700 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40">
                        Quitar
                      </button>
                    </div>
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.18em] text-cyan-200">Iframe del capitulo</span>
                      <input value={episode.embedUrl} onChange={event => updateEpisode(index, 'embedUrl', event.target.value)} placeholder="https://..." className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.18em] text-cyan-200">Descripcion del capitulo</span>
                      <textarea value={episode.description} onChange={event => updateEpisode(index, 'description', event.target.value)} rows="2" className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
                    </label>
                  </article>
                ))}
              </section>
            )}

            <label className="flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-slate-900 p-3">
              <input type="checkbox" name="premiumOnly" checked={form.premiumOnly} onChange={updateField} className="h-5 w-5 accent-purple-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-purple-100">Solo Premium</span>
            </label>
          </div>
        ) : (
          <label className="space-y-2">
            <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Nota</span>
            <textarea name="body" value={form.body} onChange={updateField} rows="7" className="w-full rounded-2xl bg-slate-900 p-3 text-white" />
          </label>
        )}

        {error && <div className="rounded-2xl bg-red-950 p-3 text-red-200">{error}</div>}
        {message && <div className="rounded-2xl bg-emerald-950 p-3 text-emerald-200">{message}</div>}

        <button className="rounded-full bg-cyan-600 px-6 py-3 font-semibold uppercase tracking-[0.15em] text-white hover:bg-cyan-500">
          {editingId ? 'Guardar cambios' : 'Guardar contenido'}
        </button>
      </form>

      <div className="grid gap-4">
        {items.map(item => (
          <article key={item.id} className="rounded-3xl border border-white/10 bg-black/80 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                  {item.type === 'series' ? 'Serie' : item.type === 'video' ? 'Pelicula / video' : 'Nota'}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">{item.title}</h2>
                <p className="mt-2 text-gray-300">{item.description || 'Sin descripcion'}</p>
                {(item.type === 'video' || item.type === 'series') && (
                  <div className="mt-2 flex flex-wrap gap-2 text-sm uppercase tracking-[0.16em]">
                    <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-200">{item.category || 'general'}</span>
                    {item.type === 'series' ? (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-gray-300">{item.SeriesEpisodes?.length || 0} capitulos</span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-gray-300">{item.durationMinutes || 0} minutos</span>
                    )}
                    {item.featured && <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-200">Destacado</span>}
                    {item.premiumOnly && <span className="rounded-full bg-purple-500/15 px-3 py-1 text-purple-200">Premium</span>}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => editItem(item)} className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-cyan-600">
                  Editar
                </button>
                <button onClick={() => deleteItem(item.id)} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ManageContent;
