using darkside_backend.Models.Entities;

namespace darkside_backend.Repository.Abstractions
{
    public interface IProductTasteRepository : IRepository<ProductTasteModel>
    {
        Task<List<ProductTasteModel>> GetTastesByProductId(Guid id);
    }
}
