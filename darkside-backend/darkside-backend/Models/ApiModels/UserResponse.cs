using darkside_backend.Models.Entities;
using darkside_backend.Models.Enums;

namespace darkside_backend.Models.ApiModels
{
    public class UserResponse
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public float Balance { get; set; }
        public RolesEnum Role { get; set; }

        public ICollection<PurchaseModel>? Purchases { get; set; }

    }
}
