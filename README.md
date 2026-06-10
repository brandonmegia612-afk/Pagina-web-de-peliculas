# Proyecto Web con Frontend y Backend

Aplicacion React para usuarios/admin y API Express con Sequelize.

## Estructura

- `frontend/mi-app`: frontend React, listo para Vercel.
- `backend`: API Express, lista para Railway.
- `vercel.json`: configuracion de build del frontend.
- `railway.json`: configuracion de build y start del backend.

## Desarrollo Local

Instala dependencias:

```bash
npm --prefix frontend/mi-app install
npm --prefix backend install
```

Ejecuta el backend:

```bash
npm --prefix backend start
```

Ejecuta el frontend:

```bash
npm --prefix frontend/mi-app run dev
```

Frontend local: `http://localhost:3000`
Backend local: `http://localhost:3001`

## Variables De Entorno

Backend Node en Railway:

- `DATABASE_URL`: URL de PostgreSQL.
- `NODE_ENV`: `production`.
- `ADMIN_EMAIL`: correo del administrador.
- `ADMIN_PASSWORD`: contrasena inicial del administrador.
- `SMTP_HOST`: servidor SMTP (ej. `smtp.gmail.com`).
- `SMTP_PORT`: puerto SMTP (ej. `587`).
- `SMTP_USER`: usuario SMTP.
- `SMTP_PASS`: contraseña SMTP o App Password.
- `SMTP_FROM`: dirección remitente (ej. correo SMTP).
- `SMTP_SECURE`: `true` para StartTLS en Gmail.

Backend .NET (`backend-csharp`) en Railway (solo si usas ese proyecto):

- `FrontendUrl`: URL pública del frontend en Vercel (ej. `https://tu-frontend.vercel.app`).
- `Smtp__Host`: servidor SMTP (ej. `smtp.gmail.com`).
- `Smtp__Port`: puerto SMTP (ej. `587`).
- `Smtp__Username`: usuario SMTP.
- `Smtp__Password`: contraseña SMTP o App Password.
- `Smtp__From`: dirección remitente.
- `Smtp__UseSsl`: `true` para StartTLS en Gmail.

Frontend en Vercel:

- `REACT_APP_API_URL`: URL publica del backend en Railway, por ejemplo `https://backend-production-4a02.up.railway.app`.

## Deploy

Vercel debe usar este repositorio con `vercel.json`; no cambies el output directory manualmente si usas esa configuracion.

Railway debe usar este repositorio con `railway.json`; agrega PostgreSQL y define las variables de entorno del backend.
