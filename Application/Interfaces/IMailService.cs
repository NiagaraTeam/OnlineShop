using Application.Core;

namespace Application.Interfaces
{
    public interface IMailService
    {
        Task<Result<object>> SendNewsletterAsync();
    }
}