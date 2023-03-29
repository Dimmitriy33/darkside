namespace darkside_backend.Models.ApiModels
{
    public class UpdateTastesRequest
    {
        public Guid ProductId { get; set; }
        public ICollection<int> TastesIds { get; set; }
    }
}
