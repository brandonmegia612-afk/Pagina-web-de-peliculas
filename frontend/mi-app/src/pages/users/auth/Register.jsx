import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

const getPasswordStrength = password => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) return { label: '', className: 'bg-gray-700', width: '0%', hint: '' };
  if (score <= 1) return { label: 'Insegura', className: 'bg-red-600', width: '33%', hint: 'Usa minimo 8 caracteres.' };
  if (score <= 3) return { label: 'Normal', className: 'bg-yellow-500', width: '66%', hint: 'Agrega mayusculas, numeros y simbolos.' };
  return { label: 'Segura', className: 'bg-green-600', width: '100%', hint: 'Contrasena segura.' };
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');

    if (!name || !email || !password || !phone || !dateOfBirth) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Ingresa un correo electronico valido.');
      return;
    }

    if (password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
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
    <div className="mx-auto mt-10 max-w-md rounded-[2rem] border border-red-700/60 bg-black/90 p-8 text-white shadow-2xl shadow-black/70">
      <h1 className="text-center text-4xl font-black uppercase tracking-[0.25em] text-red-300">Registrarse</h1>
      <p className="mt-4 text-center text-gray-300">Crea tu cuenta y accede a tu perfil personalizado.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Nombre</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Correo</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none" />
          {email && !isValidEmail(email) && <p className="mt-2 text-sm text-red-300">El correo debe tener formato real, por ejemplo nombre@dominio.com.</p>}
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Telefono</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="99991234" className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Contrasena</label>
          <div className="mt-3 flex rounded-3xl border border-gray-700 bg-gray-900 focus-within:border-red-500">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="********" className="w-full rounded-l-3xl bg-transparent px-4 py-3 text-lg text-white focus:outline-none" />
            <button type="button" onClick={() => setShowPassword(current => !current)} className="flex w-14 items-center justify-center rounded-r-3xl text-gray-300 hover:text-white" aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}>
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {password && (
            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                <div className={`h-full ${passwordStrength.className}`} style={{ width: passwordStrength.width }} />
              </div>
              <p className="mt-2 text-sm text-gray-300">
                Seguridad: <span className="font-semibold text-white">{passwordStrength.label}</span>. {passwordStrength.hint}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-red-200">Fecha de nacimiento</label>
          <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="mt-3 w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-lg text-white focus:border-red-500 focus:outline-none" />
        </div>

        {error && <div className="rounded-3xl bg-red-900/80 p-4 text-sm text-red-200">{error}</div>}

        <button type="submit" className="w-full rounded-full bg-red-700 px-6 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-600">
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        Ya tienes cuenta? <Link to="/users/login" className="text-red-300 hover:text-white">Inicia sesion</Link>
      </p>
    </div>
  );
};

export default Register;
