import React from 'react';

const ProfileCard = ({ user }) => {
  const initials = (user.name || 'Usuario')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const fields = [
    { label: 'Nombre', value: user.name || 'No disponible' },
    { label: 'Email', value: user.email || 'No disponible' },
    { label: 'Telefono', value: user.phone || 'No disponible' },
    { label: 'Fecha de nacimiento', value: user.dateOfBirth || 'No disponible' },
    { label: 'Tipo de cuenta', value: user.role === 'admin' ? 'Administrador' : 'Usuario normal' },
    { label: 'Verificado', value: user.verified ? 'Si' : 'No' },
  ];

  return (
    <div className="rounded-[2rem] border border-red-700/60 bg-black/80 p-8 shadow-2xl shadow-black/70">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-red-600 bg-red-950 text-4xl font-black text-red-100 shadow-inner shadow-red-900/50">
          {initials}
        </div>
        <div>
          <h2 className="text-4xl font-black uppercase tracking-[0.2em] text-white">{user.name || 'Usuario'}</h2>
          <p className="mt-2 text-lg text-red-300">Datos personales</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {fields.map(field => (
          <div key={field.label} className="rounded-3xl bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-red-300">{field.label}</p>
            <p className="mt-3 break-words text-lg text-gray-100">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
