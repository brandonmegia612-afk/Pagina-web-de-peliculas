using backend_csharp.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers
{
    [ApiController]
    [Route("api")]
    public class EmailTestController : ControllerBase
    {
        private readonly IEmailSender _emailSender;

        public EmailTestController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        [HttpPost("send-test-email")]
        public async Task<IActionResult> SendTest([FromBody] TestEmailDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.To)) return BadRequest(new { message = "Correo destino requerido" });
            var subject = dto.Subject ?? "Prueba de envío";
            var body = dto.Body ?? "<p>Correo de prueba desde la API.</p>";
            try
            {
                await _emailSender.SendEmailAsync(dto.To, subject, body);
                return Ok(new { message = "Correo enviado (si SMTP configurado)" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error enviando correo", detail = ex.Message });
            }
        }
    }

    public record TestEmailDto(string To, string? Subject, string? Body);
}
