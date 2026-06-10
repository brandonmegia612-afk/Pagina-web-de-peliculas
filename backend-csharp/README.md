Proyecto ASP.NET Core minimal con Identity para manejo de usuarios y recuperación de contraseña.

Instrucciones rápidas:

1. Instalar .NET SDK (6/7+).
2. Desde `backend-csharp` ejecutar:

```bash
dotnet restore
dotnet ef database update    # requiere dotnet-ef y tools
dotnet run
```

3. Configurar `appsettings.json` con `FrontendUrl` y datos de SMTP si deseas enviar correos reales.

SMTP / envío real
-----------------

Para enviar correos reales configura la sección `Smtp` en `appsettings.json` con los valores de tu proveedor:

```json
"Smtp": {
	"Host": "smtp.tu-provider.com",
	"Port": 587,
	"Username": "usuario@tu-dominio.com",
	"Password": "tu-contraseña-o-api-key",
	"From": "no-reply@tu-dominio.com",
	"UseSsl": true
}
```

El servicio `SmtpEmailSender` usa `MailKit` (paquete incluido) y maneja conexión segura y autenticación.

Consejos:
- Para SendGrid usa `smtp.sendgrid.net` como `Host` y `Username` = `apikey` y `Password` = tu API key.
- Para Gmail puede requerir contraseñas de aplicación o configuración de OAuth; no es recomendable almacenar credenciales en texto plano en producción.
- En producción guarda credenciales en variables de entorno o secretos del host (Azure Key Vault, AWS Secrets Manager, etc.).

Paquetes recomendados:
- Microsoft.AspNetCore.Identity.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.Sqlite
- Microsoft.EntityFrameworkCore.Tools

Este proyecto expone endpoints para solicitar reset de contraseña y aplicar el reset mediante el token enviado por email.

Migraciones EF Core
--------------------

Para crear la migración inicial y crear la base de datos SQLite sigue estos pasos desde la carpeta `backend-csharp`:

1. Ejecuta el script PowerShell:

```powershell
.\scripts\setup-db.ps1
```

2. Alternativamente, si prefieres comandos manuales:

```powershell
# Instalar dotnet-ef si no lo tienes
dotnet tool install --global dotnet-ef --version 7.0.0

# Restaurar paquetes
dotnet restore

# Crear migración
dotnet ef migrations add InitialCreate -o Data/Migrations

# Aplicar migración y crear la base de datos
dotnet ef database update
```

Si usas Linux/macOS, sustituye el script PowerShell por los comandos equivalentes en la terminal.

