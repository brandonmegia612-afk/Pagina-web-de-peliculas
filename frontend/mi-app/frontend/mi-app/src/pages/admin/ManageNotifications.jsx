import React, { useEffect, useState } from 'react';
import axios from 'axios';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadNotifications = () => {
    axios
      .get('/api/admin/notifications', authHeaders())
      .then(response => setNotifications(response.data))
      .catch(() => setError('No se pudieron cargar las notificaciones.'));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const createNotification = async event => {
    event.preventDefault();
    setError('');

    try {
      await axios.post('/api/admin/notifications', { title, message }, authHeaders());
      setTitle('');
      setMessage('');
      loadNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la notificacion.');
    }
  };

  const deleteNotification = async id => {
    if (!window.confirm('Eliminar esta notificacion?')) return;

    try {
      await axios.delete(`/api/admin/notifications/${id}`, authHeaders());
      setNotifications(current => current.filter(item => item.id !== id));
    } catch {
      setError('No se pudo eliminar la notificacion.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6">
        <h1 className="text-3xl font-bold text-white">Notificaciones para usuarios</h1>
        <p className="mt-3 text-gray-300">Los usuarios solo podran leer estos avisos desde su pagina de acceso.</p>
      </section>

      <form onSubmit={createNotification} className="grid gap-4 rounded-3xl border border-white/10 bg-black/80 p-6">
        <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Titulo" className="rounded-2xl bg-slate-900 p-3 text-white" />
        <textarea value={message} onChange={event => setMessage(event.target.value)} placeholder="Mensaje para los usuarios" rows="4" className="rounded-2xl bg-slate-900 p-3 text-white" />
        {error && <div className="rounded-2xl bg-red-950 p-3 text-red-200">{error}</div>}
        <button className="rounded-full bg-cyan-600 px-6 py-3 font-semibold uppercase tracking-[0.15em] text-white hover:bg-cyan-500">
          Enviar notificacion
        </button>
      </form>

      <div className="grid gap-4">
        {notifications.map(notification => (
          <article key={notification.id} className="rounded-3xl border border-white/10 bg-black/80 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{notification.title}</h2>
                <p className="mt-2 whitespace-pre-wrap text-gray-300">{notification.message}</p>
              </div>
              <button onClick={() => deleteNotification(notification.id)} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-red-600">
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ManageNotifications;
