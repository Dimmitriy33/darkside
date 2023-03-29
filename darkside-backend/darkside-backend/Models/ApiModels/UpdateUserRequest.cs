namespace darkside_backend.Models.ApiModels
{
    public class UpdateUserRequest
    {
        public UpdateUserRequest(string firstName, string lastName, string username, string email, string phone)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
