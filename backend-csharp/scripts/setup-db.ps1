<#
Script para crear migraciones y aplicar la base de datos SQLite.
Ejecutar desde la carpeta `backend-csharp` en PowerShell:

    .\scripts\setup-db.ps1

Notas:
- Si no tiene `dotnet-ef`, el script intenta instalarlo globalmente.
#>

Write-Host "Comprobando dotnet-ef..."
if (-not (Get-Command dotnet-ef -ErrorAction SilentlyContinue)) {
    Write-Host "dotnet-ef no encontrado: instalando como herramienta global (puede requerir permisos)"
    dotnet tool install --global dotnet-ef --version 8.0.0
}

Write-Host "Restaurando paquetes..."
dotnet restore

Write-Host "Creando migración inicial..."
dotnet ef migrations add InitialCreate -o Data/Migrations

Write-Host "Aplicando migraciones a la base de datos..."
dotnet ef database update

Write-Host "Listo. La base de datos SQLite 'identity.db' debería existir en la carpeta del proyecto."
