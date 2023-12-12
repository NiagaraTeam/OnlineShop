using Application.Dto.Photo;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<PhotoUploadResult> AddPhoto(IFormFile file, int width, int height);
        Task<string> DeletePhoto(string publicId);
    }
}