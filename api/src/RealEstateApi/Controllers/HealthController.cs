
using Microsoft.AspNetCore.Mvc;

namespace RealEstateApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok(new { status = "ok", time = DateTime.UtcNow });
    }
}
