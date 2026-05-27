import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageEmails = () => {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('/api/emails', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setEmails(response.data))
      .catch(() => setError('No se pudieron cargar los correos.'));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-500/10">
        <h1 className="text-3xl font-bold text-white">Gestionar Correos</h1>
        <p className="mt-3 text-gray-300">Aquí puedes revisar los correos recibidos y gestionar mensajes importantes.</p>
      </div>

      {error && <div className="rounded-3xl border border-red-700/40 bg-red-950/80 p-4 text-red-200">{error}</div>}

      {emails.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/80 p-6 text-gray-300">No hay correos disponibles en este momento.</div>
      ) : (
        <ul className="space-y-4">
          {emails.map(email => (
            <li key={email.id} className="rounded-3xl border border-white/10 bg-black/80 p-5 shadow-lg shadow-black/20">
              <p className="text-lg font-semibold text-white">{email.subject}</p>
              <p className="mt-2 text-gray-300">De: {email.sender}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageEmails;
