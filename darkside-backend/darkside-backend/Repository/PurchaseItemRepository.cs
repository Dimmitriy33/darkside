using darkside_backend.Database;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;

namespace darkside_backend.Repository
{
    public class PurchaseItemRepository : Repository<ApplicationContext, PurchaseItemModel>, IPurchaseItemRepository
    {
        public PurchaseItemRepository(ApplicationContext dbContext) : base(dbContext)
        {

        }
    }
}
