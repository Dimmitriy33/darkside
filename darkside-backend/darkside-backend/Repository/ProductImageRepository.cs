using darkside_backend.Database;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;

namespace darkside_backend.Repository
{
    public class ProductImageRepository : Repository<ApplicationContext, ProductImagesModel>, IProductImageRepository
    {
        public ProductImageRepository(ApplicationContext dbContext) : base(dbContext)
        {
        }
    }
}
