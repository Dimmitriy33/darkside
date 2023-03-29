using AutoMapper;
using darkside_backend.Models.ApiModels;
using darkside_backend.Models.Entities;
using darkside_backend.Repository;
using darkside_backend.Repository.Abstractions;
using darkside_backend.Services.Abstractions;

namespace darkside_backend.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly PurchaseItemRepository _purItemRepo;
        private readonly PurchaseRepository _purRepo;
        private readonly ProductRepository _prodRepo;
        private readonly UserRepository _userRepo;
        private readonly IMapper _mapper;

        public PurchaseService(IMapper mapper, IPurchaseRepository purRepo, IPurchaseItemRepository purItemRepo,
            IProductRepository prodRepo, IUserRepository userRepo)
        {
            _purRepo = (PurchaseRepository)purRepo;
            _purItemRepo = (PurchaseItemRepository)purItemRepo;
            _prodRepo = (ProductRepository)prodRepo;
            _userRepo = (UserRepository)userRepo;
            _mapper = mapper;
        }

        public async Task<PurchaseCreateResponse> CreatePurchaseAsync(List<PurchaseItemCreateRequest> model,
            string username)
        {
            var user = await _userRepo.GetUserByUsername(username);
            var purchases = new List<PurchaseItemModel>();
            var products = new List<PurchaseItemCreateResponse>();

            foreach (var purchase in model)
            {
                var product = await _prodRepo.GetProductByIdAsync(purchase.ProductId, false);
                var saleIdx = (float)(product.SalePerc != null ? 1 - product.SalePerc / 100 : 1);
                purchases.Add(new PurchaseItemModel
                {
                    Count = purchase.Count,
                    Price = product.Price * purchase.Count * saleIdx,
                    ProductId = purchase.ProductId,
                });

                products.Add(new PurchaseItemCreateResponse()
                {
                    Product = product,
                    Count = purchase.Count
                });
            }

            var totalPrice = purchases.Select(v => v.Price).Sum();

            if (totalPrice > user.Balance)
            {
                throw new ApplicationException("Nor enough money! Please top up your balance");
            }

            var pur = await _purRepo.CreateAsync(new PurchaseModel
            {
                Date = DateTime.Now,
                UserId = user.Id
            });

            foreach (var purchase in purchases)
            {
                await _purItemRepo.CreateAsync(new PurchaseItemModel()
                {
                    Count = purchase.Count,
                    Price = purchase.Price,
                    ProductId = purchase.ProductId,
                    PurchaseId = pur.Id
                });

            }

            return new PurchaseCreateResponse
            {
                Items = products,
                TotalPrice = totalPrice
            };
        }

        public async Task<List<PurchaseModel>> GetUserPurchases(Guid id)
        {
            return await _purRepo.GetUserPurchases(id);
        }

        public async Task<List<PurchaseModel>> GetAllPurchases()
        {
            return await _purRepo.GetAllPurchases();
        }
    }
}
