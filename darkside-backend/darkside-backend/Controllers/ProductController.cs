using darkside_backend.Helpers;
using darkside_backend.Models.ApiModels;
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateRequest model)
        {
            var response = await _productService.CreateProductAsync(model);

            if (response == null)
                return BadRequest(new { message = "Failed to create product" });

            return Ok(response);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(ProductUpdateRequest model)
        {
            var response = await _productService.UpdateProductAsync(model);
            return Ok(response);
        }

        [HttpPut("image")]
        [Authorize]
        public async Task<IActionResult> UpdateProductMainImage([FromForm] UpdateProductMainImageRequest model)
        {
            var response = await _productService.UpdateProductMainImageAsync(model);
            return Ok(response);
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteProduct([FromQuery] Guid id)
        {
            await _productService.DeleteProductAsync(id);
            return Ok();
        }

        [HttpGet("categories")]
        [Authorize]
        public async Task<IActionResult> GetCategories()
        {
            var response = await _productService.GetCategories();

            return Ok(response);
        }

        [HttpPost("search")]
        [Authorize]
        public async Task<IActionResult> GetCategories([FromQuery] string? term, [BindRequired, FromQuery] int limit, [BindRequired, FromQuery] int offset)
        {
            var response = await _productService.SearchProducts(term, limit, offset);

            return Ok(response);
        }

        [HttpPut("taste")]
        [Authorize]
        public async Task<IActionResult> UpdateTastes(UpdateTastesRequest model)
        {
            await _productService.UpdateTastes(model);

            return Ok();
        }
    }
}
