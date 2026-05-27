import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Crown, Film, MessageCircle, Zap } from 'lucide-react';

const Subscription = () => {
  const [user, setUser] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
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

  const handleUpgrade = async () => {
    setUpgrading(true);
    setError('');

    try {
      // Aquí irían las integraciones de pago (Stripe, PayPal, etc.)
      // Por ahora, mostramos un mensaje de próxima implementación
      alert('Sistema de pago en desarrollo. Contacta al administrador para más información.');
    } catch (err) {
      setError('Error al procesar la suscripción');
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  const features = [
    { icon: Film, text: 'Acceso a contenido Premium' },
    { icon: MessageCircle, text: 'Comentarios y comunidad' },
    { icon: Zap, text: 'Mejor calidad de video' },
    { icon: Crown, text: 'Beneficios exclusivos' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-black uppercase tracking-[0.2em] text-white">
          Planes de suscripción
        </h1>
        <p className="text-xl text-gray-400">
          Elige el plan perfecto para ti
        </p>
      </section>

      {/* Current Status */}
      {user && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-950/20 p-6 text-center">
          <p className="text-gray-300 mb-2">Tu plan actual</p>
          <h2 className="text-3xl font-black uppercase text-blue-400">
            {user.subscriptionTier === 'premium' ? (
              <>
                <Crown className="inline mr-2" size={32} fill="currentColor" />
                Premium
              </>
            ) : (
              'Básico Gratuito'
            )}
          </h2>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-950/50 border border-red-700/50 p-4 text-red-200">
          {error}
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-950/80 p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-black uppercase text-white mb-2">Básico</h3>
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
              <span className="text-gray-300">Calidad estándar</span>
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

          {user?.subscriptionTier === 'free' ? (
            <p className="text-center text-green-400 font-semibold">Plan actual</p>
          ) : (
            <button
              disabled={true}
              className="w-full rounded-lg bg-zinc-800 px-6 py-3 font-semibold text-white uppercase tracking-[0.1em] opacity-50 cursor-not-allowed"
            >
              Cambiar a básico
            </button>
          )}
        </div>

        {/* Premium Plan */}
        <div className="rounded-lg border border-purple-500/50 bg-gradient-to-br from-purple-950/80 to-purple-900/40 p-8 space-y-6 ring-2 ring-purple-500/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-black uppercase text-white mb-2 flex items-center gap-2">
                <Crown size={28} fill="currentColor" />
                Premium
              </h3>
              <p className="text-purple-200">Acceso completo</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-black uppercase">
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

          {user?.subscriptionTier === 'premium' ? (
            <p className="text-center text-purple-300 font-semibold">Plan actual</p>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white uppercase tracking-[0.1em] transition hover:bg-purple-700 disabled:opacity-50"
            >
              {upgrading ? 'Procesando...' : 'Actualizar a Premium'}
            </button>
          )}
        </div>
      </div>

      {/* Features Comparison */}
      <section className="space-y-6">
        <h2 className="text-3xl font-black uppercase text-white">Comparación de planes</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="px-4 py-3 text-gray-400 font-semibold">Característica</th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold">Básico</th>
                <th className="px-4 py-3 text-center text-purple-400 font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr>
                <td className="px-4 py-3 text-gray-300">Contenido gratuito</td>
                <td className="px-4 py-3 text-center">
                  <Check size={20} className="text-green-500 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check size={20} className="text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-300">Contenido Premium</td>
                <td className="px-4 py-3 text-center text-red-500">✕</td>
                <td className="px-4 py-3 text-center">
                  <Check size={20} className="text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-300">Comentarios</td>
                <td className="px-4 py-3 text-center text-red-500">✕</td>
                <td className="px-4 py-3 text-center">
                  <Check size={20} className="text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-300">Calidad de video</td>
                <td className="px-4 py-3 text-center text-gray-400">HD</td>
                <td className="px-4 py-3 text-center text-purple-300">4K</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-300">Soporte prioritario</td>
                <td className="px-4 py-3 text-center text-red-500">✕</td>
                <td className="px-4 py-3 text-center">
                  <Check size={20} className="text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-3xl font-black uppercase text-white">Preguntas frecuentes</h2>

        <div className="space-y-3">
          {[
            {
              q: '¿Puedo cambiar mi plan en cualquier momento?',
              a: 'Sí, puedes cambiar o cancelar tu suscripción en cualquier momento desde tu perfil.',
            },
            {
              q: '¿Hay período de prueba?',
              a: 'Contacta al administrador para información sobre períodos de prueba disponibles.',
            },
            {
              q: '¿Cuáles son los métodos de pago?',
              a: 'Aceptamos tarjetas de crédito, débito y billeteras digitales. Más opciones próximamente.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="rounded-lg border border-zinc-700 bg-zinc-950/50 p-4">
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-lg border border-red-700/30 bg-red-950/20 p-8 text-center space-y-4">
        <h2 className="text-2xl font-black uppercase text-white">¿Necesitas ayuda?</h2>
        <p className="text-gray-300 mb-4">
          Contacta a nuestro equipo de soporte para resolver tus dudas sobre suscripciones.
        </p>
        <a
          href="mailto:soporte@ejemplo.com"
          className="inline-block rounded-lg bg-red-700 px-8 py-3 font-semibold text-white uppercase tracking-[0.1em] transition hover:bg-red-600"
        >
          Contactar soporte
        </a>
      </div>

      <div className="text-center pb-8">
        <Link
          to="/users/profile"
          className="text-gray-400 hover:text-white transition"
        >
          Volver al perfil
        </Link>
      </div>
    </div>
  );
};

export default Subscription;
