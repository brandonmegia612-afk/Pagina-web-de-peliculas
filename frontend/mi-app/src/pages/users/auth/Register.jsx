import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');

    if (!name || !email || !password || !phone || !dateOfBirth) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.post('/api/register', { name, email, password, phone, dateOfBirth });
      if (!response.data?.user || !response.data?.token) {
        throw new Error('Respuesta invalida del servidor.');
      }

      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      navigate('/users/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse. Verifica los datos.');
    }
  };

  return (
    <div className="mx-auto max-w-md p-8 rounded-[2rem] border border-red-700/60 bg-black/90 text-white shadow-2xl shadow-black/70 mt-10">
      <h1 className="text-4xl font-black uppercase tracking-[0.25em] text-red-300 text-center">Registrarse</h1>
      <p className="mt-4 text-gray-300 text-center">Crea tu cuenta y accede a tu perfil personalizado.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre"
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Correo</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Teléfono</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="99991234"
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Fecha de nacimiento</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
            className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}

        <button type="submit" className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600">
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        Ya tienes cuenta? <Link to="/users/login" className="text-red-300 hover:text-white">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;
