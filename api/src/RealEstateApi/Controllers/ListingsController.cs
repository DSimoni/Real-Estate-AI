
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.Models;

namespace RealEstateApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListingsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ListingsController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/listings?page=1&pageSize=20&since=2025-08-01&maxPrice=120000&title=tirana
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Listing>>> Get(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? title = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] DateTime? since = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 200) pageSize = 20;

            var q = _db.Listings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(title))
            {
                var t = title.ToLower();
                q = q.Where(l => l.Title.ToLower().Contains(t));
            }

            if (maxPrice.HasValue)
            {
                q = q.Where(l => l.Price != null && l.Price <= maxPrice.Value);
            }

            if (since.HasValue)
            {
                q = q.Where(l => l.CreatedAt >= since.Value);
            }

            q = q.OrderByDescending(l => l.CreatedAt);

            var data = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return Ok(data);
        }

        // GET /api/listings/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Listing>> GetById(int id)
        {
            var item = await _db.Listings.FindAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        // GET /api/listings/search?title=apartment&maxPrice=100000
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Listing>>> Search([FromQuery] string? title, [FromQuery] decimal? maxPrice)
        {
            var q = _db.Listings.AsQueryable();

            if (!string.IsNullOrEmpty(title))
                q = q.Where(l => l.Title.ToLower().Contains(title.ToLower()));

            if (maxPrice.HasValue)
                q = q.Where(l => l.Price != null && l.Price <= maxPrice.Value);

            var results = await q.OrderByDescending(l => l.CreatedAt).Take(100).ToListAsync();
            return Ok(results);
        }
    }
}
