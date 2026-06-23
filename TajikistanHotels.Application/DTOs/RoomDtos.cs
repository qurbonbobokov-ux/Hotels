namespace TajikistanHotels.Application.DTOs;

// Full room shape for the admin panel (more detail than the public RoomDto).
public class RoomAdminDto
{
    public Guid Id { get; set; }
    public Guid HotelId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int Count { get; set; }
    public int AvailableCount { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class SaveRoomRequest
{
    public Guid HotelId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; } = 1;
    public int Count { get; set; } = 1;
    public int AvailableCount { get; set; } = 1;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
}
