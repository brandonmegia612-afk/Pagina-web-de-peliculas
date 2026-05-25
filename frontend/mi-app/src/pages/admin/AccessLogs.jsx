import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const AccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  const loadLogs = useCallback(() => {
    axios
      .get('/api/admin/access-logs', authHeaders())
      .then(response => setLogs(response.data))
      .catch(() => setError('No se pudieron cargar los accesos.'));
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const clearLogs = async () => {
    if (!window.confirm('Seguro que quieres borrar todo el historial de accesos?')) return;

    setError('');
    setMessage('');
    setIsDeleting(true);

    try {
      await axios.delete('/api/admin/access-logs', authHeaders());
      setLogs([]);
      setMessage('Historial de accesos borrado correctamente.');
    } catch {
      setError('No se pudo borrar el historial de accesos.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = value => {
    if (!value) return 'No disponible';
    return new Date(value).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Registro de accesos</h1>
            <p className="mt-3 text-gray-300">Consulta quien entra, a que hora ingresa y cuando se desconecta.</p>
          </div>

          <button
            type="button"
            onClick={clearLogs}
            disabled={isDeleting || logs.length === 0}
            className="rounded-full bg-red-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isDeleting ? 'Borrando...' : 'Borrar historial'}
          </button>
        </div>
      </section>

      {error && <div className="rounded-3xl border border-red-700/40 bg-red-950/80 p-4 text-red-200">{error}</div>}
      {message && <div className="rounded-3xl border border-emerald-700/40 bg-emerald-950/80 p-4 text-emerald-200">{message}</div>}

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/80">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-white/10 text-sm uppercase tracking-[0.15em] text-cyan-200">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Accion</th>
              <th className="p-4">Ingreso</th>
              <th className="p-4">Desconexion</th>
              <th className="p-4">IP</th>
              <th className="p-4">Navegador</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-t border-white/10 text-gray-300">
                <td className="p-4">
                  <p className="font-semibold text-white">{log.User?.name || 'Usuario eliminado'}</p>
                  <p className="text-sm text-gray-400">{log.User?.email || 'Sin correo'}</p>
                </td>
                <td className="p-4">{log.action}</td>
                <td className="p-4">{formatDate(log.createdAt)}</td>
                <td className="p-4">{formatDate(log.disconnectedAt)}</td>
                <td className="p-4">{log.ipAddress || 'No disponible'}</td>
                <td className="p-4 text-sm">{log.userAgent || 'No disponible'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-gray-300">
          No hay registros de acceso para mostrar.
        </div>
      )}
    </div>
  );
};

export default AccessLogs;
