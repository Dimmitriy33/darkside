using System.ComponentModel.DataAnnotations;

namespace darkside_backend.Models.Entities
{
    public class PurchaseItemModel
    {
        [Key]
        public int Id { get; set; }
        public int PurchaseId { get; set; }
        public Guid ProductId { get; set; }
        public float Price { get; set; }
        public int Count { get; set; }
        public PurchaseModel Purchase { get; set; }
        public ProductModel Product { get; set; }
    }
}
