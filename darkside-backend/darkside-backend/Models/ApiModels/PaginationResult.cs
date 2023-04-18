namespace darkside_backend.Models.ApiModels
{
    public class PaginationResult<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
