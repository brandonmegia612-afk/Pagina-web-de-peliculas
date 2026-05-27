import React, { useEffect, useState } from 'react';
import axios from 'axios';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const formatDate = value => (value ? new Date(value).toLocaleDateString() : 'Pendiente');

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadSubscriptions = () => {
    axios
      .get('/api/admin/subscriptions', authHeaders())
      .then(response => setSubscriptions(response.data))
      .catch(() => setError('No se pudieron cargar los pagos.'));
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const notifyUser = async subscription => {
    const text = prompt('Mensaje para enviar al correo/notificaciones', 'Tu pago adelantado esta registrado correctamente.');
    if (!text?.trim()) return;

    try {
      await axios.post(
        `/api/admin/subscriptions/${subscription.id}/notify`,
        {
          subject: 'Aviso de suscripcion premium',
          message: text,
        },
        authHeaders()
      );
      setMessage(`Notificacion registrada para ${subscription.User?.email}.`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo enviar la notificacion.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-500/10">
        <h1 className="text-3xl font-bold text-white">Pagos y suscripciones</h1>
        <p className="mt-3 text-gray-300">Revisa quienes pagaron por adelantado y registra avisos para correo electronico.</p>
      </div>

      {error && <div className="rounded-3xl border border-red-700/40 bg-red-950/80 p-4 text-red-200">{error}</div>}
      {message && <div className="rounded-3xl border border-green-700/40 bg-green-950/80 p-4 text-green-200">{message}</div>}

      {subscriptions.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/80 p-6 text-gray-300">Aun no hay pagos registrados.</div>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map(subscription => (
            <article key={subscription.id} className="rounded-3xl border border-white/10 bg-black/80 p-5 shadow-lg shadow-black/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{subscription.User?.name || 'Usuario'}</h2>
                  <p className="text-gray-400">{subscription.User?.email}</p>
                  <p className="text-gray-400">Telefono: {subscription.User?.phone || 'No disponible'}</p>
                  <div className="mt-4 grid gap-2 text-gray-300 sm:grid-cols-2">
                    <p>Plan: <span className="text-white">{subscription.planName}</span></p>
                    <p>Estado: <span className="text-white">{subscription.status}</span></p>
                    <p>Monto: <span className="text-white">${(subscription.amountCents / 100).toFixed(2)} {subscription.currency}</span></p>
                    <p>Tarjeta: <span className="text-white">{subscription.cardBrand} **** {subscription.cardLast4}</span></p>
                    <p>Cobro registrado en: <span className="text-white">{subscription.receivingCardName || 'Tarjeta admin'} **** {subscription.receivingCardLast4 || '----'}</span></p>
                    <p>Gratis hasta: <span className="text-white">{formatDate(subscription.trialEndsAt)}</span></p>
                    <p>Pagado hasta: <span className="text-white">{formatDate(subscription.paidThrough)}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => notifyUser(subscription)}
                  className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-cyan-600"
                >
                  Notificar correo
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSubscriptions;
