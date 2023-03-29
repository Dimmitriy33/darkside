namespace darkside_backend.Models.ApiModels
{
    public class ErrorModel
    {
        public ErrorModel()
        {
        }

        public ErrorModel(string message) : this()
        {
            message = message;
        }

        public ErrorModel(int statusCode, string message) : this(message)
        {
            statusCode = statusCode;
        }

        public int statusCode { get; set; }

        public string errorMessage { get; set; }
    }
}
