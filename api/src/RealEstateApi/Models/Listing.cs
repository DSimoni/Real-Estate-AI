using System.ComponentModel.DataAnnotations.Schema;

namespace RealEstateApi.Models
{
    public class Listing
    {
        [Column("id")]
    public int Id { get; set; }

    [Column("title")]
    public string Title { get; set; }

    [Column("link")]
    public string Link { get; set; }

    [Column("price")]
    public decimal? Price { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
}