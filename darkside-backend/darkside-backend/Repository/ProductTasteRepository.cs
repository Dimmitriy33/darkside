using darkside_backend.Database;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace darkside_backend.Repository
{
    public class ProductTasteRepository : Repository<ApplicationContext, ProductTasteModel>, IProductTasteRepository
    {
        public ProductTasteRepository(ApplicationContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<ProductTasteModel>> GetTastesByProductId(Guid id)
        {

            return await _dbContext.ProductTastes.Where(t => t.ProductId == id).ToListAsync();
        }
    }
}
