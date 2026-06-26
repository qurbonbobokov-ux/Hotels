using TajikistanHotels.Domain.Entities;

namespace TajikistanHotels.Infrastructure.Persistence;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        var seedHotels = BuildHotelSeed();
        var existingKeys = context.Hotels
            .Select(h => (h.Name + "|" + h.City).ToLower())
            .ToHashSet();

        var hotelsToAdd = seedHotels
            .Where(h => !existingKeys.Contains((h.Name + "|" + h.City).ToLower()))
            .ToList();

        if (!hotelsToAdd.Any())
            return;

        context.Hotels.AddRange(hotelsToAdd);
        context.SaveChanges();

        var rooms = new List<Room>();
        foreach (var hotel in hotelsToAdd)
        {
            rooms.AddRange(CreateRooms(hotel));
        }

        context.Rooms.AddRange(rooms);
        context.SaveChanges();
    }

    private static List<Hotel> BuildHotelSeed()
    {
        return new List<Hotel>
        {
            Hotel("Grand Dushanbe Hotel", "Luxury 5-star hotel in the heart of Dushanbe", "Dushanbe", "Aini Avenue, Dushanbe", 4.8m, 245, 250),
            Hotel("Dushanbe Serena Hotel", "Premium city hotel near Rudaki Park and central business districts", "Dushanbe", "Rudaki Avenue, Dushanbe", 4.9m, 318, 310),
            Hotel("Hyatt Regency Dushanbe", "International business hotel with conference spaces and city views", "Dushanbe", "Ismoili Somoni Avenue, Dushanbe", 4.8m, 286, 295),
            Hotel("Hilton Dushanbe", "Modern upscale stay with wellness facilities and quick airport access", "Dushanbe", "Ayni Street, Dushanbe", 4.7m, 251, 280),
            Hotel("Dushanbe Central Plaza", "Modern business hotel in the city center", "Dushanbe", "Somoni Avenue, Dushanbe", 4.5m, 234, 150),
            Hotel("Atlas Hotel", "Boutique hotel with warm service and comfortable rooms", "Dushanbe", "Nisor Muhammad Street, Dushanbe", 4.6m, 164, 135),
            Hotel("Rohat Hotel", "Classic central hotel close to cafes, museums and government offices", "Dushanbe", "Rudaki Avenue, Dushanbe", 4.4m, 142, 115),
            Hotel("Vatan Hotel Dushanbe", "Practical city hotel for business and family travel", "Dushanbe", "Mirzo Tursunzoda Street, Dushanbe", 4.3m, 119, 105),
            Hotel("Safir Business Hotel", "Quiet business hotel with work-friendly rooms and airport transfer", "Dushanbe", "Bukhoro Street, Dushanbe", 4.4m, 132, 125),
            Hotel("Kangurt Grand Hotel", "Comfortable mid-range hotel with easy access to downtown Dushanbe", "Dushanbe", "Sino District, Dushanbe", 4.2m, 97, 90),

            Hotel("Khujand Palace", "Historic hotel with views of Khujand and the Syr Darya", "Khujand", "Lenin Street, Khujand", 4.6m, 189, 180),
            Hotel("Sugdiyon Hotel", "Central Khujand hotel close to Panjshanbe Bazaar and city landmarks", "Khujand", "R. Nabiev Avenue, Khujand", 4.5m, 173, 145),
            Hotel("Parliament Palace Hotel", "Upscale stay for business trips in northern Tajikistan", "Khujand", "Ismoili Somoni Avenue, Khujand", 4.4m, 118, 130),
            Hotel("Firuz Hotel Khujand", "Friendly local hotel with simple rooms and good city access", "Khujand", "Kamoli Khujandi Street, Khujand", 4.2m, 88, 82),
            Hotel("Armon Apart Hotel", "Apartment-style rooms for longer stays in Khujand", "Khujand", "Syr Darya Embankment, Khujand", 4.3m, 101, 95),

            Hotel("Panjakent Plaza Hotel", "Comfortable base for visiting ancient Panjakent and the Zeravshan Valley", "Panjakent", "Rudaki Street, Panjakent", 4.4m, 96, 110),
            Hotel("Zeravshan Valley Lodge", "Mountain lodge for travelers heading toward the Fann Mountains", "Panjakent", "Zeravshan Road, Panjakent", 4.6m, 132, 125),
            Hotel("Sarazm Heritage Hotel", "Small heritage-style stay near the Sarazm archaeological site", "Panjakent", "Sarazm Road, Panjakent", 4.2m, 74, 78),

            Hotel("Penj Mountain Resort", "Scenic mountain resort perfect for nature lovers", "Khorog", "Pamir Highway, Khorog", 4.7m, 156, 200),
            Hotel("Khorog Serena Inn", "Comfortable Pamir stay near the river and botanical garden", "Khorog", "Shirinsho Shotemur Street, Khorog", 4.5m, 121, 150),
            Hotel("Pamir Palace Hotel", "Mountain-view hotel for Pamir Highway journeys", "Khorog", "Pamir Highway, Khorog", 4.4m, 104, 135),
            Hotel("Lal Inn Khorog", "Simple guest-focused hotel with easy access to central Khorog", "Khorog", "Lenin Street, Khorog", 4.2m, 86, 72),

            Hotel("Istaravshan Grand Hotel", "Historic city hotel near old bazaars and cultural sites", "Istaravshan", "Main Street, Istaravshan", 4.2m, 82, 85),
            Hotel("Mug Tepa Boutique Hotel", "Boutique stay inspired by Istaravshan craft traditions", "Istaravshan", "Mug Tepa Road, Istaravshan", 4.4m, 76, 95),
            Hotel("Isfara Garden Hotel", "Relaxed hotel for trips through the Ferghana Valley", "Isfara", "Markazi Street, Isfara", 4.1m, 67, 70),
            Hotel("Kanibadam Comfort Hotel", "Practical regional hotel for business and transit stays", "Kanibadam", "Somoni Street, Kanibadam", 4.0m, 54, 64),

            Hotel("Bokhtar Plaza Hotel", "Modern hotel serving the Khatlon region business center", "Bokhtar", "N. Khusrav Street, Bokhtar", 4.3m, 116, 105),
            Hotel("Khatlon Grand Hotel", "Spacious hotel for events and family stays in Bokhtar", "Bokhtar", "Ayni Street, Bokhtar", 4.2m, 94, 92),
            Hotel("Kulob Palace Hotel", "Central hotel close to Kulob landmarks and restaurants", "Kulob", "Ismoili Somoni Street, Kulob", 4.3m, 91, 90),
            Hotel("Sayohat Kulob Hotel", "Friendly local hotel for travelers exploring southern Tajikistan", "Kulob", "Rudaki Avenue, Kulob", 4.1m, 63, 66),
            Hotel("Danghara Business Hotel", "Business-friendly stay near regional offices and highways", "Danghara", "Central Avenue, Danghara", 4.1m, 59, 72),
            Hotel("Norak Lake Resort", "Resort stay near Nurek Reservoir with lake and mountain views", "Nurek", "Nurek Reservoir Road, Nurek", 4.5m, 138, 140),
            Hotel("Vakhsh River Hotel", "Comfortable regional hotel near the Vakhsh River", "Levakant", "Vakhsh Embankment, Levakant", 4.0m, 47, 60),

            Hotel("Hisor Fortress Hotel", "Convenient stay for visiting the Hisor historical complex", "Hisor", "Fortress Road, Hisor", 4.3m, 102, 88),
            Hotel("Tursunzoda Silk Road Hotel", "Transit-friendly hotel west of Dushanbe", "Tursunzoda", "Main Highway, Tursunzoda", 4.0m, 52, 58),
            Hotel("Vahdat Family Hotel", "Simple family hotel near the eastern approach to Dushanbe", "Vahdat", "Somoni Street, Vahdat", 4.1m, 61, 62),
            Hotel("Rasht Valley Lodge", "Mountain lodge for visitors to the Rasht Valley", "Rasht", "Central Road, Gharm", 4.4m, 84, 96),

            Hotel("Lake Qarakul Resort", "Remote alpine lake resort with breathtaking views", "Murghab", "Qarakul Lake Area, Murghab", 4.9m, 98, 220),
            Hotel("Murghab Pamir Hotel", "High-altitude hotel for Pamir Highway expeditions", "Murghab", "Pamir Highway, Murghab", 4.3m, 79, 115),
            Hotel("Wakhan Valley Guest Hotel", "Scenic stay for exploring the Wakhan Corridor", "Ishkashim", "Wakhan Road, Ishkashim", 4.6m, 124, 135),
            Hotel("Ishkashim Border Hotel", "Practical base for Wakhan Valley and hot spring trips", "Ishkashim", "Central Street, Ishkashim", 4.2m, 66, 82),
            Hotel("Darvoz Mountain Hotel", "Mountain hotel on the route between Kulob and Khorog", "Darvoz", "Pamir Highway, Darvoz", 4.3m, 73, 90),
            Hotel("Kalaikhumb River Lodge", "Riverfront lodge for Pamir Highway stopovers", "Kalaikhumb", "Panj River Road, Kalaikhumb", 4.5m, 111, 120)
        };
    }

    private static Hotel Hotel(
        string name,
        string description,
        string city,
        string address,
        decimal rating,
        int reviewCount,
        decimal price)
    {
        return new Hotel
        {
            Name = name,
            Description = description,
            City = city,
            Address = address,
            Phone = "+992501011277",
            Email = $"info@{Slug(name)}.tj",
            Rating = rating,
            ReviewCount = reviewCount,
            Price = price,
            ImageUrl = $"https://via.placeholder.com/400x300?text={Uri.EscapeDataString(name)}",
            IsActive = true
        };
    }

    private static IEnumerable<Room> CreateRooms(Hotel hotel)
    {
        return new[]
        {
            new Room
            {
                HotelId = hotel.Id,
                Type = "Standard Room",
                Capacity = 2,
                Count = 10,
                AvailableCount = 10,
                Price = hotel.Price,
                Description = "Comfortable room with essential amenities",
                IsActive = true
            },
            new Room
            {
                HotelId = hotel.Id,
                Type = "Deluxe Room",
                Capacity = 2,
                Count = 6,
                AvailableCount = 6,
                Price = hotel.Price + 45,
                Description = "Larger room with upgraded furnishings",
                IsActive = true
            },
            new Room
            {
                HotelId = hotel.Id,
                Type = "Family Suite",
                Capacity = 4,
                Count = 4,
                AvailableCount = 4,
                Price = hotel.Price + 120,
                Description = "Suite with extra space for families or groups",
                IsActive = true
            }
        };
    }

    private static string Slug(string value)
    {
        var chars = value
            .ToLowerInvariant()
            .Where(c => char.IsLetterOrDigit(c))
            .ToArray();

        return new string(chars);
    }
}
