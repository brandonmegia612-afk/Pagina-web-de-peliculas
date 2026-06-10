Prueba E2E (curl / PowerShell)
================================

Estas instrucciones prueban el flujo completo localmente: `forgot-password` -> `verify-email-code` -> `reset-password`.

Usando curl (ignora certificados con `-k` si usas https local):

1) Solicitar reset y obtener `resetToken` y `code` (en entorno de desarrollo):

```bash
curl -k -X POST "https://localhost:5001/api/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@local"}'

# Respuesta JSON esperada (dev): { "message": "...", "resetToken": "<token>", "code": "123456" }
```

2) Verificar el código (6 dígitos):

```bash
curl -k -X POST "https://localhost:5001/api/verify-email-code" \
  -H "Content-Type: application/json" \
  -d '{"resetToken":"<token>","code":"123456"}'
```

3) Restablecer la contraseña usando el token público:

```bash
curl -k -X POST "https://localhost:5001/api/reset-password" \
  -H "Content-Type: application/json" \
  -d '{"token":"<token>","newPassword":"NuevaP@ssw0rd1"}'
```

PowerShell (ejemplo, adapta el prefijo de certificado si es necesario):

```powershell
# Base URL
$base = 'https://localhost:5001'
# Email de prueba
$email = 'test@local'

# Solicitar reset
$resp = Invoke-RestMethod -Method Post -Uri "$base/api/forgot-password" -Body (@{email=$email} | ConvertTo-Json) -ContentType 'application/json'
Write-Host "ResetToken: $($resp.resetToken)  Code: $($resp.code)"

# Verificar codigo
Invoke-RestMethod -Method Post -Uri "$base/api/verify-email-code" -Body (@{resetToken=$resp.resetToken; code=$resp.code} | ConvertTo-Json) -ContentType 'application/json'

# Aplicar nuevo password
Invoke-RestMethod -Method Post -Uri "$base/api/reset-password" -Body (@{token=$resp.resetToken; newPassword='NuevaP@ssw0rd1'} | ConvertTo-Json) -ContentType 'application/json'
```

Notas:
- Ajusta el puerto (`5001`) según el que muestre `dotnet run`.
- En producción el endpoint no devolverá el `code`; este comportamiento sólo existe en `Development` para facilitar pruebas.
