import React from 'react';
import { Link } from 'react-router-dom';
import terminos from './pdf/terminos y condiciones.pdf';

const Termino = () => {
  return (
    <div className="p-5">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-3xl border border-red-700/50 bg-black/90 p-8 shadow-2xl shadow-red-900/30">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-red-300">Términos y Condiciones</h1>
          <p className="mt-3 text-lg text-gray-300">Lee nuestros términos y condiciones para entender tus derechos y responsabilidades al usar esta aplicación.</p>
        </div>
        <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
          <h2 className="text-xl font-semibold text-white">1. Aceptación de los términos</h2>
          <p className="mt-2 text-gray-300">Al acceder o usar esta aplicación, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, no uses la aplicación.</p>
        </div>
        <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
          <h2 className="text-xl font-semibold text-white">2. Uso de la aplicación</h2>
          <p className="mt-2 text-gray-300">Puedes usar esta aplicación solo para fines legales y de acuerdo con estos términos. No debes usarla de ninguna manera que pueda dañar, deshabilitar o sobrecargar la aplicación.</p>
        </div>
        <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
          <h2 className="text-xl font-semibold text-white">3. Propiedad intelectual</h2>
          <p className="mt-2 text-gray-300">Todo el contenido de esta aplicación, incluyendo texto, gráficos, logos y software, es propiedad de la empresa o sus licenciantes y está protegido por leyes de propiedad intelectual.</p>
        </div>
        <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
          <h2 className="text-xl font-semibold text-white">4. Modificaciones a los términos</h2>
          <p className="mt-2 text-gray-300">Nos reservamos el derecho de modificar estos términos en cualquier momento. Cualquier cambio será efectivo inmediatamente después de su publicación en esta página.</p>
        </div>
        <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
          <h2 className="text-xl font-semibold text-white">5. Contacto</h2>
          <p className="mt-2 text-gray-300">Si tienes alguna pregunta sobre estos términos, por favor contáctanos a través de nuestro <Link to="/users/contact" className="text-red-400 hover:underline">formulario de contacto</Link>.</p>
        </div>
      </div>
      <div className="mt-10 text-center text-sm text-gray-500">
        <div className="rounded-3xl border border-red-700/40 bg-slate-950/80 p-4 shadow-inner shadow-black/20">
          <a href={terminos} download className="text-red-400 hover:underline">Descargar PDF</a>
        </div>
      </div>
    </div>
  );
};

export default Termino;
