import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios
      .get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setNotifications(response.data))
      .catch(() => setError('No se pudieron cargar los avisos.'));
  }, [token]);

  if (!token) {
    return (
      <div className="rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-center">
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-white">Avisos</h1>
        <p className="mt-4 text-gray-300">Inicia sesion para recibir notificaciones.</p>
        <Link to="/users/login" className="mt-6 inline-block rounded-full bg-red-700 px-6 py-3 font-semibold uppercase tracking-[0.15em] text-white">
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-red-700/60 bg-black/90 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300">Notificaciones</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.2em] text-white">Avisos del administrador</h1>
      </section>

      {error && <div className="rounded-3xl bg-red-950 p-4 text-red-200">{error}</div>}

      {notifications.map(notification => (
        <article key={notification.id} className="rounded-3xl border border-red-900/50 bg-black/80 p-6">
          <h2 className="text-2xl font-bold text-white">{notification.title}</h2>
          <p className="mt-3 whitespace-pre-wrap text-gray-200">{notification.message}</p>
        </article>
      ))}

      {notifications.length === 0 && <div className="rounded-3xl bg-white/5 p-6 text-gray-300">No hay avisos por ahora.</div>}
    </div>
  );
};

export default Notifications;
