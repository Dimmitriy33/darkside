namespace darkside_backend.Services.Abstractions
{
    public interface ICloudinaryService
    {
        Task<string> UploadImage(IFormFile file);
    }
}
