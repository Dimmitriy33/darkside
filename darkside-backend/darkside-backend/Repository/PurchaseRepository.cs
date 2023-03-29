using darkside_backend.Database;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace darkside_backend.Repository
{
    public class PurchaseRepository : Repository<ApplicationContext, PurchaseModel>, IPurchaseRepository
    {
        public PurchaseRepository(ApplicationContext dbContext) : base(dbContext)
        {

        }
        public async Task<List<PurchaseModel>> GetUserPurchases(Guid id)
        {

            var res =
                await _dbContext.Purchases
                    .Where(t => t.UserId == id)
                    .Include(r => r.Items)
                    .ThenInclude(t => t.Product)
                    .ToListAsync();

            return res;
        }

        public async Task<List<PurchaseModel>> GetAllPurchases()
        {
            var res =
                 await _dbContext.Purchases
                     .Include(r => r.Items)
                     .ThenInclude(t => t.Product)
                     .Include(u => u.User)
                     .ToListAsync();


            return res;
        }
    }
}
