namespace SelFit.Models.Auth;

public class PasswordResetModel
{
    public int Id { get; set; }
    public Guid UserID { get; set; }
    public string Email { get; set; }
    public string Code { get; set; }
    public string NewPassword { get; set; } = string.Empty;
    public DateTime DateExpires { get; set; }
    public bool IsValid { get; set; }
}