import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Crown, CreditCard, Film, MessageCircle, Zap } from 'lucide-react';

const Subscription = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setError('Error al cargar datos del usuario');
      }
    }
  }, []);

  const features = [
    { icon: Film, text: 'Acceso a contenido Premium' },
    { icon: MessageCircle, text: 'Comentarios y comunidad' },
    { icon: Zap, text: 'Mejor calidad de video' },
    { icon: Crown, text: 'Beneficios exclusivos' },
  ];
  const isPremium = user?.subscriptionTier === 'premium';

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <section className="space-y-4 text-center">
        <h1 className="text-5xl font-black uppercase tracking-[0.2em] text-white">
          Planes de suscripcion
        </h1>
        <p className="text-xl text-gray-400">Elige el plan perfecto para ti</p>
      </section>

      {user && (
        <div className={`rounded-lg border p-6 text-center ${isPremium ? 'border-purple-400/60 bg-purple-950/40 shadow-2xl shadow-purple-950/30' : 'border-blue-500/30 bg-blue-950/20'}`}>
          <p className="mb-2 text-gray-300">Tu estado actual</p>
          <h2 className={`text-3xl font-black uppercase ${isPremium ? 'text-purple-200' : 'text-blue-400'}`}>
            {isPremium ? (
              <>
                <Crown className="mr-2 inline" size={32} fill="currentColor" />
                Cliente Premium
              </>
            ) : (
              'Cliente Basico'
            )}
          </h2>
          {isPremium && (
            <p className="mt-3 text-purple-100">
              Tu acceso Premium esta activo. Ya puedes ver contenido exclusivo y comentar.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-700/50 bg-red-950/50 p-4 text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6 rounded-lg border border-zinc-700 bg-zinc-950/80 p-8">
          <div>
            <h3 className="mb-2 text-2xl font-black uppercase text-white">Basico</h3>
            <p className="text-gray-400">Acceso limitado</p>
          </div>

          <div className="text-3xl font-black text-white">
            $0 <span className="text-lg text-gray-400">/mes</span>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Check size={20} className="text-green-500" />
              <span className="text-gray-300">Contenido gratuito</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={20} className="text-green-500" />
              <span className="text-gray-300">Calidad estandar</span>
            </li>
            <li className="flex items-center gap-3 opacity-40">
              <Check size={20} className="text-gray-600" />
              <span className="text-gray-500">Comentarios</span>
            </li>
            <li className="flex items-center gap-3 opacity-40">
              <Check size={20} className="text-gray-600" />
              <span className="text-gray-500">Contenido exclusivo</span>
            </li>
          </ul>

          {user?.subscriptionTier === 'free' || !user?.subscriptionTier ? (
            <p className="text-center font-semibold text-green-400">Plan actual</p>
          ) : (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-lg bg-zinc-800 px-6 py-3 font-semibold uppercase tracking-[0.1em] text-white opacity-50"
            >
              Cambiar a basico
            </button>
          )}
        </div>

        <div className="space-y-6 rounded-lg border border-purple-500/50 bg-gradient-to-br from-purple-950/80 to-purple-900/40 p-8 ring-2 ring-purple-500/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-2xl font-black uppercase text-white">
                <Crown size={28} fill="currentColor" />
                Premium
              </h3>
              <p className="text-purple-200">Acceso completo</p>
            </div>
            <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-black uppercase text-white">
              Recomendado
            </span>
          </div>

          <div className="text-3xl font-black text-purple-300">
            $0.25 <span className="text-lg text-purple-400">/mes</span>
          </div>

          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <feature.icon size={20} className="text-purple-400" />
                <span className="text-gray-200">{feature.text}</span>
              </li>
            ))}
          </ul>

          {isPremium ? (
            <div className="rounded-lg border border-purple-300/40 bg-purple-500/10 p-4 text-center">
              <p className="font-black uppercase tracking-[0.12em] text-purple-100">Cliente Premium activo</p>
              <p className="mt-1 text-sm text-purple-200">Gracias por ser parte del plan Premium.</p>
            </div>
          ) : (
            <Link
              to="/users/subscription/payment"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-purple-700"
            >
              <CreditCard size={20} />
              Pagar y activar Premium
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-3xl font-black uppercase text-white">Comparacion de planes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="px-4 py-3 font-semibold text-gray-400">Caracteristica</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-400">Basico</th>
                <th className="px-4 py-3 text-center font-semibold text-purple-400">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['Contenido gratuito', true, true],
                ['Contenido Premium', false, true],
                ['Comentarios', false, true],
                ['Soporte prioritario', false, true],
              ].map(([label, free, premium]) => (
                <tr key={label}>
                  <td className="px-4 py-3 text-gray-300">{label}</td>
                  <td className="px-4 py-3 text-center">
                    {free ? <Check size={20} className="mx-auto text-green-500" /> : <span className="text-red-500">X</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {premium ? <Check size={20} className="mx-auto text-green-500" /> : <span className="text-red-500">X</span>}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 text-gray-300">Calidad de video</td>
                <td className="px-4 py-3 text-center text-gray-400">HD</td>
                <td className="px-4 py-3 text-center text-purple-300">4K</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-black uppercase text-white">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {[
            {
              q: 'Puedo cambiar mi plan en cualquier momento?',
              a: 'Si, puedes cambiar o cancelar tu suscripcion en cualquier momento desde tu perfil.',
            },
            {
              q: 'Cuales son los metodos de pago?',
              a: 'Aceptamos tarjetas Visa y Mastercard para activar el acceso Premium.',
            },
          ].map(faq => (
            <div key={faq.q} className="rounded-lg border border-zinc-700 bg-zinc-950/50 p-4">
              <h3 className="mb-2 font-bold text-white">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="pb-8 text-center">
        <Link to="/users/profile" className="text-gray-400 transition hover:text-white">
          Volver al perfil
        </Link>
      </div>
    </div>
  );
};

export default Subscription;
