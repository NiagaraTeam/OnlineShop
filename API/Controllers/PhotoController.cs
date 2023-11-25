using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> Add(int productId, [FromForm] IFormFile file)
        {
            return HandleResult(await _photoService.AddPhoto(productId, file));
        }

        [HttpDelete("photos/{photoId}")] //api/photos/photoId
        public async Task<IActionResult> Delete(string photoId)
        {
            return HandleResult(await _photoService.DeletePhoto(photoId));
        }
    }
}