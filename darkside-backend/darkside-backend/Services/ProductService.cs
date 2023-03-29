using AutoMapper;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;
using darkside_backend.Repository;
using darkside_backend.Repository.Abstractions;
using darkside_backend.Services.Abstractions;

namespace darkside_backend.Services
{
    public class ProductService : IProductService
    {
        private readonly ProductRepository _productRepo;
        private readonly ProductTasteRepository _productTasteRepo;
        private readonly ProductImageRepository _productImageRepo;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IMapper _mapper;

        public ProductService(
            IProductRepository productRepo,
            IProductTasteRepository productTasteRepo,
            IProductImageRepository productImageRepo,
            ICloudinaryService cloudService,
            IMapper mapper)
        {
            _productRepo = (ProductRepository?)productRepo;
            _productTasteRepo = (ProductTasteRepository?)productTasteRepo;
            _productImageRepo = (ProductImageRepository?)productImageRepo;
            _cloudinaryService = (CloudinaryService?)cloudService;
            _mapper = mapper;
        }

        public async Task<ProductModel> CreateProductAsync(ProductCreateRequest model)
        {
            var productInit = mapProductCreateReqToProductModel(model);

            productInit.ImageUrl = await _cloudinaryService.UploadImage(model.ImageUrl);
            var product = await _productRepo.CreateAsync(productInit);

            //images
            foreach (var image in model.Images)
            {
                var imgUrl = await _cloudinaryService.UploadImage(image);
                await _productImageRepo.CreateAsync(new ProductImagesModel()
                {
                    ImageUrl = imgUrl,
                    ProductId = product.Id
                });
            }

            // tastes
            var tastesIds = model.TastesId.ToList();

            foreach (var tasteId in tastesIds)
            {
                await _productTasteRepo.CreateAsync(new ProductTasteModel
                {
                    TasteId = tasteId,
                    ProductId = product.Id
                });
            }

            var prodResult = await _productRepo.GetProductByIdAsync(product.Id, true);
            return prodResult;
        }

        public async Task<ProductModel> UpdateProductAsync(ProductUpdateRequest model)
        {
            var prevProduct = await _productRepo.GetProductByIdAsync(model.Id, false);

            if (prevProduct == null)
                throw new ApplicationException("Product not found!");

            var product = mapProductUpdateReqToProductModel(model, prevProduct);
            var prodResult = await _productRepo.UpdateItemAsync(product);

            return prodResult;
        }

        public async Task<ProductModel> UpdateProductMainImageAsync(UpdateProductMainImageRequest model)
        {
            var product = await _productRepo.GetProductByIdAsync(model.Id, false);

            if (product == null)
                throw new ApplicationException("Product not found!");

            product.ImageUrl = await _cloudinaryService.UploadImage(model.ImageUrl);
            var newProw = await _productRepo.UpdateItemAsync(product);

            return newProw;
        }

        public async Task DeleteProductAsync(Guid id)
        {
            var product = await _productRepo.GetProductByIdAsync(id, false);

            if (product == null)
                throw new ApplicationException("Product not found!");

            await _productRepo.DeleteAsync(p => p.Id == id);
        }

        public async Task<ICollection<string>> GetCategories()
        {
            return await _productRepo.GetUniqueCategoriesAsync();
        }

        public async Task<List<ProductModel>> SearchProducts(string term, int limit, int offset)
        {
            return await _productRepo.SearchProducts(term, limit, offset);
        }

        public async Task UpdateTastes(UpdateTastesRequest model)
        {
            await _productTasteRepo.DeleteAsync(t => t.ProductId == model.ProductId);

            var newTastes =
                model.TastesIds
                    .Select(taste => new ProductTasteModel { ProductId = model.ProductId, TasteId = taste })
                    .ToList();

            await _productTasteRepo.AddRangeAsync(newTastes);
        }

        private ProductModel mapProductCreateReqToProductModel(ProductCreateRequest model)
        {
            var productInit = new ProductModel
            {
                Name = model.Name,
                CreatorFull = model.CreatorFull,
                Description = model.Description,
                Category = model.Category,
                Price = model.Price,
                Amount = model.Amount,
                length = model.length,
                width = model.width,
                height = model.height,
                weight = model.weight,
                strength = model.strength,
                capacity = model.capacity,
                vp = model.vp,
                IsHidden = model.IsHidden,
            };

            return productInit;
        }

        private ProductModel mapProductUpdateReqToProductModel(ProductUpdateRequest model, ProductModel prevProduct)
        {
            prevProduct.Name = model.Name;
            prevProduct.Category = model.Category;
            prevProduct.Description = model.Description;
            prevProduct.Price = model.Price;
            prevProduct.Amount = model.Amount;
            prevProduct.SalePerc = model.SalePerc;
            prevProduct.length = model.length;
            prevProduct.width = model.width;
            prevProduct.height = model.height;
            prevProduct.weight = model.weight;
            prevProduct.strength = model.strength;
            prevProduct.capacity = model.capacity;
            prevProduct.vp = model.vp;
            prevProduct.IsHidden = model.IsHidden;

            return prevProduct;
        }
    }
}
