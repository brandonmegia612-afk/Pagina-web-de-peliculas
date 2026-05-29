import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'code' | 'success'

  const handleRequestCode = async event => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email) {
      setError('Ingresa tu correo electronico.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/forgot-password', { email });
      setMessage(response.data.message);
      setResetToken(response.data.resetToken);
      setStep('code');
      
      // Mostrar código en desarrollo
      if (response.data.verificationCode) {
        console.log(`🔐 Código de verificación (desarrollo): ${response.data.verificationCode}`);
        setMessage(`${response.data.message}\n\n🔐 Código: ${response.data.verificationCode} (solo para desarrollo)`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo generar el codigo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async event => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!code || code.length !== 6) {
      setError('Ingresa un codigo de 6 digitos.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/verify-email-code', { 
        resetToken, 
        code 
      });
      setMessage(response.data.message);
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Codigo incorrecto o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setCode('');
    setResetToken('');
    setStep('email');
    setMessage('');
    setError('');
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-white shadow-2xl shadow-black/70">
      <h1 className="text-center text-4xl font-black uppercase tracking-[0.2em] text-red-300">Restaurar</h1>
      <p className="mt-4 text-center text-gray-300">Ingresa tu correo y verifica con el codigo que recibiras.</p>

      {step === 'email' && (
        <form onSubmit={handleRequestCode} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Correo</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}
          {message && <div className="rounded-3xl bg-blue-900/80 p-4 text-sm text-blue-200 whitespace-pre-wrap">{message}</div>}

          <button 
            disabled={loading}
            type="submit" 
            className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar codigo'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerifyCode} className="mt-8 space-y-5">
          <div className="rounded-3xl border border-gray-600 bg-gray-900 p-4">
            <p className="text-sm text-gray-300">Codigo enviado a:</p>
            <p className="mt-2 font-semibold text-white">{email}</p>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Ingresa el codigo (6 digitos)</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-center text-white focus:border-red-500 focus:outline-none"
              required
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-400">Valido por 15 minutos</p>
          </div>

          {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}
          {message && <div className="rounded-3xl bg-blue-900/80 p-4 text-sm text-blue-200">{message}</div>}

          <div className="space-y-3">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar codigo'}
            </button>
            <button 
              type="button"
              onClick={handleReset}
              className="w-full rounded-full border-2 border-gray-600 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-gray-900"
            >
              Volver
            </button>
          </div>
        </form>
      )}

      {step === 'success' && (
        <div className="mt-8 space-y-5">
          <div className="rounded-3xl border border-green-500/40 bg-green-950/40 p-6 text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-semibold text-green-100">{message}</p>
          </div>

          <Link 
            to={`/users/cambiar-contrasena?token=${resetToken}`}
            className="block rounded-full bg-red-700 px-6 py-3 text-center text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600"
          >
            Restaurar contrasena →
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-gray-400">
        Ya recordaste? <Link to="/users/login" className="text-red-300 hover:text-white">Inicia sesion</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
