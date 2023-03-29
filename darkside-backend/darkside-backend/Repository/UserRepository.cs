﻿using darkside_backend.Database;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace darkside_backend.Repository
{
    public class UserRepository : Repository<ApplicationContext, UserModel>, IUserRepository
    {
        public UserRepository(ApplicationContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<UserModel>> GetUsers()
        {
            var result = await _dbContext.Users
                .Include(v => v.Purchases)
                .ThenInclude(m => m.Items).ToListAsync();

            return result;
        }
        public async Task<UserModel> GetUserById(Guid id)
            => (await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id))!;

        public UserModel GetUserByIdSync(Guid id)
            => _dbContext.Users.FirstOrDefault(u => u.Id == id)!;

        public async Task<UserModel> GetUserByUsername(string username)
            => (await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username))!;

        public async Task<bool> IsNewUser(string username, string email, string phone)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username || u.Email == email || u.Phone == phone);
            return user == null;
        }

        public async Task<float> ChangeBalance(UserModel user, float sum)
        {
            user.Balance += sum;
            await UpdateItemAsync(user);

            return user.Balance;
        }

        public async Task<string?> GetNotUniqueField(string email, string phone, string prevEmail, string prevPhone)
        {
            if (email != "")
            {
                var userE = await _dbContext.Users.Where(u => u.Email == email).ToListAsync();

                if (userE.Count > 1 || (userE.Count > 0 && userE[0].Email != prevEmail))
                {
                    return "email";
                }
            }

            if (phone != "")
            {
                var userPh = await _dbContext.Users.Where(u => u.Phone == phone).ToListAsync();

                if (userPh.Count > 1 || (userPh.Count > 0 && userPh[0].Phone != prevPhone))
                {
                    return "phone";
                }
            }

            return null;
        }
    }
}
