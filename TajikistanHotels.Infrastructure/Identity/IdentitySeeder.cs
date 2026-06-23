using Microsoft.AspNetCore.Identity;
using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.Infrastructure.Identity;

public static class IdentitySeeder
{
    public const string AdminEmail = "admin@tajikistanhotels.tj";
    public const string AdminPassword = "Admin@123";

    public static async Task SeedAsync(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        foreach (var role in new[] { "Admin", "User" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        var admin = await userManager.FindByEmailAsync(AdminEmail);
        if (admin == null)
        {
            admin = new User
            {
                Email = AdminEmail,
                UserName = AdminEmail,
                FullName = "Platform Admin",
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(admin, AdminPassword);
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }
        else if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}
