import React, { useEffect, useState } from 'react';
import axios from 'axios';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

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
};

const categories = [
  { value: 'destacados', label: 'Destacados' },
  { value: 'terror', label: 'Terror' },
  { value: 'suspenso', label: 'Suspenso' },
  { value: 'anime', label: 'Anime' },
  { value: 'accion', label: 'Accion' },
  { value: 'drama', label: 'Drama' },
  { value: 'documentales', label: 'Documentales' },
  { value: 'general', label: 'General' },
];

const ManageContent = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
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
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const createItem = async event => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.post('/api/admin/content', form, authHeaders());
      setForm(emptyForm);
      setMessage('Contenido guardado correctamente.');
      loadItems();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar el contenido.');
    }
  };

  const deleteItem = async id => {
    if (!window.confirm('Eliminar este contenido?')) return;

    try {
      await axios.delete(`/api/admin/content/${id}`, authHeaders());
      setItems(current => current.filter(item => item.id !== id));
    } catch {
      setError('No se pudo eliminar el contenido.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6">
        <h1 className="text-3xl font-bold text-white">Peliculas, videos y notas</h1>
        <p className="mt-3 text-gray-300">Agrega enlaces iframe de Mega, Google Drive u otros proveedores, clasifica por categoria y marca lo mas importante como destacado.</p>
      </section>

      <form onSubmit={createItem} className="grid gap-4 rounded-3xl border border-white/10 bg-black/80 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Tipo</span>
            <select name="type" value={form.type} onChange={updateField} className="w-full rounded-2xl bg-slate-900 p-3 text-white">
              <option value="video">Video o pelicula iframe</option>
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

        {form.type === 'video' ? (
          <div className="grid gap-4">
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

            <div className="grid gap-4 md:grid-cols-[220px_1fr_180px]">
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-cyan-200">Categoria</span>
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
          Guardar contenido
        </button>
      </form>

      <div className="grid gap-4">
        {items.map(item => (
          <article key={item.id} className="rounded-3xl border border-white/10 bg-black/80 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{item.type === 'video' ? 'Pelicula / video' : 'Nota'}</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{item.title}</h2>
                <p className="mt-2 text-gray-300">{item.description || 'Sin descripcion'}</p>
                {item.type === 'video' && (
                  <div className="mt-2 flex flex-wrap gap-2 text-sm uppercase tracking-[0.16em]">
                    <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-200">{item.category || 'general'}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-gray-300">{item.durationMinutes || 0} minutos</span>
                    {item.featured && <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-200">Destacado</span>}
                  </div>
                )}
              </div>
              <button onClick={() => deleteItem(item.id)} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-red-600">
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ManageContent;
