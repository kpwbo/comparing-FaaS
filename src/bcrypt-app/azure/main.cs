using System.Net;
using BCrypt.Net;

private static string SALT = BCrypt.Net.BCrypt.GenerateSalt(13);

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    dynamic data = await req.Content.ReadAsAsync<object>();
    string message = data?.message;
    if (message == null)
    {
        return req.CreateResponse(HttpStatusCode.BadRequest, "No message received!");
    }
    else {
        string hash = BCrypt.Net.BCrypt.HashPassword(message, SALT);
        return req.CreateResponse(HttpStatusCode.OK, hash);
    }
}
