using darkside_backend.Database.Configurations;
using darkside_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace darkside_backend.Database
{
    public class ApplicationContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; } = null!;
        public DbSet<ProductModel> Products { get; set; } = null!;
        public DbSet<ProductImagesModel> ProductImages { get; set; } = null!;
        public DbSet<ProductTasteModel> ProductTastes { get; set; } = null!;
        public DbSet<PurchaseModel> Purchases { get; set; } = null!;
        public DbSet<PurchaseItemModel> PurchaseItems { get; set; } = null!;
        public DbSet<TasteModel> Tastes { get; set; } = null!;
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ProductConfiguration());
            modelBuilder.ApplyConfiguration(new ProductImagesConfiguration());
            modelBuilder.ApplyConfiguration(new ProductTastesConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new PurchaseConfiguration());
            modelBuilder.ApplyConfiguration(new PurchaseItemConfiguration());
            modelBuilder.ApplyConfiguration(new TasteConfiguration());
        }
    }
}
