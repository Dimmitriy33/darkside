namespace darkside_backend.Models.Entities
{
    public class ProductImagesModel
    {
        public int Id { get; set; }
        public Guid ProductId { get; set; }
        public string ImageUrl { get; set; }
        public ProductModel Product { get; set; }
    }
}
