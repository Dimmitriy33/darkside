using darkside_backend.Models.Enums;
using System.Text.Json.Serialization;

namespace darkside_backend.Models.Entities
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public float Balance { get; set; }
        public RolesEnum Role { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        public ICollection<PurchaseModel> Purchases { get; set; }

    }
}
