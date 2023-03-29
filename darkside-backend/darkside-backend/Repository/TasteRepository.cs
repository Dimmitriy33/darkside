using darkside_backend.Database;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace darkside_backend.Repository
{
    public class TasteRepository : Repository<ApplicationContext, TasteModel>, ITasteRepository
    {
        public TasteRepository(ApplicationContext dbContext) : base(dbContext)
        {
        }

        public async Task<TasteModel> GetTasteById(int id)
            => (await _dbContext.Tastes.FirstOrDefaultAsync(u => u.Id == id))!;
    }
}
