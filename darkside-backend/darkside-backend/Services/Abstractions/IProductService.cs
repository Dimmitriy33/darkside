using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;

namespace darkside_backend.Services.Abstractions
{
    public interface IProductService
    {
        Task<ProductModel> CreateProductAsync(ProductCreateRequest model);
        Task<ICollection<string>> GetCategories();
        Task<List<ProductModel>> SearchProducts(string term, int limit, int offset);
        Task UpdateTastes(UpdateTastesRequest model);
        Task<ProductModel> UpdateProductAsync(ProductUpdateRequest model);
        Task<ProductModel> UpdateProductMainImageAsync(UpdateProductMainImageRequest model);
        Task DeleteProductAsync(Guid id);
    }
}
