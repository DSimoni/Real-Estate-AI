using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;

namespace RealEstateApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AnalyticsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/analytics/prices
        [HttpGet("prices")]
        public async Task<IActionResult> GetPriceStats()
        {
            var prices = await _db.Listings
                .Where(l => l.Price.HasValue)
                .Select(l => l.Price.Value)
                .ToListAsync();

            if (!prices.Any()) return Ok(new { average = 0, min = 0, max = 0 });

            return Ok(new
            {
                average = prices.Average(),
                min = prices.Min(),
                max = prices.Max()
            });
        }

        // GET: /api/analytics/trends
        [HttpGet("trends")]
        public async Task<IActionResult> GetTrends()
        {
            var trend = await _db.Listings
                .GroupBy(l => l.CreatedAt.Date)
                .Select(g => new { date = g.Key, count = g.Count() })
                .OrderBy(g => g.date)
                .ToListAsync();

            return Ok(trend);
        }

        // GET: /api/analytics/top-locations
        [HttpGet("top-locations")]
        public async Task<IActionResult> GetTopLocations()
        {
            // If you have a 'location' column; else skip
            var topLocations = await _db.Listings
                .GroupBy(l => l.Title) // temporary example using title
                .Select(g => new { key = g.Key, count = g.Count() })
                .OrderByDescending(g => g.count)
                .Take(10)
                .ToListAsync();

            return Ok(topLocations);
        }
    }
}
