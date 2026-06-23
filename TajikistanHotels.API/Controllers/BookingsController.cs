using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TajikistanHotels.Application.Common.Interfaces;
using TajikistanHotels.Application.DTOs;
using TajikistanHotels.Domain.Entities;
using TajikistanHotels.Domain.Enums;

namespace TajikistanHotels.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public BookingsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<BookingDto>>> GetMyBookings()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var bookings = await _context.Bookings
            .Include(b => b.Hotel)
            .Where(b => b.UserId == userId)
            .ToListAsync();

        return Ok(bookings.Select(MapToDto).ToList());
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<BookingAdminDto>>> GetAllBookings()
    {
        var bookings = await _context.Bookings
            .Include(b => b.Hotel)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Ok(bookings.Select(b => new BookingAdminDto
        {
            Id = b.Id,
            HotelName = b.Hotel?.Name ?? "",
            GuestName = b.GuestName,
            GuestEmail = b.GuestEmail,
            CheckInDate = b.CheckInDate,
            CheckOutDate = b.CheckOutDate,
            GuestCount = b.GuestCount,
            TotalPrice = b.TotalPrice,
            Status = b.Status.ToString(),
            CreatedAt = b.CreatedAt
        }).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] CreateBookingRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var hotel = await _context.Hotels.FindAsync(request.HotelId);
        var room = await _context.Rooms.FindAsync(request.RoomId);

        if (hotel == null || room == null)
            return BadRequest("Invalid hotel or room");

        // PostgreSQL 'timestamp with time zone' requires UTC DateTimes.
        var checkIn = DateTime.SpecifyKind(request.CheckIn, DateTimeKind.Utc);
        var checkOut = DateTime.SpecifyKind(request.CheckOut, DateTimeKind.Utc);

        var nights = (checkOut - checkIn).Days;
        if (nights <= 0)
            return BadRequest("Check-out must be after check-in");

        var totalPrice = room.Price * nights;

        var booking = new Booking
        {
            HotelId = request.HotelId,
            RoomId = request.RoomId,
            UserId = userId,
            CheckInDate = checkIn,
            CheckOutDate = checkOut,
            GuestCount = request.Guests,
            TotalPrice = totalPrice,
            GuestName = request.GuestName,
            GuestEmail = request.GuestEmail,
            GuestPhone = request.GuestPhone,
            SpecialRequests = request.SpecialRequests,
            Status = BookingStatus.Confirmed
        };

        _context.Bookings.Add(booking);
        room.AvailableCount--;
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateBooking), MapToDto(booking));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> CancelBooking(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var booking = await _context.Bookings.Include(b => b.Room).FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null || booking.UserId != userId)
            return NotFound();

        booking.Status = BookingStatus.Cancelled;
        if (booking.Room != null)
            booking.Room.AvailableCount++;

        await _context.SaveChangesAsync();
        return Ok();
    }

    private static BookingDto MapToDto(Booking booking)
    {
        return new BookingDto
        {
            Id = booking.Id,
            HotelId = booking.HotelId,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            GuestCount = booking.GuestCount,
            TotalPrice = booking.TotalPrice,
            Status = booking.Status.ToString(),
            HotelName = booking.Hotel?.Name ?? "",
            CreatedAt = booking.CreatedAt
        };
    }
}
