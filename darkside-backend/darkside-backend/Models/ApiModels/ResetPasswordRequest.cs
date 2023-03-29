using System.ComponentModel.DataAnnotations;

namespace darkside_backend.Models.ApiModels
{
    public class ResetPasswordRequest
    {
        [MinLength(6)]
        [MaxLength(18)]
        public string OldPassword { get; set; }

        [MinLength(6)]
        [MaxLength(18)]
        public string NewPassword { get; set; }
    }
}
