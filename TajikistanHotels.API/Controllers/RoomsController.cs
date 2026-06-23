using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TajikistanHotels.Application.Common.Interfaces;
using TajikistanHotels.Application.DTOs;
using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public RoomsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("hotel/{hotelId}")]
    public async Task<ActionResult<List<RoomAdminDto>>> GetRoomsByHotel(Guid hotelId)
    {
        var rooms = await _context.Rooms
            .Where(r => r.HotelId == hotelId)
            .ToListAsync();

        return Ok(rooms.Select(MapToDto).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoomAdminDto>> GetRoom(Guid id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null)
            return NotFound();

        return Ok(MapToDto(room));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RoomAdminDto>> CreateRoom([FromBody] SaveRoomRequest request)
    {
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == request.HotelId);
        if (!hotelExists)
            return BadRequest("Hotel not found");

        var room = new Room
        {
            HotelId = request.HotelId,
            Type = request.Type,
            Capacity = request.Capacity,
            Count = request.Count,
            AvailableCount = request.AvailableCount,
            Price = request.Price,
            Description = request.Description
        };

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, MapToDto(room));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RoomAdminDto>> UpdateRoom(Guid id, [FromBody] SaveRoomRequest request)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null)
            return NotFound();

        room.Type = request.Type;
        room.Capacity = request.Capacity;
        room.Count = request.Count;
        room.AvailableCount = request.AvailableCount;
        room.Price = request.Price;
        room.Description = request.Description;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(room));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteRoom(Guid id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null)
            return NotFound();

        try
        {
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("Cannot delete a room that has bookings.");
        }

        return Ok();
    }

    private static RoomAdminDto MapToDto(Room room)
    {
        return new RoomAdminDto
        {
            Id = room.Id,
            HotelId = room.HotelId,
            Type = room.Type,
            Capacity = room.Capacity,
            Count = room.Count,
            AvailableCount = room.AvailableCount,
            Price = room.Price,
            Description = room.Description
        };
    }
}
