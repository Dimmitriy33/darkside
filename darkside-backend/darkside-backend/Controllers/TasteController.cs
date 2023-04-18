using AutoMapper;
using darkside_backend.Helpers;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;
using darkside_backend.Repository.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace darkside_backend.Controllers
{
    [Route("api/taste")]
    [ApiController]
    public class TasteController : ControllerBase
    {
        private readonly ITasteRepository _tasteRepo;
        private readonly IMapper _mapper;

        public TasteController(ITasteRepository tasteRepo, IMapper mapper)
        {
            _tasteRepo = tasteRepo ?? throw new ArgumentNullException(nameof(tasteRepo));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetAllTastes()
        {
            var tastes = await _tasteRepo.GetAll();
            var result = tastes.Select(v => new TasteResponse()
            {
                Id = v.Id,
                Name = v.Name,
            });

            return Ok(result);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateTastes(string[] tastes)
        {
            var tasteModels = tastes.Select(taste => new TasteModel { Name = taste }).ToList();
            var result = await _tasteRepo.AddRangeAsync(tasteModels);

            var resp = result.Select(v => new TasteResponse()
            {
                Id = v.Id,
                Name = v.Name,
            });

            return Ok(resp);
        }

        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> UpdateTaste(TasteResponse taste)
        {
            var result = await _tasteRepo.UpdateItemAsync(new TasteModel()
            {
                Id = taste.Id,
                Name = taste.Name,
            });

            return Ok(new TasteResponse
            {
                Id = result.Id,
                Name = result.Name,
            });
        }

        [HttpPut("delete")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var taste = await _tasteRepo.GetTasteById(id);

            if (taste is null)
            {
                return BadRequest(new { message = "Invalid Taste" });
            }

            await _tasteRepo.DeleteAsync(t => t.Id == id);

            return Ok();
        }
    }
}
