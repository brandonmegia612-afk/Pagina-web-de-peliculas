using backend_csharp.Models;
using backend_csharp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AccountController : ControllerBase
    {
        private readonly PasswordResetService _resetService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly backend_csharp.Data.ApplicationDbContext _db;
        private readonly IWebHostEnvironment _env;

        public AccountController(PasswordResetService resetService, UserManager<ApplicationUser> userManager, backend_csharp.Data.ApplicationDbContext db, IWebHostEnvironment env)
        {
            _resetService = resetService;
            _userManager = userManager;
            _db = db;
            _env = env;
        }

        // Endpoint compatible con el frontend: /api/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] RequestResetDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email)) return BadRequest();
            var token = await _resetService.CreateResetRequestAsync(dto.Email);
            // No revelar existencia; en desarrollo devolvemos token (y codigo) para facilitar pruebas
            if (!string.IsNullOrEmpty(token) && _env.IsDevelopment())
            {
                var entry = await _db.PasswordResetTokens.FirstOrDefaultAsync(t => t.Token == token);
                if (entry != null)
                {
                    return Ok(new { message = "Si existe el correo, recibirá instrucciones.", resetToken = token, code = entry.Code });
                }
            }
            return Ok(new { message = "Si existe el correo, recibirá instrucciones.", resetToken = token });
        }

        // Verifica el codigo de 6 digitos: /api/verify-email-code
        [HttpPost("verify-email-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ResetToken) || string.IsNullOrWhiteSpace(dto.Code)) return BadRequest();
            var ok = await _resetService.VerifyCodeAsync(dto.ResetToken, dto.Code);
            if (ok) return Ok(new { message = "Codigo verificado" });
            return BadRequest(new { message = "Codigo incorrecto o expirado" });
        }

        // Endpoint compatible con frontend para reset final: /api/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword)) return BadRequest();
            var result = await _resetService.ResetPasswordWithPublicTokenAsync(dto.Token, dto.NewPassword);
            if (result.Succeeded) return Ok(new { message = "Contrasena actualizada" });
            return BadRequest(result.Errors.Select(e => e.Description));
        }
    }

    public record RequestResetDto(string Email);
    public record VerifyCodeDto(string ResetToken, string Code);
    public record ResetPasswordDto(string Token, string NewPassword);
}
