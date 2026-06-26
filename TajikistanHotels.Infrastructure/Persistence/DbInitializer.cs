using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.Infrastructure.Persistence;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        if (context.Hotels.Any())
            return;

        var hotels = new List<Hotel>
        {
            new Hotel
            {
                Name = "Grand Dushanbe Hotel",
                Description = "Luxury 5-star hotel in the heart of Dushanbe",
                City = "Dushanbe",
                Address = "Aini Avenue, Dushanbe",
                Phone = "+992501011277",
                Email = "info@granddushanbe.com",
                Rating = 4.8m,
                ReviewCount = 245,
                Price = 250,
                ImageUrl = "https://via.placeholder.com/400x300?text=Grand+Dushanbe",
                IsActive = true
            },
            new Hotel
            {
                Name = "Khujand Palace",
                Description = "Historic hotel with stunning views of the city",
                City = "Khujand",
                Address = "Lenin Street, Khujand",
                Phone = "+992501011277",
                Email = "info@khujandpalace.com",
                Rating = 4.6m,
                ReviewCount = 189,
                Price = 180,
                ImageUrl = "https://via.placeholder.com/400x300?text=Khujand+Palace",
                IsActive = true
            },
            new Hotel
            {
                Name = "Penj Mountain Resort",
                Description = "Scenic mountain resort perfect for nature lovers",
                City = "Khorog",
                Address = "Pamir Highway, Khorog",
                Phone = "+992501011277",
                Email = "info@penjresort.com",
                Rating = 4.7m,
                ReviewCount = 156,
                Price = 200,
                ImageUrl = "https://via.placeholder.com/400x300?text=Penj+Resort",
                IsActive = true
            },
            new Hotel
            {
                Name = "Dushanbe Central Plaza",
                Description = "Modern business hotel in the city center",
                City = "Dushanbe",
                Address = "Somoni Avenue, Dushanbe",
                Phone = "+992501011277",
                Email = "info@dushanbeplaza.com",
                Rating = 4.5m,
                ReviewCount = 234,
                Price = 150,
                ImageUrl = "https://via.placeholder.com/400x300?text=Central+Plaza",
                IsActive = true
            },
            new Hotel
            {
                Name = "Lake Qarakul Resort",
                Description = "Remote alpine lake resort with breathtaking views",
                City = "Ishkashim",
                Address = "Qarakul Lake Area",
                Phone = "+992501011277",
                Email = "info@qarakulresort.com",
                Rating = 4.9m,
                ReviewCount = 98,
                Price = 220,
                ImageUrl = "https://via.placeholder.com/400x300?text=Qarakul+Resort",
                IsActive = true
            }
        };

        context.Hotels.AddRange(hotels);
        context.SaveChanges();

        var rooms = new List<Room>();
        foreach (var hotel in hotels)
        {
            rooms.AddRange(new[]
            {
                new Room
                {
                    HotelId = hotel.Id,
                    Type = "Standard Room",
                    Capacity = 2,
                    Count = 10,
                    AvailableCount = 10,
                    Price = hotel.Price,
                    Description = "Comfortable room with basic amenities",
                    IsActive = true
                },
                new Room
                {
                    HotelId = hotel.Id,
                    Type = "Deluxe Room",
                    Capacity = 2,
                    Count = 5,
                    AvailableCount = 5,
                    Price = hotel.Price + 50,
                    Description = "Spacious room with premium furnishings",
                    IsActive = true
                },
                new Room
                {
                    HotelId = hotel.Id,
                    Type = "Suite",
                    Capacity = 4,
                    Count = 3,
                    AvailableCount = 3,
                    Price = hotel.Price + 150,
                    Description = "Luxurious suite with living area",
                    IsActive = true
                }
            });
        }

        context.Rooms.AddRange(rooms);
        context.SaveChanges();
    }
}
