using TajikistanHotels.Domain.Enums;

namespace TajikistanHotels.Domain.Entities;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HotelId { get; set; }
    public Guid RoomId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int GuestCount { get; set; }
    public decimal TotalPrice { get; set; } = 0;
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public string GuestPhone { get; set; } = string.Empty;
    public string? SpecialRequests { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Hotel? Hotel { get; set; }
    public virtual Room? Room { get; set; }
    public virtual User? User { get; set; }
}
