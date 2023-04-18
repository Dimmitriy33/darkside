using darkside_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace darkside_backend.Database.Configurations
{
    public class PurchaseConfiguration : IEntityTypeConfiguration<PurchaseModel>
    {
        public void Configure(EntityTypeBuilder<PurchaseModel> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Date).IsRequired();
            builder.Property(b => b.UserId).IsRequired();
            builder.Property(b => b.TotalPrice).IsRequired();

            builder
                .HasOne(t => t.User)
                .WithMany(t => t.Purchases)
                .HasForeignKey(p => p.UserId)
                .IsRequired();

            builder
                .HasMany(t => t.Items)
                .WithOne(t => t.Purchase)
                .HasForeignKey(p => p.PurchaseId)
                .IsRequired();

            builder.HasIndex(b => b.Id);
            builder.HasIndex(b => b.UserId);
            builder.HasIndex(b => b.Date);
        }
    }
}
