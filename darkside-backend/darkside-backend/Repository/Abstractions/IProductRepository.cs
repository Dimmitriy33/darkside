using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;

namespace darkside_backend.Repository.Abstractions
{
    public interface IProductRepository : IRepository<ProductModel>
    {
        Task<ProductModel> GetProductByIdAsync(Guid id, bool includeExtItems);
        Task<List<ProductModel>> GetProductsByIdsAsync(Guid[] ids, bool includeExtItems);
        Task<List<string>> GetUniqueCategoriesAsync();
        Task<List<string>> GetUniqueCreatorsAsync();

        Task<PaginationResult<ProductModel>> SearchProducts(string term, int limit, int offset, string category,
            string creator, int priceMin, int priceMax, int vpMin, int vpMax, bool isHidden, bool withEmpty);
    }
}
