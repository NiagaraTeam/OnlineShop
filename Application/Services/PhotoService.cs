using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IUserAccessor _userAccessor;
        public PhotoService(
            DataContext context,
            IMapper mapper, 
            IPhotoAccessor photoAccessor, 
            IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _photoAccessor = photoAccessor;
            _mapper = mapper;
            _context = context;
        }
        public async Task<Result<Photo>> AddPhoto(int productId, IFormFile file)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> DeletePhoto(string photoId)
        {
            throw new NotImplementedException();
        }
    }
}