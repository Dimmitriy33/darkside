using darkside_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace darkside_backend.Database.Configurations
{
    public class ProductTastesConfiguration : IEntityTypeConfiguration<ProductTasteModel>
    {
        public void Configure(EntityTypeBuilder<ProductTasteModel> builder)
        {
            builder.HasKey(b => b.Id);

            builder
                .Property(b => b.Id)
                .IsRequired();

            builder.Property(b => b.ProductId).IsRequired();

            builder
                .HasOne(t => t.Product)
                .WithMany(t => t.Tastes)
                .HasForeignKey(p => p.ProductId)
                .IsRequired();

            builder
                .HasOne(t => t.Taste)
                .WithMany(t => t.ProductsTaste)
                .HasForeignKey(p => p.TasteId)
                .IsRequired();

            builder.HasIndex(b => b.Id);
            builder.HasIndex(b => b.ProductId);
        }
    }
}
