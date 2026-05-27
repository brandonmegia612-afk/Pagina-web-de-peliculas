import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, LockKeyhole, Wallet } from 'lucide-react';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const formatCardNumber = value =>
  value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = value => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const SubscriptionPayment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    paymentMethod: 'card',
    cardNetwork: 'visa',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paypalEmail: '',
  });
  const [receivingCard, setReceivingCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const cleanCardNumber = form.cardNumber.replace(/\D/g, '');
  const cardBrand = useMemo(() => {
    if (/^4/.test(cleanCardNumber)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(cleanCardNumber)) return 'Mastercard';
    return 'Visa / Mastercard';
  }, [cleanCardNumber]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/users/login');
      return;
    }

    axios
      .get('/api/subscription', authHeaders())
      .then(response => setReceivingCard(response.data.receivingCard || null))
      .catch(err => setError(err.response?.data?.message || 'No se pudo cargar la informacion de pago.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const updateField = event => {
    const { name, value } = event.target;
    const nextValue =
      name === 'cardNumber'
        ? formatCardNumber(value)
        : name === 'expiry'
          ? formatExpiry(value)
          : name === 'cvv'
            ? value.replace(/\D/g, '').slice(0, 4)
            : value;

    setForm(current => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setMessage('');
    setProcessing(true);

    try {
      const response = await axios.post(
        '/api/subscription',
        {
          cardName: form.cardName.trim(),
          cardNumber: cleanCardNumber,
          expiry: form.expiry,
          cvv: form.cvv,
          paymentMethod: form.paymentMethod,
          paypalEmail: form.paypalEmail,
        },
        authHeaders()
      );

      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setMessage('Pago registrado. Tu acceso Premium ya esta activo.');
      setTimeout(() => navigate('/users/movies'), 900);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo procesar el pago. Revisa los datos de la tarjeta.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 text-white">
      <Link to="/users/subscription" className="inline-flex items-center gap-2 text-gray-300 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Volver a suscripcion
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-purple-500/30 bg-zinc-950/90 p-6 shadow-2xl shadow-purple-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">Pago Premium</p>
            <h1 className="mt-2 text-3xl font-black uppercase text-white">Activa tu acceso</h1>
            <p className="mt-2 text-gray-400">Completa los datos de tu tarjeta para registrar el pago y desbloquear el contenido Premium.</p>
          </div>

          {error && <div className="rounded-lg border border-red-700/50 bg-red-950/70 p-4 text-red-200">{error}</div>}
          {message && <div className="rounded-lg border border-green-700/50 bg-green-950/70 p-4 text-green-200">{message}</div>}
          {!loading && form.paymentMethod === 'card' && !receivingCard && (
            <div className="rounded-lg border border-amber-600/50 bg-amber-950/50 p-4 text-amber-100">
              El administrador debe agregar una tarjeta de cobro activa antes de recibir pagos.
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.15em] text-purple-200">Forma de pago</label>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {[
                { value: 'card', network: 'visa', label: 'Visa', helper: 'Tarjeta' },
                { value: 'card', network: 'mastercard', label: 'Mastercard', helper: 'Tarjeta' },
                { value: 'paypal', network: 'paypal', label: 'PayPal', helper: 'Correo' },
              ].map(option => {
                const active = form.paymentMethod === option.value && form.cardNetwork === option.network;
                return (
                  <button
                    key={`${option.value}-${option.label}`}
                    type="button"
                    onClick={() => setForm(current => ({ ...current, paymentMethod: option.value, cardNetwork: option.network }))}
                    className={`rounded-lg border px-4 py-3 text-left transition ${active ? 'border-purple-400 bg-purple-600/20 text-white' : 'border-zinc-700 bg-zinc-900 text-gray-300 hover:border-purple-500'}`}
                  >
                    <span className="block font-bold">{option.label}</span>
                    <span className="text-sm text-gray-400">{option.helper}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {form.paymentMethod === 'paypal' ? (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.15em] text-purple-200">Correo PayPal</label>
              <input
                name="paypalEmail"
                type="email"
                value={form.paypalEmail}
                onChange={updateField}
                autoComplete="email"
                placeholder="cuenta@paypal.com"
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-400"
                required
              />
            </div>
          ) : (
            <>
          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.15em] text-purple-200">Nombre en la tarjeta</label>
            <input
              name="cardName"
              value={form.cardName}
              onChange={updateField}
              autoComplete="cc-name"
              placeholder="Nombre completo"
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.15em] text-purple-200">Numero de tarjeta</label>
            <div className="mt-2 flex rounded-lg border border-zinc-700 bg-zinc-900 focus-within:border-purple-400">
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={updateField}
                autoComplete="cc-number"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-l-lg bg-transparent px-4 py-3 text-white outline-none"
                required
              />
              <div className="flex min-w-28 items-center justify-center rounded-r-lg border-l border-zinc-700 px-3 text-sm text-purple-200">
                {cardBrand}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.15em] text-purple-200">Vencimiento</label>
              <input
                name="expiry"
                value={form.expiry}
                onChange={updateField}
                autoComplete="cc-exp"
                inputMode="numeric"
                placeholder="MM/AA"
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.15em] text-purple-200">CVV</label>
              <input
                name="cvv"
                value={form.cvv}
                onChange={updateField}
                autoComplete="cc-csc"
                inputMode="numeric"
                placeholder="123"
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-400"
                required
              />
            </div>
          </div>
            </>
          )}

          <button
            type="submit"
            disabled={processing || loading || (form.paymentMethod === 'card' && !receivingCard)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LockKeyhole className="h-5 w-5" />
            {processing ? 'Procesando pago...' : 'Completar pago'}
          </button>
        </form>

        <aside className="space-y-4 rounded-lg border border-zinc-800 bg-black/80 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/20 text-purple-200">
            {form.paymentMethod === 'paypal' ? <Wallet className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-gray-400">Plan seleccionado</p>
            <h2 className="mt-1 text-2xl font-black text-white">Premium</h2>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-gray-400">Total mensual</p>
            <p className="mt-1 text-3xl font-black text-purple-300">$0.25</p>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Contenido Premium desbloqueado
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Comentarios habilitados
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Acceso inmediato despues del pago
            </li>
          </ul>
          <p className="rounded-lg border border-green-700/40 bg-green-950/40 p-3 text-sm text-green-200">
            Formas disponibles: PayPal, Visa y Mastercard.
            {receivingCard ? ` Cobro activo: ${receivingCard.cardBrand} **** ${receivingCard.cardLast4}` : ''}
          </p>
        </aside>
      </section>
    </div>
  );
};

export default SubscriptionPayment;
