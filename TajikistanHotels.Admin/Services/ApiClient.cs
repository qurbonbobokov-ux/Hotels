using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.JSInterop;
using TajikistanHotels.Admin.Models;

namespace TajikistanHotels.Admin.Services;

public class ApiClient
{
    private readonly HttpClient _http;
    private readonly IJSRuntime _js;

    public string? Token { get; private set; }
    public AuthUser? User { get; private set; }
    public bool IsAuthenticated => !string.IsNullOrEmpty(Token);
    public bool IsAdmin => User?.Role?.Equals("admin", StringComparison.OrdinalIgnoreCase) == true;

    public ApiClient(HttpClient http, IJSRuntime js)
    {
        _http = http;
        _js = js;
    }

    // Restore the saved session (called once when the app shell loads).
    public async Task InitializeAsync()
    {
        if (IsAuthenticated) return;
        Token = await _js.InvokeAsync<string?>("localStorage.getItem", "admin_token");
        var name = await _js.InvokeAsync<string?>("localStorage.getItem", "admin_name");
        var role = await _js.InvokeAsync<string?>("localStorage.getItem", "admin_role");
        if (!string.IsNullOrEmpty(Token))
        {
            User = new AuthUser { Name = name ?? "", Role = role ?? "" };
            SetAuthHeader();
        }
    }

    public async Task<string?> LoginAsync(string email, string password)
    {
        var resp = await _http.PostAsJsonAsync("api/auth/login", new LoginRequest { Email = email, Password = password });
        if (!resp.IsSuccessStatusCode)
            return "Invalid email or password.";

        var data = await resp.Content.ReadFromJsonAsync<AuthResponse>();
        if (data is null)
            return "Unexpected server response.";

        if (!data.User.Role.Equals("admin", StringComparison.OrdinalIgnoreCase))
            return "This account does not have admin access.";

        Token = data.Token;
        User = data.User;
        SetAuthHeader();
        await _js.InvokeVoidAsync("localStorage.setItem", "admin_token", Token);
        await _js.InvokeVoidAsync("localStorage.setItem", "admin_name", User.Name);
        await _js.InvokeVoidAsync("localStorage.setItem", "admin_role", User.Role);
        return null; // success
    }

    public async Task LogoutAsync()
    {
        Token = null;
        User = null;
        _http.DefaultRequestHeaders.Authorization = null;
        await _js.InvokeVoidAsync("localStorage.removeItem", "admin_token");
        await _js.InvokeVoidAsync("localStorage.removeItem", "admin_name");
        await _js.InvokeVoidAsync("localStorage.removeItem", "admin_role");
    }

    private void SetAuthHeader() =>
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);

    // ---- Hotels ----
    public Task<List<HotelModel>?> GetHotelsAsync() =>
        _http.GetFromJsonAsync<List<HotelModel>>("api/hotels");

    public Task<HttpResponseMessage> CreateHotelAsync(SaveHotelRequest r) =>
        _http.PostAsJsonAsync("api/hotels", r);

    public Task<HttpResponseMessage> UpdateHotelAsync(Guid id, SaveHotelRequest r) =>
        _http.PutAsJsonAsync($"api/hotels/{id}", r);

    public Task<HttpResponseMessage> DeleteHotelAsync(Guid id) =>
        _http.DeleteAsync($"api/hotels/{id}");

    // ---- Rooms ----
    public Task<List<RoomModel>?> GetRoomsAsync(Guid hotelId) =>
        _http.GetFromJsonAsync<List<RoomModel>>($"api/rooms/hotel/{hotelId}");

    public Task<HttpResponseMessage> CreateRoomAsync(RoomModel r) =>
        _http.PostAsJsonAsync("api/rooms", r);

    public Task<HttpResponseMessage> UpdateRoomAsync(Guid id, RoomModel r) =>
        _http.PutAsJsonAsync($"api/rooms/{id}", r);

    public Task<HttpResponseMessage> DeleteRoomAsync(Guid id) =>
        _http.DeleteAsync($"api/rooms/{id}");

    // ---- Bookings ----
    public Task<List<BookingModel>?> GetBookingsAsync() =>
        _http.GetFromJsonAsync<List<BookingModel>>("api/bookings/all");

    // ---- Users ----
    public Task<List<UserModel>?> GetUsersAsync() =>
        _http.GetFromJsonAsync<List<UserModel>>("api/users");

    public Task<HttpResponseMessage> DeleteUserAsync(string id) =>
        _http.DeleteAsync($"api/users/{id}");
}
