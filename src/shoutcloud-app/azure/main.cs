#r "Newtonsoft.Json"
using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    dynamic data = await req.Content.ReadAsAsync<object>();
    string message = data?.message;
    if (message == null)
    {
        return req.CreateResponse(HttpStatusCode.BadRequest, "No message received!");
    }
    else
    {
        try
        {
            string json = "{\"INPUT\":\"" + message + "\"}";
            Encoding encode = Encoding.GetEncoding("utf-8");
            byte[] bytes = encode.GetBytes(json);
            
            WebRequest request = HttpWebRequest.Create("http://API.SHOUTCLOUD.IO/V1/SHOUT");
            request.Method = "POST";
            request.ContentType = "application/json";
            using (Stream requestStream = request.GetRequestStream())
            {
                requestStream.Write(bytes, 0, bytes.Length);
            }
            
            StringBuilder result = new StringBuilder();
            using (HttpWebResponse response = (HttpWebResponse) request.GetResponse())
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    using (StreamReader responseReader = new StreamReader(response.GetResponseStream(), encode))
                    {
                        Char[] read = new Char[256];
                        int count = responseReader.Read(read, 0, 256);
                        while (count > 0)
                        {
                            result.Append(new String(read, 0, count));
                            count = responseReader.Read(read, 0, 256);
                        }
                    }
                }
                else
                {
                    return req.CreateResponse(HttpStatusCode.InternalServerError, "ShoutCloud did not return correctly.");
                }
            }
            var token = JObject.Parse(result.ToString());
            string output = (string)token.SelectToken("OUTPUT");
            return req.CreateResponse(HttpStatusCode.OK, output);
        }
        catch (Exception error)
        {
            return req.CreateResponse(HttpStatusCode.InternalServerError, error.ToString());
        }
    }
}
