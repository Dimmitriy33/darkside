using System.ComponentModel.DataAnnotations;

namespace darkside_backend.Models.ApiModels
{
    public class RegisterRequest
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [MinLength(4)]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Phone { get; set; }
        [MinLength(6)]
        [MaxLength(18)]
        public string Password { get; set; }
    }
}
