using darkside_backend.Database;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace darkside_backend.Repository
{
    public class ProductRepository : Repository<ApplicationContext, ProductModel>, IProductRepository
    {
        public ProductRepository(ApplicationContext dbContext) : base(dbContext)
        {

        }

        public async Task<ProductModel> GetProductByIdAsync(Guid id, bool includeExtItems)
        {

            if (includeExtItems)
            {
                return
                    (await _dbContext.Products
                        .Include(t => t.Images)
                        .Include(v => v.Tastes)!
                        .ThenInclude(v => v.Taste)
                        .FirstOrDefaultAsync(u => u.Id == id))!;
            }

            return
                (await _dbContext.Products.FirstOrDefaultAsync(u => u.Id == id))!;
        }

        public async Task<List<string>> GetUniqueCategoriesAsync()
        {
            return await _dbContext.Products.Select(p => p.Category).Distinct().ToListAsync();
        }

        public async Task<List<ProductModel>> SearchProducts(string term, int limit, int offset)
        {
            return await _dbContext
                .Products
                .Where(t => EF.Functions.Like(t.Name, $"{term}%"))
                .OrderBy(t => t.Name)
                .Skip(offset)
                .Take(limit)
                .AsNoTracking()
                .Include(t => t.Images)
                .Include(t => t.Tastes)!
                .ThenInclude(v => v.Taste)
                .ToListAsync();
        }
    }
}
