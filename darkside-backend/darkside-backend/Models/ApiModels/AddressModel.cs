namespace darkside_backend.Models.ApiModels
{
    public class AddressModel
    {
        public AddressModel(string street, string city, string postcode, string country)
        {
            Street = street;
            City = city;
            Postcode = postcode;
            Country = country;
        }

        public AddressModel()
        {
        }

        public string Street { get; set; }
        public string City { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
    }
}
