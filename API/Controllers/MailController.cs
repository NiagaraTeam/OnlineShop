using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{
    public class MailController : BaseApiController
    {
        private readonly IMailService _mailService;
        public MailController(IMailService mailService) {
            this._mailService = mailService;
        }
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        [HttpPost("send")] //api/send
        public async Task<IActionResult> SendMail() {
            return HandleResult(await _mailService.SendEmailAsync());
        }
    }
}