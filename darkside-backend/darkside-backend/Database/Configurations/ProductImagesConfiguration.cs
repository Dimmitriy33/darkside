using darkside_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace darkside_backend.Database.Configurations
{
    public class ProductImagesConfiguration : IEntityTypeConfiguration<ProductImagesModel>
    {
        public void Configure(EntityTypeBuilder<ProductImagesModel> builder)
        {
            builder.HasKey(b => b.Id);

            builder
                .Property(b => b.Id)
                .IsRequired();

            builder.Property(b => b.ImageUrl).IsRequired();
            builder.Property(b => b.ProductId).IsRequired();

            builder
                .HasOne(t => t.Product)
                .WithMany(t => t.Images)
                .HasForeignKey(p => p.ProductId)
                .IsRequired();

            builder.HasIndex(b => b.Id);
            builder.HasIndex(b => b.ProductId);
        }
    }
}
