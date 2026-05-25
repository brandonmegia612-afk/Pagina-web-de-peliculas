import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Ingresa email y contraseña.');
      return;
    }

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
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus datos.');
    }
  };

  return (
    <div className="mx-auto max-w-md p-8 rounded-[2rem] border border-red-700/60 bg-black/90 text-white shadow-2xl shadow-black/70 mt-10">
      <h1 className="text-4xl font-black uppercase tracking-[0.25em] text-red-300 text-center">Iniciar Sesión</h1>
      <p className="mt-4 text-gray-300 text-center">Accede a tu cuenta para ver tu perfil y contenido exclusivo.</p>

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
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="contraseña"
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}

        <button type="submit" className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600">
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        ¿No tienes cuenta? <Link to="/users/register" className="text-red-300 hover:text-white">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
