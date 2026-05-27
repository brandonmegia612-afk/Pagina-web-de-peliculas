import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Search = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get('q')?.trim() || '';

  const contentItems = [
    {
      title: 'Perfil de usuario',
      description: 'Actualiza tu perfil, contraseña y datos personales rápidamente.',
    },
    {
      title: 'Contacto',
      description: 'Encuentra nuestras formas de contacto y soporte en segundos.',
    },
    {
      title: 'Acerca de',
      description: 'Conoce la aplicación, nuestro propósito y el equipo.',
    },
    {
      title: 'Preguntas frecuentes',
      description: 'Resuelve dudas comunes con respuestas claras y directas.',
    },
    {
      title: 'Seguridad',
      description: 'Aprende a proteger tu cuenta y tus datos personales.',
    },
  ];

  const results = query
    ? contentItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="p-5">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-3xl border border-red-700/50 bg-black/90 p-8 shadow-2xl shadow-red-900/30">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-red-300">Búsqueda oscura</h1>
          <p className="mt-3 text-lg text-gray-300">Utiliza palabras clave para encontrar secciones importantes de la aplicación al instante.</p>
          <p className="mt-4 text-gray-200">Resultados para: <span className="font-semibold text-white">{query || 'ingresa un término de búsqueda'}</span></p>
        </div>

        {!query ? (
          <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
            <p className="text-gray-300">No hay búsqueda activa. Regresa a inicio y escribe una palabra clave como <strong>perfil</strong> o <strong>contacto</strong>.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
            <h2 className="text-xl font-semibold text-white">No se encontraron resultados</h2>
            <p className="mt-2 text-gray-300">Intenta otra búsqueda o revisa la ortografía.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((item, index) => (
              <article key={index} className="rounded-3xl border border-red-700/40 bg-black/80 p-6 shadow-2xl shadow-red-900/20 transition hover:scale-[1.01]">
                <h2 className="text-2xl font-bold text-red-300">{item.title}</h2>
                <p className="mt-3 text-gray-300">{item.description}</p>
              </article>
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-inner shadow-black/20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-gray-300">¿Quieres hacer otra búsqueda o volver al inicio?</p>
          <Link
            to="/users"
            className="inline-flex items-center justify-center rounded-full bg-red-700 px-5 py-3 text-sm font-semibold uppercase text-white hover:bg-red-600"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Search;
