using darkside_backend.Models.Entities;

namespace darkside_backend.Repository.Abstractions
{
    public interface IUserRepository : IRepository<UserModel>
    {
        Task<List<UserModel>> GetUsers();
        Task<UserModel> GetUserById(Guid id);
        UserModel GetUserByIdSync(Guid id);
        Task<UserModel> GetUserByUsername(string username);
        Task<bool> IsNewUser(string username, string email, string phone);
        Task<string?> GetNotUniqueField(string email, string phone, string prevEmail, string prevPhone);
        Task<float> ChangeBalance(UserModel user, float sum);
    }
}
