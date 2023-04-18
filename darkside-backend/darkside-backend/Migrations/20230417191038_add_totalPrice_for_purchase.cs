using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace darkside_backend.Migrations
{
    /// <inheritdoc />
    public partial class add_totalPrice_for_purchase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "TotalPrice",
                table: "Purchases",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Purchases");
        }
    }
}
