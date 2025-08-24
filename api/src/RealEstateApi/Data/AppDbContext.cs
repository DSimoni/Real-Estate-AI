
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Models;

namespace RealEstateApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Listing> Listings => Set<Listing>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
              foreach (var entity in modelBuilder.Model.GetEntityTypes())
    {
        foreach (var property in entity.GetProperties())
        {
            property.SetColumnName(property.GetColumnName().ToLower());
        }
    }
            modelBuilder.Entity<Listing>(entity =>
            {
                entity.ToTable("listings");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title)
                    .HasMaxLength(1024)
                    .IsRequired();

                entity.Property(e => e.Link)
                    .HasMaxLength(2048)
                    .IsRequired();

                entity.HasIndex(e => e.Link).IsUnique();

                entity.Property(e => e.Price)
                    .HasColumnType("numeric(10,2)");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}
