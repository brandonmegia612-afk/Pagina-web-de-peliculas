namespace backend_csharp.Models
{
    public class PasswordResetToken
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        // Código de 6 dígitos enviado por email (para desarrollo). En producción guardar hashed.
        public string Code { get; set; } = string.Empty;
        // Token público corto usado en la URL (por ejemplo GUID)
        public string Token { get; set; } = string.Empty;
        // Token generado por Identity para ResetPasswordAsync (puede contener caracteres especiales)
        public string IdentityToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool Verified { get; set; } = false;
    }
}
