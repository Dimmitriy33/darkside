using darkside_backend.Models.Entities;

namespace darkside_backend.Repository.Abstractions
{
    public interface ITasteRepository : IRepository<TasteModel>
    {
        Task<TasteModel> GetTasteById(int id);
    }
}
