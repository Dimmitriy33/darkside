using darkside_backend.Helpers;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;
using darkside_backend.Models.Enums;
using darkside_backend.Services.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace darkside_backend.Controllers
{
    [Route("api/purchase")]
    [ApiController]
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _purService;

        public PurchaseController(IPurchaseService purService)
        {
            _purService = purService ?? throw new ArgumentNullException(nameof(purService));
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreatePurchase(List<PurchaseItemCreateRequest> model)
        {
            var user = (UserModel)HttpContext.Items["User"]!;
            var response = await _purService.CreatePurchaseAsync(model, user.Username);

            return Ok(response);
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUserPurchases()
        {
            var user = (UserModel)HttpContext.Items["User"]!;
            var response = await _purService.GetUserPurchases(user.Id);

            return Ok(response);
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPurchases()
        {
            var user = (UserModel)HttpContext.Items["User"]!;

            if (user.Role != RolesEnum.admin)
            {
                return Forbid("Only for admins!");
            }

            var response = await _purService.GetAllPurchases();

            return Ok(response);
        }
    }
}
