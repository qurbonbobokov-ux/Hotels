namespace TajikistanHotels.Application.DTOs;

public class ReviewDto
{
    public Guid Id { get; set; }
    public Guid HotelId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewRequest
{
    public Guid HotelId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}

// A user's own review, with the hotel name for display.
public class MyReviewDto
{
    public Guid Id { get; set; }
    public Guid HotelId { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
