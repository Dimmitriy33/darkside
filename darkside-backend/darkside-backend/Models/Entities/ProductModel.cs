using darkside_backend.Models.ApiModels;

namespace darkside_backend.Models.Entities
{
    public class ProductModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ProductCreatorModel CreatorFull { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public float Price { get; set; }
        public int Amount { get; set; }
        public float? SalePerc { get; set; }
        public string ImageUrl { get; set; }
        public float? length { get; set; }
        public float? width { get; set; }
        public float? height { get; set; }
        public float? weight { get; set; } // вес/объем
        public int? strength { get; set; } // крепость
        public int? capacity { get; set; } // емкость акк
        public int? vp { get; set; } // vp/pg
        public bool IsHidden { get; set; }
        public ICollection<ProductImagesModel> Images { get; set; }
        public ICollection<ProductTasteModel>? Tastes { get; set; }
        public ICollection<PurchaseItemModel>? PurchaseItems { get; set; }
    }
}
