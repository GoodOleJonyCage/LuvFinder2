using LuvFinder.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<LuvFinderContext>();
//builder.Services.AddDbContext<LuvFinderContext>(options => options.UseSqlServer(
//    sqlServerOptions => sqlServerOptions.CommandTimeout(120))//increase timeout
//);


builder.Services.Configure<SecurityStampValidatorOptions>(options => options.ValidationInterval =
           System.TimeSpan.FromMinutes(double.Parse(builder.Configuration["Timeout"].ToString())));
//JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//.AddCookie(config =>
//{
//    config.SlidingExpiration = true;
//    //sliging expireation not working 
//    config.ExpireTimeSpan = System.TimeSpan.FromMinutes(double.Parse(builder.Configuration["Timeout"].ToString()));
//})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ClockSkew = TimeSpan.Zero,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});
//builder.Services.AddAuthorization();
/*Max size of request*/

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueCountLimit = 10; //default 1024
    options.ValueLengthLimit = int.MaxValue; //not recommended value
    options.MultipartBodyLengthLimit = long.MaxValue; //not recommended value
    options.MemoryBufferThreshold = Int32.MaxValue;
});

builder.Services.AddMvc(options =>
{
    options.MaxModelBindingCollectionSize = int.MaxValue;
});
/*Max size of request*/

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles")),
//    RequestPath = "/StaticFiles"
//}); //For the needed folder    
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html"); ;

app.Run();
