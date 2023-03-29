using darkside_backend.Models.Entities;

namespace darkside_backend.Repository.Abstractions
{
    public interface IProductRepository : IRepository<ProductModel>
    {
        Task<ProductModel> GetProductByIdAsync(Guid id, bool includeExtItems);
        Task<List<string>> GetUniqueCategoriesAsync();
        Task<List<ProductModel>> SearchProducts(string term, int limit, int offset);
    }
}
