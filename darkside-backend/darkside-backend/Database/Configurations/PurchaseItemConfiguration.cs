using darkside_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace darkside_backend.Database.Configurations
{
    public class PurchaseItemConfiguration : IEntityTypeConfiguration<PurchaseItemModel>
    {
        public void Configure(EntityTypeBuilder<PurchaseItemModel> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.PurchaseId).IsRequired();
            builder.Property(b => b.ProductId).IsRequired();
            builder.Property(b => b.Price).IsRequired();
            builder.Property(b => b.Count).IsRequired();

            builder
                .HasOne(t => t.Purchase)
                .WithMany(t => t.Items)
                .HasForeignKey(p => p.PurchaseId)
                .IsRequired();

            builder
                .HasOne(t => t.Product)
                .WithMany(t => t.PurchaseItems)
                .HasForeignKey(p => p.ProductId)
                .IsRequired();

            builder.HasIndex(b => b.Id);
            builder.HasIndex(b => b.ProductId);
            builder.HasIndex(b => b.PurchaseId);
        }
    }
}
