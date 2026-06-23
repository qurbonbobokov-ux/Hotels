namespace TajikistanHotels.Application.DTOs;

public class BookingDto
{
    public Guid Id { get; set; }
    public Guid HotelId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int GuestCount { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public string HotelName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

// Admin view: every booking with guest + hotel details.
public class BookingAdminDto
{
    public Guid Id { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int GuestCount { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateBookingRequest
{
    public Guid HotelId { get; set; }
    public Guid RoomId { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int Guests { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public string GuestPhone { get; set; } = string.Empty;
    public string? SpecialRequests { get; set; }
}
