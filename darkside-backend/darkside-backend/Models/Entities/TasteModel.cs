namespace darkside_backend.Models.Entities
{
    public class TasteModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<ProductTasteModel> ProductsTaste { get; set; }
    }
}
