using TajikistanHotels.Application.DTOs;

namespace TajikistanHotels.Application.Common.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request);
}
