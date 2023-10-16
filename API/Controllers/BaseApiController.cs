using Application.Core;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api")]
    public class BaseApiController : ControllerBase
    {
        protected ActionResult HandleResult<T>(Result<T> result)
        {   
            if (result == null) 
                return NotFound();

            if (result.IsSucess && result.Value != null)
                return Ok(result.Value);

            if (result.IsSucess && result.Value == null)
                return NoContent();

            return BadRequest(result.Error);
        }
    }
}