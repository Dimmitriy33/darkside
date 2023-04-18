using darkside_backend.Models.Enums;
using System.Linq.Expressions;

namespace darkside_backend.Repository.Abstractions
{
    public interface IRepository<T> where T : class
    {
        Task<T> CreateAsync(T item);
        Task<int> CountAsync(Expression<Func<T, bool>>? expression);
        Task<T> UpdateItemAsync(T item);
        Task DeleteAsync(Expression<Func<T, bool>> expression);
        Task<List<T>> GetAll();
        Task<List<T>> SortAndFilterItemsAsync<TKey>(
            Expression<Func<T, bool>> expression,
            Expression<Func<T, TKey>> sort,
            int limit,
            int offset,
            OrderType orderType = OrderType.Asc);
        Task<List<T>> AddRangeAsync(IEnumerable<T> items);
    }
}
