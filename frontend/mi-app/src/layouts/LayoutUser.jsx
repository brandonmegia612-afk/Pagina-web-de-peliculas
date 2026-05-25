import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
        setIsAdmin(userData.rol === 'admin' || userData.isAdmin === true);
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
      <header>
        <nav className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-black to-slate-900 p-6 text-white shadow-black/40 shadow-2xl">
          <div className="flex flex-wrap justify-center gap-4 flex-1">
            <Link to="/users" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Inicio</Link>
            <Link to="/users/profile" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Perfil</Link>
            <Link to="/users/movies" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Peliculas</Link>
            <Link to="/users/blog" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Notas</Link>
            <Link to="/users/notifications" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Avisos</Link>
            <Link to="/users/acerca" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Acerca</Link>
            <Link to="/users/contact" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Contacto</Link>
            <Link to="/users/search" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Buscar</Link>
            <Link to="/users/login" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Ingresar</Link>
            <Link to="/users/register" className="text-base md:text-lg font-vito-bold tracking-widest uppercase hover:text-red-400">Registrar</Link>
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

      <main className="mx-auto w-full max-w-6xl p-6 text-base md:text-lg lg:text-xl leading-relaxed">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-slate-950 via-black to-purple-950 p-8 mt-10 border-t border-red-900/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-wide uppercase text-red-300 animate-fade-in">Secciones rápidas</h1>
          <p className="text-lg text-gray-300 animate-fade-in-delay">Navega por el sitio con un estilo oscuro y envolvente.</p>
          <ul className="flex flex-wrap justify-center gap-3 md:gap-5 text-base md:text-lg list-none p-0 m-0">
            <li className="footer-item" style={{ animationDelay: '0s' }}>
              <Link to="/users/contact" className="footer-link font-semibold">Contacto</Link>
            </li>
            <li className="footer-item" style={{ animationDelay: '0.1s' }}>
              <Link to="/users/acerca" className="footer-link font-semibold">Acerca</Link>
            </li>
            <li className="footer-item" style={{ animationDelay: '0.2s' }}>
              <Link to="/users/search" className="footer-link font-semibold">Buscar</Link>
            </li>
            <li className="footer-item" style={{ animationDelay: '0.3s' }}>
              <Link to="/users/profile" className="footer-link font-semibold">Perfil</Link>
            </li>
            <li className="footer-item" style={{ animationDelay: '0.4s' }}>
              <Link to="/users/movies" className="footer-link font-semibold">Películas</Link>
            </li>
            <li className="footer-item" style={{ animationDelay: '0.5s' }}>
              <Link to="/users/blog" className="footer-link font-semibold">Notas</Link>
            </li>
          </ul>
          <p className="text-sm md:text-base text-gray-500 animate-fade-in-delay">© 2026 creado en react. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LayoutUser;
