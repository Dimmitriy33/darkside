using darkside_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace darkside_backend.Database.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<ProductModel>
    {
        public void Configure(EntityTypeBuilder<ProductModel> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id).IsRequired();
            builder.Property(b => b.Name).IsRequired();
            builder.Property(b => b.Description).IsRequired();
            builder.Property(b => b.Category).IsRequired();
            builder.Property(b => b.Price).IsRequired();
            builder.Property(b => b.Amount).IsRequired();
            builder.Property(b => b.SalePerc);
            builder.Property(b => b.ImageUrl).IsRequired();
            builder.Property(b => b.length);
            builder.Property(b => b.width);
            builder.Property(b => b.height);
            builder.Property(b => b.weight);
            builder.Property(b => b.strength);
            builder.Property(b => b.capacity);
            builder.Property(b => b.vp);
            builder.Property(b => b.IsHidden).HasDefaultValue(false).IsRequired();

            builder.OwnsOne(
                b => b.CreatorFull, ownedNavigationBuilder =>
                {
                    ownedNavigationBuilder.ToJson();
                    ownedNavigationBuilder.HasIndex(v => v.Name);
                    ownedNavigationBuilder.OwnsOne(pc => pc.Address, d => d.HasIndex(v => v.Country));
                });

            builder.HasIndex(b => b.Id);
            builder.HasIndex(b => b.Name);
            builder.HasIndex(b => b.Category);
            builder.HasIndex(b => b.Amount);
            builder.HasIndex(b => b.Price);
            builder.HasIndex(b => b.IsHidden);
        }
    }
}
