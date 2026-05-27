import React from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Bell, CreditCard, FileText, History, LogOut, Mail, Users } from 'lucide-react';
import logo from '../pages/users/imagne/logo universo.png';

const LayoutAdmin = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('/api/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        // Continue with local logout if the server is unavailable.
      }
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/users/login');
  };

  const menuItems = [
    { name: 'Dashboard', shortName: 'Inicio', path: '/admin', icon: BarChart3 },
    { name: 'Correos', shortName: 'Correos', path: '/admin/emails', icon: Mail },
    { name: 'Usuarios', shortName: 'Usuarios', path: '/admin/users', icon: Users },
    { name: 'Contenido', shortName: 'Contenido', path: '/admin/content', icon: FileText },
    { name: 'Avisos', shortName: 'Avisos', path: '/admin/notifications', icon: Bell },
    { name: 'Tarjetas', shortName: 'Tarjetas', path: '/admin/payment-cards', icon: CreditCard },
    { name: 'Pagos', shortName: 'Pagos', path: '/admin/subscriptions', icon: CreditCard },
    { name: 'Accesos', shortName: 'Accesos', path: '/admin/access', icon: History },
  ];

  const isActive = path => location.pathname === path;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <header className="sticky top-0 z-50 hidden border-b border-white/10 bg-slate-950/95 shadow-lg backdrop-blur-xl md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-12 w-12 rounded-xl border border-cyan-400/30 object-cover" />
            <div>
              <h1 className="text-lg font-bold tracking-wide">Panel Admin</h1>
              <p className="text-xs text-slate-400">Sistema de administracion</p>
            </div>
          </Link>

          <nav className="flex flex-wrap justify-end gap-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    isActive(item.path)
                      ? 'border-cyan-400 bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-700/80 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-28 md:px-6 md:pb-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl md:p-6">
          {children}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-cyan-700/40 bg-gradient-to-t from-black via-slate-950 to-slate-900 shadow-2xl shadow-cyan-900/30 md:hidden">
        <div className="mx-auto max-w-7xl px-2 py-2">
          <ul className="flex list-none items-center justify-around gap-1 p-0 m-0">
            {menuItems.slice(0, 7).map(item => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex min-w-12 flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs transition ${
                      isActive(item.path) ? 'bg-cyan-900/40 text-cyan-200' : 'text-gray-300 hover:text-cyan-200'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-semibold uppercase leading-none">{item.shortName}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button onClick={logout} className="flex min-w-12 flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs text-gray-300 hover:text-red-300">
                <LogOut className="h-5 w-5" />
                <span className="text-[10px] font-semibold uppercase leading-none">Salir</span>
              </button>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LayoutAdmin;
