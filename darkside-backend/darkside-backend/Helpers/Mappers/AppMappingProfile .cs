using AutoMapper;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;

namespace darkside_backend.Helpers.Mappers
{
    public class AppMappingProfile : Profile
    {
        public AppMappingProfile()
        {
            CreateMap<ProductCreateRequest, ProductModel>().ReverseMap();
            CreateMap<TasteModel, TasteResponse>().ReverseMap();
        }
    }
}
