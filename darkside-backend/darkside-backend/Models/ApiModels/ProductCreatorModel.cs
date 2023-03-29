namespace darkside_backend.Models.ApiModels
{
    public class ProductCreatorModel
    {
        public string Name { get; set; }
        public AddressModel Address { get; set; } = null;
        public string? Phone { get; set; }

        public ProductCreatorModel()
        {
        }

        public ProductCreatorModel(string name, AddressModel address, string phone)
        {
            Name = name;
            Address = address;
            Phone = phone;
        }
    }
}
