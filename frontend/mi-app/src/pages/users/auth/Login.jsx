import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Ingresa tu correo electronico.');
      return;
    }

    if (!password) {
      setError('Ingresa tu contrasena.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/login', { email, password });
      if (!response.data?.user || !response.data?.token) {
        throw new Error('Respuesta invalida del servidor.');
      }

      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);

      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/users/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesion. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setMessage('Integracion de Google en desarrollo. Proximamente disponible.');
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-white shadow-2xl shadow-black/70">
      <h1 className="text-center text-4xl font-black uppercase tracking-[0.25em] text-red-300">Iniciar Sesion</h1>
      <p className="mt-4 text-center text-gray-300">Accede a tu cuenta para ver tu perfil y contenido exclusivo.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Correo</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="usuario@gmail.com" 
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Contrasena</label>
          <div className="mt-3 flex rounded-3xl border border-gray-700 bg-gray-900 focus-within:border-red-500">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="contrasena" 
              className="w-full rounded-l-3xl bg-transparent px-4 py-3 text-lg text-white focus:outline-none" 
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

        {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}
        {message && <div className="rounded-3xl bg-blue-900/80 p-4 text-sm text-blue-200">{message}</div>}

        <div className="text-right">
          <Link to="/users/restablecer-contrasena" className="text-sm text-red-300 hover:text-white">
            Restablecer contrasena
          </Link>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        <button 
          onClick={handleGoogleLogin}
          className="w-full rounded-full border-2 border-gray-600 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-gray-900"
        >
          📧 Iniciar con Gmail
        </button>
      </div>

      <p className="mt-6 text-center text-gray-400">
        No tienes cuenta? <Link to="/users/register" className="text-red-300 hover:text-white">Registrate aqui</Link>
      </p>
    </div>
  );
};

export default Login;
