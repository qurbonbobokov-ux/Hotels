using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TajikistanHotels.Application.DTOs;
using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public UsersController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserListDto>>> GetUsers()
    {
        var users = _userManager.Users.OrderBy(u => u.FullName).ToList();
        var result = new List<UserListDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new UserListDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? "",
                Role = roles.FirstOrDefault() ?? "User",
                CreatedAt = user.CreatedAt
            });
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound();

        // Don't allow deleting admin accounts.
        if (await _userManager.IsInRoleAsync(user, "Admin"))
            return BadRequest("Cannot delete an admin account.");

        await _userManager.DeleteAsync(user);
        return Ok();
    }
}
