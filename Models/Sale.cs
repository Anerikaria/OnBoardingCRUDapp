using System;
using System.Collections.Generic;

namespace OnBoardingDemo.Models
{
    public partial class Sale
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public int StoreId { get; set; }
        public DateTime? DateSold { get; set; }

        public virtual Customer Customers { get; set; } 
        public virtual Product Products { get; set; }
        public virtual Store Stores { get; set; } 
    }
}
