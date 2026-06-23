using Microsoft.EntityFrameworkCore;
using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.Application.Common.Interfaces;

/// <summary>
/// Abstraction over the persistence layer. Controllers depend on this,
/// not on the concrete EF Core DbContext (Dependency Inversion).
/// </summary>
public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Hotel> Hotels { get; }
    DbSet<Room> Rooms { get; }
    DbSet<Booking> Bookings { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Favorite> Favorites { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
