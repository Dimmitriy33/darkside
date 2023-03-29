namespace darkside_backend.Models.ApiModels
{
    public class PurchaseCreateResponse
    {
        public ICollection<PurchaseItemCreateResponse> Items { get; set; }
        public float TotalPrice { get; set; }
    }
}
