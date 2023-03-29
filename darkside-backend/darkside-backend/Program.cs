using darkside_backend.Database;
using darkside_backend.Helpers.Mappers;
using darkside_backend.Helpers.Settings;
using darkside_backend.Middlewares;
using darkside_backend.Repository;
using darkside_backend.Repository.Abstractions;
using darkside_backend.Services;
using darkside_backend.Services.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

// add services to DI container
{
    var services = builder.Services;
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Dark side", Version = "v1" });

        c.CustomSchemaIds(x => x.FullName);
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization via Bearer scheme: Bearer {token}",
            Scheme = "JWT",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[0]
            }
        });
    });

    services.AddCors();
    services.AddControllers().AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

    // configure strongly typed settings object
    services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
    services.Configure<DbSettings>(builder.Configuration.GetSection("DbSettings"));
    services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

    var connectionString = builder.Configuration.GetSection(nameof(DbSettings)).Get<DbSettings>()?.ConnectionString;
    services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connectionString));

    // configure DI for application services
    services.AddTransient<IUserService, UserService>();
    services.AddScoped<ICloudinaryService, CloudinaryService>();
    services.AddScoped<IProductService, ProductService>();
    services.AddScoped<IPurchaseService, PurchaseService>();

    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<IProductImageRepository, ProductImageRepository>();
    services.AddScoped<IProductTasteRepository, ProductTasteRepository>();
    services.AddScoped<IProductRepository, ProductRepository>();
    services.AddScoped<ITasteRepository, TasteRepository>();
    services.AddScoped<IPurchaseRepository, PurchaseRepository>();
    services.AddScoped<IPurchaseItemRepository, PurchaseItemRepository>();

    services.AddAutoMapper(typeof(AppMappingProfile));
}

var app = builder.Build();

// configure HTTP request pipeline
{
    // global cors policy
    app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    app.UseMiddleware<JwtMiddleware>();
    app.UseMiddleware<ExceptionMiddleware>();

    app.MapControllers();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.Run();