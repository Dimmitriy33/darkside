using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace darkside_backend.Migrations
{
    /// <inheritdoc />
    public partial class add_creator_json_to_prod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_CreatorName",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CreatorName",
                table: "Products");

            migrationBuilder.AddColumn<string>(
                name: "CreatorFull",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatorFull",
                table: "Products");

            migrationBuilder.AddColumn<string>(
                name: "CreatorName",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CreatorName",
                table: "Products",
                column: "CreatorName");
        }
    }
}
