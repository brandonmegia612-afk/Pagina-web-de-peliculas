import React from "react";
import imagen from './imagne/berserk.png';

const Acerca = () => {
  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-red-700/60 bg-black/90 p-8 shadow-2xl shadow-black/70 text-white">
      <div className="space-y-8">
        <div className="rounded-3xl border border-red-800/50 bg-slate-950/90 p-8 shadow-inner shadow-red-900/20">
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">Acerca de</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-white">Una experiencia oscura y elegante</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-300">Esta plataforma está hecha para que disfrutes videos cortos y contenido selecto en familia o desde cualquier lugar. Todo con una interfaz oscura, cómoda y moderna.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-red-300">Nuestra misión</h2>
            <p className="text-gray-300 leading-relaxed">Queremos que encuentres películas recientes y títulos antiguos con rapidez y estilo. Si tienes dudas, contáctanos para recibir soporte técnico rápido y confiable.</p>
            <p className="text-gray-400">Tu seguridad y experiencia son nuestra prioridad.</p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-red-700/40 bg-black/80 shadow-2xl shadow-red-900/30">
            <img src={imagen} alt="Acerca de" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 text-gray-300">
          <p className="text-sm uppercase tracking-[0.25em] text-red-400">Compromiso</p>
          <p className="mt-3 leading-relaxed">Diseñamos este sitio para brindarte un ambiente oscuro y elegante sin perder claridad ni facilidad de uso.</p>
          <p className="mt-4 text-sm text-gray-500">© 2026 Mi Aplicación. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Acerca;