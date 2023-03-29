namespace darkside_backend.Models.ApiModels
{
    public class ProductUpdateRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public float Price { get; set; }
        public int Amount { get; set; }
        public float? SalePerc { get; set; }
        public float? length { get; set; }
        public float? width { get; set; }
        public float? height { get; set; }
        public float? weight { get; set; } // вес/объем
        public int? strength { get; set; } // крепость
        public int? capacity { get; set; } // емкость акк
        public int? vp { get; set; } // vp/pg
        public bool IsHidden { get; set; }
    }
}
