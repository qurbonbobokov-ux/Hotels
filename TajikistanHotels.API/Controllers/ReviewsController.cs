using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TajikistanHotels.Application.Common.Interfaces;
using TajikistanHotels.Application.DTOs;
using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public ReviewsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("hotel/{hotelId}")]
    public async Task<ActionResult<List<ReviewDto>>> GetReviewsByHotel(Guid hotelId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.HotelId == hotelId)
            .ToListAsync();

        return Ok(reviews.Select(MapToDto).ToList());
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<List<MyReviewDto>>> GetMyReviews()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var reviews = await _context.Reviews
            .Include(r => r.Hotel)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(reviews.Select(r => new MyReviewDto
        {
            Id = r.Id,
            HotelId = r.HotelId,
            HotelName = r.Hotel?.Name ?? "",
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        }).ToList());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("User not found");

        var review = new Review
        {
            HotelId = request.HotelId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        // Attach user so the response carries the author name.
        review.User = user;
        return CreatedAtAction(nameof(CreateReview), MapToDto(review));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return NotFound();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return Ok();
    }

    private static ReviewDto MapToDto(Review review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            HotelId = review.HotelId,
            UserId = review.UserId,
            UserName = review.User?.FullName ?? "Anonymous",
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }
}
