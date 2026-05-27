import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CheckCircle, CreditCard, Trash2 } from 'lucide-react';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const ManagePaymentCards = () => {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({ name: '', cardNumber: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const cardBrand = useMemo(() => {
    const cleanNumber = form.cardNumber.replace(/\D/g, '');
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) return 'Mastercard';
    return 'Visa / Mastercard';
  }, [form.cardNumber]);

  const loadCards = () => {
    axios
      .get('/api/admin/receiving-cards', authHeaders())
      .then(response => setCards(response.data))
      .catch(() => setError('No se pudieron cargar las tarjetas de cobro.'));
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.post('/api/admin/receiving-cards', form, authHeaders());
      setForm({ name: '', cardNumber: '' });
      setMessage('Tarjeta de cobro agregada y activada.');
      loadCards();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo agregar la tarjeta.');
    }
  };

  const activateCard = async id => {
    try {
      await axios.put(`/api/admin/receiving-cards/${id}/activate`, {}, authHeaders());
      setMessage('Tarjeta activa actualizada.');
      setError('');
      loadCards();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo activar la tarjeta.');
    }
  };

  const deleteCard = async id => {
    if (!window.confirm('Eliminar esta tarjeta de cobro?')) return;

    try {
      await axios.delete(`/api/admin/receiving-cards/${id}`, authHeaders());
      setMessage('Tarjeta eliminada.');
      setError('');
      loadCards();
    } catch {
      setError('No se pudo eliminar la tarjeta.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-500/10">
        <h1 className="text-3xl font-bold text-white">Tarjetas de cobro</h1>
        <p className="mt-3 text-gray-300">Agrega la tarjeta donde quieres registrar los pagos. La tarjeta activa se usa para las nuevas suscripciones.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-black/80 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div>
          <label className="block text-sm uppercase tracking-[0.15em] text-cyan-200">Nombre</label>
          <input value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Mi tarjeta principal" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-[0.15em] text-cyan-200">Numero de tarjeta</label>
          <input value={form.cardNumber} onChange={event => setForm(current => ({ ...current, cardNumber: event.target.value }))} inputMode="numeric" placeholder="Visa o Mastercard" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" />
          <p className="mt-2 text-sm text-gray-400">Detectada: {cardBrand}. Solo se guarda la marca y los ultimos 4 digitos.</p>
        </div>
        <button className="rounded-full bg-cyan-700 px-5 py-3 font-semibold uppercase tracking-[0.12em] text-white hover:bg-cyan-600">
          Agregar
        </button>
      </form>

      {error && <div className="rounded-3xl border border-red-700/40 bg-red-950/80 p-4 text-red-200">{error}</div>}
      {message && <div className="rounded-3xl border border-green-700/40 bg-green-950/80 p-4 text-green-200">{message}</div>}

      <div className="grid gap-4">
        {cards.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/80 p-6 text-gray-300">No hay tarjetas de cobro registradas.</div>
        ) : (
          cards.map(card => (
            <article key={card.id} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/80 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-200">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{card.name}</h2>
                  <p className="text-gray-400">{card.cardBrand} **** {card.cardLast4}</p>
                  <p className={card.active ? 'text-green-300' : 'text-gray-500'}>{card.active ? 'Activa para recibir pagos' : 'Inactiva'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {!card.active && (
                  <button onClick={() => activateCard(card.id)} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Activar
                  </button>
                )}
                <button onClick={() => deleteCard(card.id)} className="inline-flex items-center gap-2 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-red-600">
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagePaymentCards;
