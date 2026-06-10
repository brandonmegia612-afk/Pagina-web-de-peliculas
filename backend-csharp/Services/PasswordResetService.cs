using backend_csharp.Data;
using backend_csharp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Services
{
    public class PasswordResetService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _db;

        public PasswordResetService(UserManager<ApplicationUser> userManager, IEmailSender emailSender, IConfiguration config, ApplicationDbContext db)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _config = config;
            _db = db;
        }

        // Crea un token público (GUID) y un código de 6 dígitos, además de un token de Identity
        // Guarda en la BD y envía el código/enlace por email. Devuelve el token público para desarrollo.
        public async Task<string?> CreateResetRequestAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return null; // no revelar existencia

            var identityToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var publicToken = Guid.NewGuid().ToString();
            var code = new Random().Next(100000, 999999).ToString();

            var entry = new PasswordResetToken
            {
                UserId = user.Id,
                Code = code,
                Token = publicToken,
                IdentityToken = identityToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                Verified = false
            };

            _db.PasswordResetTokens.Add(entry);
            await _db.SaveChangesAsync();

            var frontend = _config["FrontendUrl"] ?? "http://localhost:3000";
            var link = $"{frontend}/users/cambiar-contrasena?token={Uri.EscapeDataString(publicToken)}";
            var html = $"<p>Tu codigo es: <strong>{code}</strong></p><p>O haces click <a href=\"{link}\">aqui</a> para restablecer tu contraseña.</p>";

            await _emailSender.SendEmailAsync(user.Email, "Código para restaurar contraseña", html);

            // En desarrollo devolvemos el token público (para que el frontend muestre el resetToken)
            return publicToken;
        }

        public async Task<bool> VerifyCodeAsync(string publicToken, string code)
        {
            var entry = await _db.PasswordResetTokens.FirstOrDefaultAsync(e => e.Token == publicToken && e.ExpiresAt > DateTime.UtcNow);
            if (entry == null) return false;
            if (entry.Code != code) return false;
            entry.Verified = true;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<IdentityResult> ResetPasswordWithPublicTokenAsync(string publicToken, string newPassword)
        {
            var entry = await _db.PasswordResetTokens.FirstOrDefaultAsync(e => e.Token == publicToken && e.ExpiresAt > DateTime.UtcNow && e.Verified == true);
            if (entry == null) return IdentityResult.Failed(new IdentityError { Description = "Token invalido o no verificado" });

            var user = await _userManager.FindByIdAsync(entry.UserId);
            if (user == null) return IdentityResult.Failed(new IdentityError { Description = "Usuario no encontrado" });

            var result = await _userManager.ResetPasswordAsync(user, entry.IdentityToken, newPassword);

            // Eliminar todos los tokens antiguos para el usuario
            var tokens = _db.PasswordResetTokens.Where(t => t.UserId == entry.UserId);
            _db.PasswordResetTokens.RemoveRange(tokens);
            await _db.SaveChangesAsync();

            return result;
        }
    }
}
