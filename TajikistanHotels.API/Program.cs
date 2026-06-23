using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using TajikistanHotels.Application;
using TajikistanHotels.Domain.Entities;
using TajikistanHotels.Infrastructure;
using TajikistanHotels.Infrastructure.Identity;
using TajikistanHotels.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Presentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger / OpenAPI with JWT bearer support
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TajikistanHotels API",
        Version = "v1",
        Description = "Hotel search & booking platform API (Clean Architecture)."
    });

    var jwtScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste the JWT token returned by /api/auth/login (no 'Bearer ' prefix needed).",
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    };
    options.AddSecurityDefinition("Bearer", jwtScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { [jwtScheme] = Array.Empty<string>() });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Clean Architecture layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Swagger UI available at /swagger
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "TajikistanHotels API v1");
    options.DocumentTitle = "TajikistanHotels API — Swagger";
});

// Serve uploaded images from wwwroot/uploads (explicit provider so it works
// even when WebRootPath is unset because wwwroot didn't exist at startup).
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new Microsoft.AspNetCore.Builder.StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new { message = "TajikistanHotels API running!", docs = "/swagger", hotels = "/api/hotels" }));
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

// Create database and seed sample data
using (var scope = app.Services.CreateScope())
{
    var sp = scope.ServiceProvider;
    var db = sp.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
    DbInitializer.Initialize(db);

    var userManager = sp.GetRequiredService<UserManager<User>>();
    var roleManager = sp.GetRequiredService<RoleManager<IdentityRole>>();
    await IdentitySeeder.SeedAsync(userManager, roleManager);
}

// Run on port 5050 (port 5000 is used by macOS AirPlay Receiver / ControlCenter)
app.Run("http://localhost:5050");
