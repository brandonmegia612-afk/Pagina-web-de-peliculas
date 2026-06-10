using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend_csharp.Data;
using backend_csharp.Models;
using backend_csharp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers();
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<PasswordResetService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Aplicar migraciones automáticamente
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

app.Run();

// Seed usuario de prueba (solo en desarrollo)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var env = services.GetRequiredService<IHostEnvironment>();
    if (env.IsDevelopment())
    {
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = services.GetRequiredService<ILogger<Program>>();
        var testEmail = "test@local";
        var user = await userManager.FindByEmailAsync(testEmail);
        if (user == null)
        {
            var newUser = new ApplicationUser { UserName = testEmail, Email = testEmail, EmailConfirmed = true };
            var res = await userManager.CreateAsync(newUser, "P@ssw0rd1");
            if (!res.Succeeded)
            {
                logger.LogWarning("No se pudo crear usuario de prueba: {0}", string.Join(',', res.Errors.Select(e => e.Description)));
            }
            else
            {
                logger.LogInformation("Usuario de prueba creado: {0}", testEmail);
            }
        }
    }
}
