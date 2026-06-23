using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TajikistanHotels.Application.Common.Interfaces;
using TajikistanHotels.Application.DTOs;
using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public FavoritesController(IApplicationDbContext context)
    {
        _context = context;
    }

    // The full hotels a user has favorited (for the Favorites page).
    [HttpGet]
    public async Task<ActionResult<List<HotelDto>>> GetFavorites()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var hotels = await _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.Hotel)
            .ThenInclude(h => h!.Rooms)
            .Select(f => f.Hotel!)
            .ToListAsync();

        return Ok(hotels.Select(MapToDto).ToList());
    }

    // Just the favorited hotel ids (for heart-button state across the app).
    [HttpGet("ids")]
    public async Task<ActionResult<List<Guid>>> GetFavoriteIds()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var ids = await _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.HotelId)
            .ToListAsync();

        return Ok(ids);
    }

    [HttpPost("{hotelId}")]
    public async Task<ActionResult> AddFavorite(Guid hotelId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var exists = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.HotelId == hotelId);

        if (!exists)
        {
            _context.Favorites.Add(new Favorite { UserId = userId, HotelId = hotelId });
            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpDelete("{hotelId}")]
    public async Task<ActionResult> RemoveFavorite(Guid hotelId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.HotelId == hotelId);

        if (favorite != null)
        {
            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    private static HotelDto MapToDto(Hotel hotel)
    {
        return new HotelDto
        {
            Id = hotel.Id,
            Name = hotel.Name,
            Description = hotel.Description,
            City = hotel.City,
            Address = hotel.Address,
            Rating = hotel.Rating,
            Price = hotel.Price,
            ImageUrl = hotel.ImageUrl,
            Images = new List<string> { hotel.ImageUrl },
            Amenities = new List<string> { "Free WiFi", "Free breakfast", "24/7 support" },
            Rooms = hotel.Rooms.Select(r => new RoomDto
            {
                Id = r.Id,
                Type = r.Type,
                Capacity = r.Capacity,
                Price = r.Price,
                Available = r.AvailableCount > 0
            }).ToList()
        };
    }
}
