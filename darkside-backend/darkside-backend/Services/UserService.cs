using darkside_backend.Helpers.Settings;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;
using darkside_backend.Repository;
using darkside_backend.Repository.Abstractions;
using darkside_backend.Services.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace darkside_backend.Services
{
    public class UserService : IUserService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly UserRepository _userRepo;

        public UserService(IOptions<JwtSettings> jwtSettings, IUserRepository userRepo)
        {
            _jwtSettings = jwtSettings.Value;
            _userRepo = ((UserRepository?)userRepo)!;
        }

        public async Task<LoginResponse?> Login(LoginRequest model)
        {
            var user = await _userRepo.GetUserByUsername(model.Username);

            if (user == null)
                return null;

            if (!CheckPass(model.Password, user.Password))
            {
                return null;
            }

            // authentication successful so generate jwt token
            var token = GenerateJwtToken(user);

            return new LoginResponse(user, token);
        }

        public async Task<LoginResponse?> Register(RegisterRequest model)
        {
            var isValidEmail = ValidateEmail(model.Email);
            if (!isValidEmail)
                throw new InvalidDataException("Invalid Email");

            var isNew = await _userRepo.IsNewUser(model.Username, model.Email, model.Phone);

            if (!isNew) return null;

            var item = new UserModel
            {
                Username = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Phone = model.Phone,
                Password = GeneratePassword(model.Password)
            };

            var userRes = await _userRepo.CreateAsync(item);
            var token = GenerateJwtToken(userRes);

            return new LoginResponse(userRes, token);
        }

        public async Task<UserResponse> UpdateUserInfo(string username, UpdateUserRequest model)
        {
            var isValidEmail = ValidateEmail(model.Email);
            if (!isValidEmail)
                throw new InvalidDataException("Invalid Email");

            var user = await _userRepo.GetUserByUsername(username);

            if (user == null)
                throw new InvalidDataException("User not exist!");

            var dupl = await _userRepo.GetNotUniqueField(model.Email, model.Phone, user.Email, user.Phone);

            if (dupl != null)
                throw new InvalidDataException($"Not unique field {dupl}");

            user.Email = model.Email;
            user.Phone = model.Phone;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            var userRes = await _userRepo.UpdateItemAsync(user);

            return MapUserModelForResp(userRes);
        }

        public async Task<float> ChangeBalance(string username, float sum)
        {
            var user = await _userRepo.GetUserByUsername(username);

            if (sum < 0 && user.Balance < sum * -1)
            {
                throw new InvalidDataException("Not enough money");
            }

            var newBalance = await _userRepo.ChangeBalance(user, sum);

            return newBalance;
        }

        public async Task<bool> ResetPassword(UserModel user, ResetPasswordRequest model)
        {
            if (!CheckPass(model.OldPassword, user.Password))
                throw new InvalidDataException("Invalid Old Password");

            var hashedPass = GeneratePassword(model.NewPassword);
            user.Password = hashedPass;
            await _userRepo.UpdateItemAsync(user);

            return true;
        }

        public async Task<UserResponse> GetUser(string username)
        {
            var result = await _userRepo.GetUserByUsername(username);
            return MapUserModelForResp(result, false);
        }

        public async Task<List<UserResponse>> GetAll()
        {
            var result = await _userRepo.GetUsers();
            return result.Select(v => MapUserModelForResp(v, true)).ToList();
        }

        // helper methods

        private static string GeneratePassword(string pass)
        {
            var mySalt = BCrypt.Net.BCrypt.GenerateSalt();
            var myHash = BCrypt.Net.BCrypt.HashPassword(pass, mySalt);

            return myHash;
        }

        private static bool CheckPass(string pass, string hashPass)
        {
            var result = BCrypt.Net.BCrypt.Verify(pass, hashPass);
            return result;
        }

        private string GenerateJwtToken(UserModel user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                    RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    var domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException e)
            {
                return false;
            }
            catch (ArgumentException e)
            {
                return false;
            }

            try
            {
                return Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

        public UserResponse MapUserModelForResp(UserModel user, bool withPurchases = false)
        {
            var userResp = new UserResponse
            {
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                Balance = user.Balance,
            };

            if (withPurchases)
            {
                userResp.Purchases = user.Purchases;
            }

            return userResp;
        }
    }
}
