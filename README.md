# Proyecto Web con Frontend y Backend

## Estructura
- frontend/: Aplicación React con páginas para admin y usuarios.
- backend/: API con Express y Sequelize para PostgreSQL.

## Instalación y Ejecución

1. Instalar Docker y Docker Compose.

2. En la raíz del proyecto, ejecutar:
   ```
   docker-compose up --build
   ```

3. Para el frontend, en otra terminal:
   ```
   cd frontend/mi-app
   npm start
   ```

## Rutas
- /admin: Panel de administrador (Dashboard, Gestionar Correos, Gestionar Usuarios)
- /users: Páginas de usuarios (Inicio, Perfil)

La API está en http://localhost:3001