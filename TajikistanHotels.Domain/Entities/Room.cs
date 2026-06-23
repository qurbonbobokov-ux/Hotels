namespace TajikistanHotels.Domain.Entities;

public class Room
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HotelId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; } = 1;
    public int Count { get; set; } = 1;
    public int AvailableCount { get; set; } = 1;
    public decimal Price { get; set; } = 0;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Hotel? Hotel { get; set; }
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
