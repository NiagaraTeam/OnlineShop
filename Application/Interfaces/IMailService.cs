using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;

namespace Application.Interfaces
{
    public interface IMailService
    {
        Task<Result<object>> SendEmailAsync();
    }
}