namespace TajikistanHotels.Admin.Models;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public AuthUser User { get; set; } = new();
    public string Token { get; set; } = string.Empty;
}

public class AuthUser
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class HotelModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class SaveHotelRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class RoomModel
{
    public Guid Id { get; set; }
    public Guid HotelId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; } = 1;
    public int Count { get; set; } = 1;
    public int AvailableCount { get; set; } = 1;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class BookingModel
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

public class UserModel
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
