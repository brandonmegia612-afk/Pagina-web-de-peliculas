import React from 'react';

const COUNTRIES = [
  { code: 'AR', name: 'Argentina', phoneCode: '+54' },
  { code: 'BO', name: 'Bolivia', phoneCode: '+591' },
  { code: 'BR', name: 'Brasil', phoneCode: '+55' },
  { code: 'CL', name: 'Chile', phoneCode: '+56' },
  { code: 'CO', name: 'Colombia', phoneCode: '+57' },
  { code: 'CR', name: 'Costa Rica', phoneCode: '+506' },
  { code: 'CU', name: 'Cuba', phoneCode: '+53' },
  { code: 'DO', name: 'República Dominicana', phoneCode: '+1-809' },
  { code: 'EC', name: 'Ecuador', phoneCode: '+593' },
  { code: 'SV', name: 'El Salvador', phoneCode: '+503' },
  { code: 'ES', name: 'España', phoneCode: '+34' },
  { code: 'GT', name: 'Guatemala', phoneCode: '+502' },
  { code: 'HN', name: 'Honduras', phoneCode: '+504' },
  { code: 'MX', name: 'México', phoneCode: '+52' },
  { code: 'NI', name: 'Nicaragua', phoneCode: '+505' },
  { code: 'PA', name: 'Panamá', phoneCode: '+507' },
  { code: 'PY', name: 'Paraguay', phoneCode: '+595' },
  { code: 'PE', name: 'Perú', phoneCode: '+51' },
  { code: 'PT', name: 'Portugal', phoneCode: '+351' },
  { code: 'PR', name: 'Puerto Rico', phoneCode: '+1-787' },
  { code: 'UY', name: 'Uruguay', phoneCode: '+598' },
  { code: 'VE', name: 'Venezuela', phoneCode: '+58' },
  { code: 'US', name: 'Estados Unidos', phoneCode: '+1' },
  { code: 'CA', name: 'Canadá', phoneCode: '+1' },
  { code: 'FR', name: 'Francia', phoneCode: '+33' },
  { code: 'DE', name: 'Alemania', phoneCode: '+49' },
  { code: 'IT', name: 'Italia', phoneCode: '+39' },
  { code: 'GB', name: 'Reino Unido', phoneCode: '+44' },
];

const CountrySelector = ({ value, onChange, label = 'País', required = false, className = '' }) => {
  const selectedCountry = COUNTRIES.find(c => c.code === value);
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm uppercase tracking-[0.2em] text-red-200">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="mt-3 flex rounded-3xl border border-gray-700 bg-gray-900 focus-within:border-red-500">
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-3xl bg-transparent px-4 py-3 text-lg text-white focus:outline-none appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
          required={required}
        >
          <option value="">Selecciona tu país...</option>
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.name} ({country.phoneCode})
            </option>
          ))}
        </select>
      </div>
      {selectedCountry && (
        <p className="mt-2 text-xs text-gray-400">
          Código de país: {selectedCountry.phoneCode}
        </p>
      )}
    </div>
  );
};

export default CountrySelector;
export { COUNTRIES };
