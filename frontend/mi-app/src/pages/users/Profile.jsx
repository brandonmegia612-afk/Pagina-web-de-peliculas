import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ProfileCard from './profile/ProfileCard';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      setLoading(false);
      return;
    }

    let parsedUser = null;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setLoading(false);
      return;
    }
    if (parsedUser.role === 'admin') {
      navigate('/admin');
      return;
    }

    axios
      .get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setError('No se pudo cargar la informacion del perfil. Inicia sesion nuevamente.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 text-white">
      <div className="rounded-[2rem] border border-red-700/60 bg-black/90 p-8 shadow-2xl shadow-black/70">
        <header className="mb-10 text-center">
          <p className="text-red-300 uppercase tracking-[0.35em] text-sm">Perfil</p>
          <h1 className="mt-4 text-5xl font-black uppercase tracking-[0.25em] text-white">Panel de Usuario</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Aqui veras solamente tu informacion personal: nombre, correo, telefono y fecha de nacimiento.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl bg-white/5 p-8 text-center text-xl text-gray-200">Cargando informacion del perfil...</div>
        ) : error ? (
          <div className="rounded-3xl bg-red-900/20 border border-red-700/50 p-8 text-center text-lg text-red-200">{error}</div>
        ) : user ? (
          <ProfileCard user={user} />
        ) : (
          <div className="rounded-3xl bg-white/5 p-8 text-center text-lg text-gray-200">
            No hay datos de perfil disponibles. Por favor inicia sesion o registrate.
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/users/login"
            className="rounded-full bg-red-700 px-8 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-red-600"
          >
            Iniciar sesion
          </Link>
          <Link
            to="/users/register"
            className="rounded-full border border-red-600 bg-transparent px-8 py-3 text-lg font-semibold uppercase tracking-[0.15em] text-red-200 transition hover:border-red-400 hover:text-white"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
