import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setMessage('');
    setResetLink('');
    setLoading(true);

    try {
      const response = await axios.post('/api/forgot-password', { email });
      setMessage(response.data.message || 'Revisa las instrucciones para restaurar tu contrasena.');
      if (response.data.resetToken) {
        setResetLink(`${window.location.origin}/users/reset-password?token=${response.data.resetToken}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo generar el enlace de restauracion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-white shadow-2xl shadow-black/70">
      <h1 className="text-center text-4xl font-black uppercase tracking-[0.2em] text-red-300">Restaurar</h1>
      <p className="mt-4 text-center text-gray-300">Ingresa tu correo para generar un enlace de cambio de contrasena.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Correo</label>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
            required
          />
        </div>

        {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}
        {message && <div className="rounded-3xl bg-green-900/60 p-4 text-sm text-green-100">{message}</div>}
        {resetLink && (
          <Link to={`/users/reset-password?token=${resetLink.split('token=')[1]}`} className="block rounded-3xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100 hover:bg-red-900/50">
            Abrir enlace de restauracion
          </Link>
        )}

        <button disabled={loading} type="submit" className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600 disabled:opacity-50">
          {loading ? 'Generando...' : 'Generar enlace'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        Ya recordaste? <Link to="/users/login" className="text-red-300 hover:text-white">Inicia sesion</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
