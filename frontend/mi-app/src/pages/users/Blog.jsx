import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios
      .get('/api/content?type=blog', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setNotes(response.data))
      .catch(() => setError('No se pudieron cargar las notas.'));
  }, [token]);

  if (!token) {
    return (
      <div className="rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-center">
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-white">Notas para socios</h1>
        <p className="mt-4 text-gray-300">Inicia sesion para leer las notas publicadas.</p>
        <Link to="/users/login" className="mt-6 inline-block rounded-full bg-red-700 px-6 py-3 font-semibold uppercase tracking-[0.15em] text-white">
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-red-700/60 bg-black/90 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300">Blog</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.2em] text-white">Notas publicadas</h1>
        <p className="mt-4 text-gray-300">Entradas agregadas desde el panel de administrador.</p>
      </section>

      {error && <div className="rounded-3xl bg-red-950 p-4 text-red-200">{error}</div>}

      {notes.map(note => (
        <article key={note.id} className="rounded-3xl border border-red-900/50 bg-black/80 p-6">
          <h2 className="text-3xl font-bold text-white">{note.title}</h2>
          <p className="mt-2 text-gray-400">{note.description || 'Sin descripcion'}</p>
          <p className="mt-5 whitespace-pre-wrap text-gray-200">{note.body}</p>
        </article>
      ))}

      {notes.length === 0 && <div className="rounded-3xl bg-white/5 p-6 text-gray-300">Aun no hay notas publicadas.</div>}
    </div>
  );
};

export default Blog;
