import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-8 shadow-2xl shadow-cyan-500/10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Panel administrativo</p>
        <h1 className="mt-4 text-4xl font-black text-white">Bienvenido, administrador</h1>
        <p className="mt-4 text-gray-300 leading-relaxed">Desde aquí puedes gestionar usuarios, revisar correos y supervisar el estado general de la aplicación.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-black/80 p-6 shadow-xl shadow-cyan-500/10">
          <h2 className="text-xl font-semibold text-white">Usuarios</h2>
          <p className="mt-3 text-gray-300">Revisa, edita o elimina usuarios registrados en la plataforma.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-black/80 p-6 shadow-xl shadow-cyan-500/10">
          <h2 className="text-xl font-semibold text-white">Correos</h2>
          <p className="mt-3 text-gray-300">Gestiona mensajes, notificaciones o solicitudes de soporte desde el panel.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-black/80 p-6 shadow-xl shadow-cyan-500/10">
          <h2 className="text-xl font-semibold text-white">Estado</h2>
          <p className="mt-3 text-gray-300">Visualiza el rendimiento general y mantén la plataforma estable.</p>
        </article>
      </div>
    </div>
  );
};

export default AdminDashboard;