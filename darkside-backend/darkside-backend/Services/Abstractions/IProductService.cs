using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;

namespace darkside_backend.Services.Abstractions
{
    public interface IProductService
    {
        Task<ProductModel> CreateProductAsync(ProductCreateRequest model);
        Task<ProductModel> GetProductByIdAsync(string id);
        Task<List<ProductModel>> GetProductsByIdsAsync(string[] ids);
        Task<ICollection<string>> GetCategories();
        Task<ICollection<string>> GetCreators();
        Task<PaginationResult<ProductModel>> SearchProducts(string term, int limit, int offset, string category, string creator, int priceMin, int priceMax, int vpMin, int vpMax, bool isHidden, bool withEmpty);
        Task UpdateTastes(UpdateTastesRequest model);
        Task<ProductModel> UpdateProductAsync(ProductUpdateRequest model);
        Task<ProductModel> UpdateProductMainImageAsync(UpdateProductMainImageRequest model);
        Task DeleteProductAsync(Guid id);
    }
}
