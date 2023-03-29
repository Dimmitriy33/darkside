namespace darkside_backend.Models.ApiModels
{
    public class PurchaseItemCreateRequest
    {
        public Guid ProductId { get; set; }
        public int Count { get; set; }
    }
}
