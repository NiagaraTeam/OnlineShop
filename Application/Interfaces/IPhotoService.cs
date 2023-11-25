using Application.Core;
using Domain;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoService
    {
        Task<Result<Photo>> AddPhoto(int productId, IFormFile file);
        Task<Result<object>> DeletePhoto(string photoId);
    }
}