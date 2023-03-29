using darkside_backend.Helpers;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;
using darkside_backend.Models.Enums;
using darkside_backend.Services.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace darkside_backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest model)
        {
            var response = await _userService.Login(model);

            if (response == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest model)
        {
            var isValidEmail = _userService.ValidateEmail(model.Email);

            if (!isValidEmail)
                return BadRequest(new { message = "Invalid Email" });

            var response = await _userService.Register(model);

            if (response == null)
                return BadRequest(new { message = "User with provided credentials already exist!" });

            return Ok(response);
        }

        [HttpGet("info")]
        public async Task<IActionResult> GetUserInfo()
        {
            var user = (UserModel)HttpContext.Items["User"]!;
            var userResp = await _userService.GetUser(user.Username);

            return Ok(userResp);
        }

        [Authorize]
        [HttpPut("info")]
        public async Task<IActionResult> UpdateInfo(UpdateUserRequest model)
        {
            var user = (UserModel)HttpContext.Items["User"]!;
            var response = await _userService.UpdateUserInfo(user.Username, model);
            return Ok(response);
        }


        [Authorize]
        [HttpPut("balance")]
        public async Task<IActionResult> ChangeBalance(UserChangeBalanceRequest model)
        {
            var user = await _userService.GetUser(model.Username);

            if (user == null)
                return BadRequest(new { message = "User not exist!" });

            var response = await _userService.ChangeBalance(model.Username, model.Sum);
            return Ok(response);
        }

        [Authorize]
        [HttpPut("resetPass")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest model)
        {
            var user = (UserModel)HttpContext.Items["User"]!;
            var isChanged = await _userService.ResetPassword(user, model);

            if (!isChanged)
                return BadRequest(new { message = "Failed to change password" });

            return Ok();
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var user = (UserModel)HttpContext.Items["User"]!;

            if (user.Role != RolesEnum.admin)
            {
                return Forbid("Only for admins!");
            }

            var users = await _userService.GetAll();
            return Ok(users);
        }
    }
}
