using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend_csharp.Models;

namespace backend_csharp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        // Tabla para tokens/códigos de reseteo (flujo de 6 dígitos + token público)
        public DbSet<backend_csharp.Models.PasswordResetToken> PasswordResetTokens { get; set; }
    }
}
