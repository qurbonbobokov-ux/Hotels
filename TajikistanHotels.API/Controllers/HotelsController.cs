using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TajikistanHotels.Application.Common.Interfaces;
using TajikistanHotels.Application.DTOs;
using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public HotelsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<HotelDto>>> GetHotels([FromQuery] string? city, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
    {
        var query = _context.Hotels.Include(h => h.Rooms).Where(h => h.IsActive);

        if (!string.IsNullOrEmpty(city))
            query = query.Where(h => h.City.ToLower().Contains(city.ToLower()));

        if (minPrice.HasValue)
            query = query.Where(h => h.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(h => h.Price <= maxPrice.Value);

        var hotels = await query.ToListAsync();
        return Ok(hotels.Select(MapToDto).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HotelDto>> GetHotel(Guid id)
    {
        var hotel = await _context.Hotels
            .Include(h => h.Rooms)
            .FirstOrDefaultAsync(h => h.Id == id && h.IsActive);

        if (hotel == null)
            return NotFound();

        return Ok(MapToDto(hotel));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HotelDto>> CreateHotel([FromBody] CreateHotelRequest request)
    {
        var hotel = new Hotel
        {
            Name = request.Name,
            Description = request.Description,
            City = request.City,
            Address = request.Address,
            Phone = request.Phone,
            Email = request.Email,
            Price = request.Price,
            ImageUrl = request.ImageUrl
        };

        _context.Hotels.Add(hotel);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetHotel), new { id = hotel.Id }, MapToDto(hotel));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HotelDto>> UpdateHotel(Guid id, [FromBody] CreateHotelRequest request)
    {
        var hotel = await _context.Hotels.Include(h => h.Rooms).FirstOrDefaultAsync(h => h.Id == id);
        if (hotel == null)
            return NotFound();

        hotel.Name = request.Name;
        hotel.Description = request.Description;
        hotel.City = request.City;
        hotel.Address = request.Address;
        hotel.Phone = request.Phone;
        hotel.Email = request.Email;
        hotel.Price = request.Price;
        if (!string.IsNullOrWhiteSpace(request.ImageUrl))
            hotel.ImageUrl = request.ImageUrl;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(hotel));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteHotel(Guid id)
    {
        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null)
            return NotFound();

        try
        {
            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // Hotel has existing bookings (FK restrict) — deactivate instead of hard delete.
            hotel.IsActive = false;
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
