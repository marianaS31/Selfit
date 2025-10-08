using Microsoft.EntityFrameworkCore;
using SelFit.Models.Auth;
using SelFit.Models.Orders;
using SelFit.Models.Product;
using SelFit.Models.Users;
using CustomerProfileModel = SelFit.Models.Users.CustomerProfileModel;

namespace SelFit.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<PasswordResetModel> PasswordReset { get; set; }
    public DbSet<SellerProfileModel> Sellers { get; set; }
    public DbSet<CustomerProfileModel> Customers { get; set; }
    public DbSet<ProductModel> Products { get; set; }
    public DbSet<OrderModel> Orders { get; set; }
    public DbSet<ProductMeasurementModel> ProductMeasurement { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure UserModel.UserID as an alternate key
        modelBuilder.Entity<UserModel>()
            .HasAlternateKey(u => u.UserID); // Allows searching users by UserID.

        //One-to-One UserModel and SellerProfileModel
        modelBuilder.Entity<UserModel>()
            .HasOne(u => u.Seller) // A User has one Seller
            .WithOne(s => s.User) // A Seller has one User
            .HasForeignKey<SellerProfileModel>(s => s.UserID) // Connects Seller to User
            .HasPrincipalKey<UserModel>(u => u.UserID) // Set UserID as the key
            .OnDelete(DeleteBehavior.Cascade);

        //One-to-One UserModel and CustomerProfileModel
        modelBuilder.Entity<UserModel>()
            .HasOne(u => u.Customer)
            .WithOne(c => c.User)
            .HasForeignKey<CustomerProfileModel>(c => c.UserID)
            .HasPrincipalKey<UserModel>(u => u.UserID)
            .OnDelete(DeleteBehavior.Cascade);

        // One-to-Many SellerProfileModel and ProductModel
        modelBuilder.Entity<SellerProfileModel>()
            .HasMany(s => s.Products)
            .WithOne(p => p.Seller)
            .HasForeignKey(p => p.SellerId)
            .HasPrincipalKey(p => p.UserID)
            .OnDelete(DeleteBehavior.Cascade);

        //One-to-One OrderModel and ProductModel (for a single product order)
        modelBuilder.Entity<OrderModel>()
            .HasOne(o => o.Product)
            .WithMany()
            .HasForeignKey(o => o.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        //One-to-One OrderModel and CustomerProfileModel
        modelBuilder.Entity<OrderModel>()
            .HasOne(o => o.Customer)
            .WithMany()
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        //One-to-One OrderModel and SellerProfileModel
        modelBuilder.Entity<OrderModel>()
            .HasOne(o => o.Seller)
            .WithMany(s => s.Orders)
            .HasForeignKey(o => o.SellerId)
            .HasPrincipalKey(s => s.UserID)
            .OnDelete(DeleteBehavior.Restrict);

        //One-to-Many ProductModel and ProductMeasurement
        modelBuilder.Entity<ProductModel>()
            .HasMany(p => p.Measurements)
            .WithOne(m => m.Product)
            .HasForeignKey(m => m.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}