using System.ComponentModel.DataAnnotations;

namespace darkside_backend.Models.Entities
{
    public class PurchaseModel
    {
        [Key]
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public UserModel User { get; set; }
        public float TotalPrice { get; set; }
        public ICollection<PurchaseItemModel> Items { get; set; }
    }
}
