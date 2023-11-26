using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{
    public class PhotoController : BaseApiController
    {
        private readonly IPhotoService _photoService;

        public PhotoController(IPhotoService photoService)
        {
            _photoService = photoService;
        }

        [HttpPost("product/{productId}/photo")] //api/product/productId/photo
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> Add(int productId, [FromForm] IFormFile file)
        {
            return HandleResult(await _photoService.AddPhoto(productId, file));
        }

        [HttpDelete("photos/{photoId}")] //api/photos/photoId
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> Delete(string photoId)
        {
            return HandleResult(await _photoService.DeletePhoto(photoId));
        }
    }
}