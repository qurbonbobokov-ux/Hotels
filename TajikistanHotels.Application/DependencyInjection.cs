using Microsoft.Extensions.DependencyInjection;

namespace TajikistanHotels.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Application-level services (validators, mappers, MediatR handlers)
        // are registered here as the project grows.
        return services;
    }
}
