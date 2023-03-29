namespace darkside_backend.Models.Entities
{
    public class ProductTasteModel
    {
        public int Id { get; set; }
        public Guid ProductId { get; set; }
        public int TasteId { get; set; }
        public ProductModel Product { get; set; }
        public TasteModel Taste { get; set; }
    }
}
