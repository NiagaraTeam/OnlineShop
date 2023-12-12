using Application.Core;
using Application.Dto.Photo;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IPhotoAccessor _photoAccessor;

        public PhotoService(
            DataContext context,
            IMapper mapper, 
            IPhotoAccessor photoAccessor)
        {
            _photoAccessor = photoAccessor;
            _mapper = mapper;
            _context = context;
        }
        public async Task<Result<PhotoDto>> AddPhoto(int productId, IFormFile file)
        {
            // znalezienie produktu
            var product = _context.Products
                .Include(p => p.Photo)
                .Where(p => p.Id == productId)
                .FirstOrDefault();

            if (product == null)
                return null;

            // utworzenie zdjęcia
            var photoUploadResult = await _photoAccessor.AddPhoto(file);

            var photo = new Photo
            {
                UrlLarge = photoUploadResult.Url,
                UrlSmall = photoUploadResult.Url,
                Id = photoUploadResult.PublicId
            };

            // usunięcie starego zdjęcia
            var deleteResult = await DeletePhoto(product.Photo.Id);

            if (!deleteResult.IsSucess)
                return Result<PhotoDto>.Failure(deleteResult.Error);

            // dodanie nowego zdjęcia do produktu
            product.Photo = photo;

            // zapisanie zmian
            var result = await _context.SaveChangesAsync() > 0;

            // zwrócenie wyniku
            var photoDto = _mapper.Map<PhotoDto>(photo);

            if (result) return Result<PhotoDto>.Success(photoDto);

                return Result<PhotoDto>.Failure("Problem adding photo");
        }

        public async Task<Result<object>> DeletePhoto(string photoId)
        {
            // znalezienie obrazu
            var photo = _context.Photos
                .FirstOrDefault(x => x.Id == photoId);

            if (photo == null) 
                return null;

            // usunięcię obrazu z Cloudinary
            var result = await _photoAccessor.DeletePhoto(photo.Id);

            if (result == null) 
                return Result<object>.Failure("Problem deleteing photo from Cloudinary");

            // usunięcie obrazu z bazy
            var product = _context.Products.FirstOrDefault(p => p.PhotoId == photo.Id);

            if (product != null)
                product.Photo = null;

            _context.Photos.Remove(photo);

            // zapisanie zmian
            var success = await _context.SaveChangesAsync() > 0;

            // zwrócenie wyniku
            if (success) return Result<object>.Success(null);

            return Result<object>.Failure("Problem deleteing photo from API");
        }
    }
}