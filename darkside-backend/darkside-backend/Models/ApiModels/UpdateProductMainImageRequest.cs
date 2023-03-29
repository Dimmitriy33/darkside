using darkside_backend.Helpers;
using System.ComponentModel.DataAnnotations;

namespace darkside_backend.Models.ApiModels
{
    public class UpdateProductMainImageRequest
    {
        public Guid Id { get; set; }

        [Required]
        [FormFileSize(1, 10485760)]
        public IFormFile ImageUrl { get; set; }
    }
}
