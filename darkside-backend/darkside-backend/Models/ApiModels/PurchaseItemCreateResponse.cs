using darkside_backend.Models.Entities;

namespace darkside_backend.Models.ApiModels
{
    public class PurchaseItemCreateResponse
    {
        public ProductModel Product { get; set; }
        public int Count { get; set; }
    }
}
