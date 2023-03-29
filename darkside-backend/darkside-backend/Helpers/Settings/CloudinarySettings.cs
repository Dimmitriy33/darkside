using System.ComponentModel.DataAnnotations;

namespace darkside_backend.Helpers.Settings
{
    public class CloudinarySettings
    {
        [Required]
        public string CloudName { get; set; }

        [Required]
        public string ApiKey { get; set; }

        [Required]
        public string ApiSecret { get; set; }

        public string DefaultCloudinaryFolder { get; set; }

        public void Validate()
            => Validator.ValidateObject(this, new ValidationContext(this), true);
    }
}
