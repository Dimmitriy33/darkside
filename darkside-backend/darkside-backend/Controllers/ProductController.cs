using darkside_backend.Helpers;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;
using darkside_backend.Models.Enums;
using darkside_backend.Services.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace darkside_backend.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
        }

        [HttpGet]
        public async Task<IActionResult> GetProduct([FromQuery] string id)
        {
            var response = await _productService.GetProductByIdAsync(id);

            if (response == null)
                return BadRequest(new { message = "Failed to fetch product" });

            return Ok(response);
        }

        [HttpPost("list")]
        public async Task<IActionResult> GetProductsByIds([FromBody] string[] ids)
        {
            var response = await _productService.GetProductsByIdsAsync(ids);

            if (response == null)
                return BadRequest(new { message = "Failed to get products" });

            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateRequest model)
        {
            var user = (UserModel)HttpContext.Items["User"]!;

            if (user.Role != RolesEnum.admin)
            {
                return Forbid("Only for admins!");
            }

            var response = await _productService.CreateProductAsync(model);

            if (response == null)
                return BadRequest(new { message = "Failed to create product" });

            return Ok(response);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(ProductUpdateRequest model)
        {
            var user = (UserModel)HttpContext.Items["User"]!;

            if (user.Role != RolesEnum.admin)
            {
                return Forbid("Only for admins!");
            }

            await _productService.UpdateTastes(new UpdateTastesRequest()
            {
                ProductId = model.Id,
                TastesIds = model.TastesIds
            });

            var response = await _productService.UpdateProductAsync(model);
            return Ok(response);
        }

        [HttpPut("image")]
        [Authorize]
        public async Task<IActionResult> UpdateProductMainImage([FromForm] UpdateProductMainImageRequest model)
        {
            var user = (UserModel)HttpContext.Items["User"]!;

            if (user.Role != RolesEnum.admin)
            {
                return Forbid("Only for admins!");
            }

            var response = await _productService.UpdateProductMainImageAsync(model);
            return Ok(response);
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteProduct([FromQuery] Guid id)
        {
            var user = (UserModel)HttpContext.Items["User"]!;

            if (user.Role != RolesEnum.admin)
            {
                return Forbid("Only for admins!");
            }

            await _productService.DeleteProductAsync(id);
            return Ok();
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var response = await _productService.GetCategories();
            return Ok(response);
        }

        [HttpGet("creators")]
        public async Task<IActionResult> GetCreators()
        {
            var response = await _productService.GetCreators();
            return Ok(response);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [BindRequired, FromQuery] int limit,
            [BindRequired, FromQuery] int offset,
            [FromQuery] string? term,
            [FromQuery] string? category,
            [FromQuery] string? creator,
            [FromQuery] int priceMin = 0,
            [FromQuery] int priceMax = int.MaxValue,
            [FromQuery] int vpMin = 0,
            [FromQuery] int vpMax = int.MaxValue
            )
        {
            var user = (UserModel)HttpContext.Items["User"];
            var response = await _productService.SearchProducts(term, limit, offset, category, creator, priceMin, priceMax, vpMin, vpMax, user is
            {
                Role: RolesEnum.admin
            }, user is { Role: RolesEnum.admin });

            return Ok(response);
        }

        [HttpPut("taste")]
        [Authorize]
        public async Task<IActionResult> UpdateTastes(UpdateTastesRequest model)
        {

            var user = (UserModel)HttpContext.Items["User"]!;

            if (user.Role != RolesEnum.admin)
            {
                return Forbid("Only for admins!");
            }
            await _productService.UpdateTastes(model);

            return Ok();
        }
    }
}
