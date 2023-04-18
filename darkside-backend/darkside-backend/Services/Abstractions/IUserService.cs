using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;

namespace darkside_backend.Services.Abstractions
{
    public interface IUserService
    {
        Task<LoginResponse?> Login(LoginRequest model);
        Task<LoginResponse?> Register(RegisterRequest model);
        Task<UserResponse> GetUser(string username);
        Task<PaginationResult<UserResponse>> GetAll(int limit, int offset, string? userTerm);
        bool ValidateEmail(string email);
        Task<bool> ResetPassword(UserModel user, ResetPasswordRequest model);
        Task<UserResponse> UpdateUserInfo(string username, UpdateUserRequest model);
        Task<float> ChangeBalance(string username, float sum);
    }
}
