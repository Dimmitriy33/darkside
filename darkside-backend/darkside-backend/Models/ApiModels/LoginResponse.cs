using darkside_backend.Models.Entities;
using darkside_backend.Models.Enums;

namespace darkside_backend.Models.ApiModels
{
    public class LoginResponse
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public float Balance { get; set; }

        public RolesEnum Role { get; set; }
        public string Token { get; set; }


        public LoginResponse(UserModel user, string token)
        {
            FirstName = user.FirstName;
            LastName = user.LastName;
            Username = user.Username;
            Balance = user.Balance;
            Email = user.Email;
            Phone = user.Phone;
            Role = user.Role;
            Token = token;
        }
    }
}
