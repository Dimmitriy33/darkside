using darkside_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace darkside_backend.Database.Configurations
{
    public class TasteConfiguration : IEntityTypeConfiguration<TasteModel>
    {
        public void Configure(EntityTypeBuilder<TasteModel> builder)
        {
            builder.HasKey(b => b.Id);

            builder
                .Property(b => b.Id)
                .IsRequired();

            builder.Property(b => b.Name).IsRequired();

            builder.HasIndex(b => b.Id);
            builder.HasIndex(b => b.Name);
        }
    }
}
