using Application.Interfaces;
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
        [HttpPost("send-newsletter")] //api/send-newsletter
        public async Task<IActionResult> SendNewsletter() {
            return HandleResult(await _mailService.SendNewsletterAsync());
        }

    }
}