using darkside_backend.Models.Entities;
using darkside_backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace darkside_backend.Database.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserModel>
    {
        public void Configure(EntityTypeBuilder<UserModel> builder)
        {
            builder.HasKey(b => b.Id);

            builder
                .Property(b => b.Id)
                .IsRequired();

            builder.Property(b => b.FirstName).IsRequired();
            builder.Property(b => b.LastName).IsRequired();
            builder.Property(b => b.Email).IsRequired().HasMaxLength(128);
            builder.Property(b => b.Phone).IsRequired();
            builder.Property(b => b.Role).HasDefaultValue(RolesEnum.user).IsRequired();
            builder.Property(b => b.Username).IsRequired();
            builder.Property(b => b.Password).IsRequired();
            builder.Property(b => b.Balance).IsRequired().HasDefaultValue(0);

            builder.HasIndex(b => b.Id);
            builder.HasIndex(b => b.Email);
            builder.HasIndex(b => b.Role);
            builder.HasIndex(b => b.Username);

        }
    }
}
