namespace TajikistanHotels.Application.DTOs;

public class HotelDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    public List<string> Amenities { get; set; } = new();
    public List<RoomDto> Rooms { get; set; } = new();
}

public class RoomDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public decimal Price { get; set; }
    public bool Available { get; set; }
}

public class CreateHotelRequest
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
