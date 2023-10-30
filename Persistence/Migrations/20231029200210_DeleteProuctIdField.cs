using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DeleteProuctIdField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInfos_Products_ProductId",
                table: "ProductInfos");

            migrationBuilder.DropIndex(
                name: "IX_ProductInfos_ProductId",
                table: "ProductInfos");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "ProductInfos");

            migrationBuilder.AddColumn<int>(
                name: "ProductInfoId",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductInfoId",
                table: "Products",
                column: "ProductInfoId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductInfos_ProductInfoId",
                table: "Products",
                column: "ProductInfoId",
                principalTable: "ProductInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductInfos_ProductInfoId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ProductInfoId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductInfoId",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "ProductInfos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProductInfos_ProductId",
                table: "ProductInfos",
                column: "ProductId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInfos_Products_ProductId",
                table: "ProductInfos",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
