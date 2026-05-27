import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setUsers(response.data))
      .catch(() => setError('No se pudieron cargar los usuarios.'));
  }, []);

  const updateUser = (id, currentName) => {
    const newName = prompt('Nuevo nombre', currentName);
    if (!newName?.trim()) {
      return;
    }

    axios
      .put(
        `/api/users/${id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then(() => {
        setUsers(users.map(user => (user.id === id ? { ...user, name: newName } : user)));
      })
      .catch(() => setError('No se pudo actualizar el usuario.'));
  };

  const togglePremium = (id, currentTier) => {
    const newTier = currentTier === 'premium' ? 'free' : 'premium';
    const action = newTier === 'premium' ? 'Marcar como Premium' : 'Cambiar a Free';
    if (!window.confirm(`¿${action}?`)) return;

    axios
      .put(
        `/api/users/${id}`,
        { subscriptionTier: newTier },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then(() => {
        setUsers(users.map(user => (user.id === id ? { ...user, subscriptionTier: newTier } : user)));
      })
      .catch(() => setError('No se pudo actualizar el tier del usuario.'));
  };

  const deleteUser = id => {
    if (!window.confirm('Eliminar este usuario?')) {
      return;
    }

    axios
      .delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => setError(error.response?.data?.message || 'No se pudo eliminar el usuario.'));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-500/10">
        <h1 className="text-3xl font-bold text-white">Gestionar Usuarios</h1>
        <p className="mt-3 text-gray-300">Revisa los usuarios registrados y edita la información clave desde este panel.</p>
      </div>

      {error && <div className="rounded-3xl border border-red-700/40 bg-red-950/80 p-4 text-red-200">{error}</div>}

      {users.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/80 p-6 text-gray-300">No hay usuarios cargados aún.</div>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user.id} className="rounded-3xl border border-white/10 bg-black/80 p-5 shadow-lg shadow-black/20 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{user.name || 'Usuario sin nombre'}</p>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-400">Telefono: {user.phone || 'No disponible'}</p>
                <p className="text-gray-400">Fecha de nacimiento: {user.dateOfBirth || 'No disponible'}</p>
                <p className="text-gray-400">
                  Pago premium: {user.Subscription ? `${user.Subscription.cardBrand} **** ${user.Subscription.cardLast4}` : 'Sin pago registrado'}
                </p>
                <p className={`text-sm font-semibold uppercase ${user.subscriptionTier === 'premium' ? 'text-purple-300' : 'text-gray-400'}`}>
                  Tier: {user.subscriptionTier === 'premium' ? '👑 Premium' : 'Free'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateUser(user.id, user.name)}
                  className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-cyan-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => togglePremium(user.id, user.subscriptionTier)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white ${
                    user.subscriptionTier === 'premium' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-amber-700 hover:bg-amber-600'
                  }`}
                >
                  {user.subscriptionTier === 'premium' ? 'Cambiar a Free' : 'Marcar Premium'}
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
