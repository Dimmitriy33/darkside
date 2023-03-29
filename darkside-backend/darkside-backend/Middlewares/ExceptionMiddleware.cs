using darkside_backend.Models.ApiModels;
using System.Net;
using System.Text.Json;

namespace darkside_backend.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext, ILogger<ExceptionMiddleware> logger)
        {
            try
            {
                await _next(httpContext);
            }
            catch (InvalidDataException dataException)
            {
                await HandleExceptionAsync(logger, dataException, httpContext, HttpStatusCode.BadRequest, dataException.Message);
            }
            catch (UnauthorizedAccessException invalidCredentialsException)
            {
                await HandleExceptionAsync(logger, invalidCredentialsException, httpContext, HttpStatusCode.Unauthorized, invalidCredentialsException.Message);
            }
            catch (Exception exception)
            {
                await HandleExceptionAsync(
                    logger,
                    exception,
                    httpContext,
                    HttpStatusCode.InternalServerError,
                    exception.Message);
            }
        }

        private static Task HandleExceptionAsync(
            ILogger logger,
            Exception ex,
            HttpContext context,
            HttpStatusCode statusCode,
            string message = null)
        {
            logger.LogError("Exception occurred", ex);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var errorModel = new ErrorModel
            {
                statusCode = context.Response.StatusCode,
                errorMessage = message
            };

            var errorModelJson = JsonSerializer.Serialize(errorModel);

            return context.Response.WriteAsync(errorModelJson);
        }
    }
}
