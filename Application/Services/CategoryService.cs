using Application.Core;
using Application.Dto.Category;
using Application.Interfaces;
using AutoMapper;
using Domain.Enums;
using Persistence;

namespace Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CategoryService(
            DataContext context, 
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<object>> ChangeCategoryStatus(int categoryId, CategoryStatus newStatus)
        {
            //albert
            throw new NotImplementedException();
        }

        public async Task<Result<int>> Create(CategoryCreateUpdateDto category)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> Update(int categoryId, CategoryCreateUpdateDto category)
        {
            throw new NotImplementedException();
        }
    }
}