using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;

namespace darkside_backend.Repository.Abstractions
{
    public interface IPurchaseRepository : IRepository<PurchaseModel>
    {
        Task<List<PurchaseModel>> GetUserPurchases(Guid id);
        Task<PaginationResult<PurchaseModel>> GetAllPurchases(int limit, int offset, List<Guid> userIds);
    }
}
