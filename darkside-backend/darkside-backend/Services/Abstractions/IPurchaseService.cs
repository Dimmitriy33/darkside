using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;

namespace darkside_backend.Services.Abstractions
{
    public interface IPurchaseService
    {
        Task<PurchaseCreateResponse> CreatePurchaseAsync(List<PurchaseItemCreateRequest> model, string username);
        Task<List<PurchaseModel>> GetUserPurchases(Guid id);
        Task<PaginationResult<PurchaseModel>> GetAllPurchases(int limit, int offest, string? userTerm);
    }
}
