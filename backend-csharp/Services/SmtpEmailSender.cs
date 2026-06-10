using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend_csharp.Services
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SmtpEmailSender> _logger;

        public SmtpEmailSender(IConfiguration config, ILogger<SmtpEmailSender> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var smtpSection = _config.GetSection("Smtp");

            // Prefer structured config (Smtp:Host) but fallback to common env vars (SMTP_HOST, etc.)
            var host = smtpSection["Host"] ?? Environment.GetEnvironmentVariable("SMTP_HOST") ?? _config["SMTP_HOST"];

            int port = 587;
            var portCfg = smtpSection["Port"] ?? Environment.GetEnvironmentVariable("SMTP_PORT") ?? _config["SMTP_PORT"];
            if (!string.IsNullOrEmpty(portCfg) && int.TryParse(portCfg, out var p)) port = p;

            var username = smtpSection["Username"] ?? Environment.GetEnvironmentVariable("SMTP_USER") ?? Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? _config["SMTP_USER"] ?? _config["SMTP_USERNAME"];
            var password = smtpSection["Password"] ?? Environment.GetEnvironmentVariable("SMTP_PASS") ?? Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? _config["SMTP_PASS"] ?? _config["SMTP_PASSWORD"];
            var from = smtpSection["From"] ?? Environment.GetEnvironmentVariable("SMTP_FROM") ?? _config["SMTP_FROM"] ?? "no-reply@example.com";

            var useSsl = true;
            var useSslCfg = smtpSection.GetValue<string>("UseSsl") ?? Environment.GetEnvironmentVariable("SMTP_USESSL") ?? Environment.GetEnvironmentVariable("SMTP_SECURE") ?? _config["SMTP_USESSL"] ?? _config["SMTP_SECURE"];
            if (!string.IsNullOrEmpty(useSslCfg) && bool.TryParse(useSslCfg, out var ssl)) useSsl = ssl;

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(from));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlMessage };
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                _logger.LogInformation("Enviando email a {To} via SMTP {Host}:{Port} (user present: {HasUser})", toEmail, host, port, !string.IsNullOrEmpty(username));

                using var client = new SmtpClient();
                var socketOptions = useSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;
                await client.ConnectAsync(host, port, socketOptions);
                if (!string.IsNullOrEmpty(username))
                {
                    await client.AuthenticateAsync(username, password);
                }
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email enviado correctamente a {To}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enviando email a {To} via SMTP {Host}:{Port}", toEmail, host, port);
                throw;
            }
        }
    }
}
