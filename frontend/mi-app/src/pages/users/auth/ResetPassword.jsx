import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(window.location.search).get('token') || '', []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-white shadow-2xl shadow-black/70">
        <h1 className="text-center text-4xl font-black uppercase tracking-[0.2em] text-red-300">Error</h1>
        <p className="mt-4 text-center text-gray-300">No se encontro el token de restauracion.</p>
        <Link to="/users/restablecer-contrasena" className="mt-6 block rounded-full bg-red-700 px-6 py-3 text-center text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600">
          Solicitar nuevo codigo
        </Link>
      </div>
    );
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/reset-password', { 
        token, 
        password,
        verified: true // Ya fue verificado en ForgotPassword
      });
      setMessage(response.data.message || 'Contrasena actualizada.');
      setTimeout(() => navigate('/users/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo restaurar la contrasena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-white shadow-2xl shadow-black/70">
      <h1 className="text-center text-4xl font-black uppercase tracking-[0.2em] text-red-300">Nueva clave</h1>
      <p className="mt-4 text-center text-gray-300">Crea una nueva contrasena para volver a entrar a tu cuenta.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="rounded-3xl border border-green-500/40 bg-green-950/20 p-4">
          <p className="text-sm text-green-200">✅ Codigo verificado correctamente</p>
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Nueva contrasena</label>
          <div className="mt-3 flex rounded-3xl border border-gray-700 bg-gray-900 focus-within:border-red-500">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Minimo 8 caracteres"
              className="w-full rounded-l-3xl bg-transparent px-4 py-3 text-lg text-white focus:outline-none"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(current => !current)} 
              className="flex w-14 items-center justify-center rounded-r-3xl text-gray-300 hover:text-white" 
              aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Confirmar contrasena</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            placeholder="Repite tu contrasena"
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
            required
          />
        </div>

        {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}
        {message && <div className="rounded-3xl bg-green-900/60 p-4 text-sm text-green-100">{message}</div>}

        <button 
          disabled={loading} 
          type="submit" 
          className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar contrasena'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        <Link to="/users/login" className="text-red-300 hover:text-white">Volver al inicio de sesion</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
