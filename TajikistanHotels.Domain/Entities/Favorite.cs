namespace TajikistanHotels.Domain.Entities;

public class Favorite
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;
    public Guid HotelId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User? User { get; set; }
    public virtual Hotel? Hotel { get; set; }
}
