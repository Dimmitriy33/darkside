using darkside_backend.Database;
using darkside_backend.Models.ApiModels;
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

        public async Task<List<ProductModel>> GetProductsByIdsAsync(Guid[] ids, bool includeExtItems)
        {

            if (includeExtItems)
            {
                return
                    await _dbContext.Products
                        .Include(t => t.Images)
                        .Include(v => v.Tastes)!
                        .ThenInclude(v => v.Taste)
                        .Where(t => ids.Contains(t.Id)).ToListAsync();
            }

            return
                await _dbContext.Products.Where(t => ids.Contains(t.Id)).ToListAsync();
        }

        public async Task<List<string>> GetUniqueCategoriesAsync()
        {
            return await _dbContext.Products.Select(p => p.Category).Distinct().ToListAsync();
        }

        public async Task<List<string>> GetUniqueCreatorsAsync()
        {
            return await _dbContext.Products.Select(p => p.CreatorFull.Name).Distinct().ToListAsync();
        }

        public async Task<PaginationResult<ProductModel>> SearchProducts(string term, int limit, int offset, string category, string creator, int priceMin, int priceMax, int vpMin, int vpMax, bool isHidden, bool withEmpty)
        {
            var req = _dbContext.Products
                .Where(v => v.Price > priceMin && v.Price < priceMax)
                .Where(v => (v.vp == null) || (v.vp != null && v.vp > vpMin && v.vp < vpMax));

            if (!isHidden)
            {
                req = req.Where(v => v.IsHidden == false);
            }

            if (!withEmpty)
            {
                req = req.Where(t => t.Amount > 0);
            }

            if (term != "" && term != null)
            {
                req = req.Where(t => EF.Functions.Like(t.Name, $"{term}%"));
            }

            if (category != "" && category != null)
            {
                req = req.Where(t => t.Category == category);
            }

            if (creator != "" && creator != null)
            {
                req = req.Where(v => v.CreatorFull.Name == creator);
            }

            var items = await req
                .OrderBy(t => t.Name)
                .Skip(offset)
                .Take(limit)
                .AsNoTracking()
                .Include(t => t.Images)
                .Include(t => t.Tastes)!
                .ThenInclude(v => v.Taste)
                .ToListAsync();

            var count = await req
                .AsNoTracking()
                .CountAsync();

            return new PaginationResult<ProductModel>()
            {
                Items = items,
                TotalCount = count
            };
        }
    }
}
