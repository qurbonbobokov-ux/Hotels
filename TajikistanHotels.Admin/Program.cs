using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using TajikistanHotels.Admin;
using TajikistanHotels.Admin.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// The admin SPA talks to the TajikistanHotels API.
var apiBaseUrl = builder.Configuration["ApiBaseUrl"] ?? "http://localhost:5050/";
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(apiBaseUrl) });
builder.Services.AddScoped<ApiClient>();

await builder.Build().RunAsync();
