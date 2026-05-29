import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Film, FileText, Bell, User, Search, LogOut, CreditCard, KeyRound } from 'lucide-react';
import './LayoutUser.css';

const LayoutUser = ({ children }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.nombre || userData.name || userData.username || 'Usuario');
        setIsAdmin(userData.role === 'admin' || userData.rol === 'admin' || userData.isAdmin === true);
      } catch {
        setUserName('Usuario');
      }
    }
  }, []);

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('/api/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        // Local logout still clears the browser session.
      }
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/users/login');
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <header className="hidden md:block">
        <nav className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-black to-slate-900 p-6 text-white shadow-black/40 shadow-2xl">
          <div className="flex flex-wrap justify-center gap-4 flex-1">
            <Link to="/users" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Inicio</Link>
            <Link to="/users/profile" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Perfil</Link>
            <Link to="/users/movies" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Peliculas</Link>
            <Link to="/users/blog" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Notas</Link>
            <Link to="/users/notifications" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Avisos</Link>
            <Link to="/users/subscription" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Premium</Link>
            <Link to="/users/acerca" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Acerca</Link>
            <Link to="/users/contact" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Contacto</Link>
            <Link to="/users/search" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Buscar</Link>
            <Link to="/users/login" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Ingresar</Link>
            <Link to="/users/register" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Registrar</Link>
            <Link to="/users/restablecer-contrasena" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Restablecer</Link>
            <Link to="/users/terminos" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Términos y condiciones </Link>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <div className="welcome-container">
              <div className="welcome-badge">
                <span className="welcome-icon">👋 </span>
                <span className="welcome-text">BIENVENIDO</span>
                <span className="welcome-text">
                  {isAdmin ? '⚡ ¡JEFE!' : `${userName.toUpperCase()}`}
                </span>
              </div>
            </div>
            <button onClick={logout} className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400 whitespace-nowrap">Salir</button>
          </div>
        </nav>
    
      </header>

      <main className="mx-auto w-full max-w-6xl p-6 pb-28 md:pb-6 text-base md:text-lg lg:text-xl leading-relaxed">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-slate-950 to-slate-900 border-t border-red-700/40 shadow-2xl shadow-red-900/30 z-50 md:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ul className="flex justify-around items-center list-none p-0 m-0 flex-wrap">
            <li>
              <Link to="/users" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <Home className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/users/movies" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <Film className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Películas</span>
              </Link>
            </li>
            <li>
              <Link to="/users/blog" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <FileText className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Notas</span>
              </Link>
            </li>
            <li>
              <Link to="/users/notifications" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <Bell className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Avisos</span>
              </Link>
            </li>
            <li>
              <Link to="/users/subscription" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Premium</span>
              </Link>
            </li>
            <li>
              <Link to="/users/search" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <Search className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Buscar</span>
              </Link>
            </li>
            <li>
              <Link to="/users/profile" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <User className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Perfil</span>
              </Link>
            </li>
            <li>
              <Link to="/users/restablecer-contrasena" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <KeyRound className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Clave</span>
              </Link>
            </li>
            <li>
              <button onClick={logout} className="flex flex-col items-center gap-1 px-3 py-2 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-900/20">
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Salir</span>
              </button>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LayoutUser;
