using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using darkside_backend.Helpers.Settings;
using darkside_backend.Services.Abstractions;
using Microsoft.Extensions.Options;

namespace darkside_backend.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly CloudinarySettings _clSettings;
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinarySettings> clSettings)
        {
            _clSettings = clSettings.Value;
            _cloudinary = new Cloudinary(CloudinaryAccount)
            {
                Api =
                {
                    Secure = true
                }
            };
        }

        private Account CloudinaryAccount => new(
            _clSettings.CloudName,
            _clSettings.ApiKey,
            _clSettings.ApiSecret
        );

        public async Task<string> UploadImage(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0;

                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = _clSettings.DefaultCloudinaryFolder
                };

                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult.SecureUrl.AbsoluteUri;
        }
    }
}
