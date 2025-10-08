namespace SelFit.Responses;

public class LoginResponse
{
    public string Message { get; set; }
    public string Token { get; set; }
    public Guid UserID { get; set; }
}