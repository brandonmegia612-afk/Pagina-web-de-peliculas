import React from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    {
      name: 'Dashboard',
      path: '/admin',
      icon: 'DB'
    },
    {
      name: 'Gestionar Correos',
      path: '/admin/emails',
      icon: '@'
    },
    {
      name: 'Gestionar Usuarios',
      path: '/admin/users',
      icon: 'US'
    },
    {
      name: 'Contenido',
      path: '/admin/content',
      icon: 'PL'
    },
    {
      name: 'Notificaciones',
      path: '/admin/notifications',
      icon: 'NT'
    },
    {
      name: 'Accesos',
      path: '/admin/access',
      icon: 'AC'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex flex-col">
      
      {/* HEADER */}
      <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-xl border border-cyan-400/30">
              <img src={logo} alt="Logo" className="h-80 w-80" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                Panel Admin
              </h1>
              <p className="text-sm text-slate-400">
                Sistema de Administración
              </p>
            </div>
          </div>

          {/* MENU */}
          <nav className="flex gap-3 flex-wrap">
            {menuItems.map((item, index) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-2xl
                    transition-all duration-300 border
                    hover:scale-105 hover:shadow-lg
                    ${
                      active
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/30 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                    }
                  `}
                >
                  <span className="flex h-5 min-w-5 items-center justify-center text-xs font-black">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 border bg-red-700/80 border-red-500/40 hover:bg-red-600 text-white"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
          
          <p>
            © 2026 Panel Administrativo
          </p>

          <p className="mt-2 md:mt-0">
            Desarrollado con React + TailwindCSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LayoutAdmin;
