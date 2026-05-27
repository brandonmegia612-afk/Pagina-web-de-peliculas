import React from "react";
import { Link } from 'react-router-dom';

const Contacto = () => {
  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-red-700/60 bg-black/90 p-8 shadow-2xl shadow-black/70 text-white">
      <div className="space-y-8">
        <div className="rounded-3xl border border-red-800/50 bg-slate-950/90 p-8 shadow-inner shadow-red-900/20">
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">Contacto</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-white">¿Necesitas ayuda?</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-300">Escríbenos y nuestro equipo te responderá lo más pronto posible. Estamos listos para ayudarte con dudas o problemas.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-red-700/50 bg-black/80 p-6 shadow-2xl shadow-red-900/20">
            <h2 className="text-2xl font-semibold text-red-300">Soporte técnico</h2>
            <p className="mt-3 text-gray-300">Email: <span className="text-white">brandonmegia612@gmail.com</span></p>
            <p className="mt-2 text-gray-300">Teléfono: <span className="text-white">+503 7805-2617</span></p>
          </div>
          <div className="rounded-3xl border border-red-700/50 bg-black/80 p-6 shadow-2xl shadow-red-900/20">
            <h2 className="text-2xl font-semibold text-red-300">Información</h2>
            <p className="mt-3 text-gray-300">Estamos disponibles en línea las 24 horas. Envía tus preguntas y te responderemos rápido.</p>
            <p className="mt-4 text-sm text-gray-500">Para soporte técnico, indica tu email y describe el problema con claridad.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-gray-300">Regresa al inicio o crea tu cuenta para acceder a más funciones.</p>
          <Link
            to="/users/register"
            className="inline-flex items-center justify-center rounded-full bg-red-700 px-5 py-3 text-sm font-semibold uppercase text-white hover:bg-red-600"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contacto;