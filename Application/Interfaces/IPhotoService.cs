using Application.Core;
using Application.Dto.Photo;
using Domain;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoService
    {
        Task<Result<PhotoDto>> AddPhoto(int productId, IFormFile file);
        Task<Result<object>> DeletePhoto(string photoId);
    }
}