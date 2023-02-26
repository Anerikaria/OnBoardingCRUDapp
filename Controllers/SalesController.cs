using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnBoardingDemo.Models;
using Microsoft.EntityFrameworkCore;
using OnBoardingDemo.Data;


namespace OnBoardingDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly OnboardingDbContext _context;
        public SalesController(OnboardingDbContext context)
        {
            _context = context;
        }

        // GET: api/Sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
        {
            List<Sale> SalesList = await _context.Sales.ToListAsync();
            List<SaleDto> salesDtoList = new List<SaleDto>();
            foreach (Sale sale in SalesList)
            {
                SaleDto saleDto = new SaleDto();
                var customer = await _context.Customers.FindAsync(sale.CustomerId);
                var store = await _context.Stores.FindAsync(sale.StoreId);
                var product = await _context.Products.FindAsync(sale.ProductId);
                saleDto.Id = sale.Id;
                saleDto.CustomerName = customer?.Name;
                saleDto.CustomerId = customer.Id;
                saleDto.StoreName = store?.Name;
                saleDto.StoreId = store.Id;
                saleDto.ProductName = product?.Name;
                saleDto.ProductId = product.Id;
                saleDto.DateSold = (DateTime)sale.DateSold;
                salesDtoList?.Add(saleDto);
            }
            return salesDtoList;
        }
        // GET: api/Sales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
      {
            var sale = await _context.Sales.FindAsync(id);
            SaleDto saleDto = new SaleDto();
            var customer = await _context.Customers.FindAsync(sale?.CustomerId);
            var store = await _context.Stores.FindAsync(sale?.StoreId);
            var product = await _context.Products.FindAsync(sale?.ProductId);
            saleDto.Id = sale.Id;
            saleDto.CustomerId = customer.Id;
            saleDto.StoreId = store.Id;
            saleDto.ProductId = product.Id;
            saleDto.DateSold = (DateTime)sale.DateSold;
            if (sale == null)
            {
                return NotFound();
            }
            return saleDto;
        }
        // PUT: api/Sales/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSale(int id, SaleDto saleDto)
        {
            Sale sale = await _context.Sales.FindAsync(id) ;
            if (sale == null)
            {
                return NotFound();
            }
            sale.ProductId = saleDto.ProductId;
            sale.CustomerId = saleDto.CustomerId;
            sale.StoreId = saleDto.StoreId;
            sale.DateSold = saleDto.DateSold;
            _context.Entry(sale).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }
        // POST: api/Sales
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sale>> PostSale(SaleDto saleDto)
        {
            Sale sale = new Sale();
            sale.ProductId = saleDto.ProductId;
            sale.CustomerId = saleDto.CustomerId;
            sale.StoreId = saleDto.StoreId;
            sale.DateSold = saleDto.DateSold;
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSale", new { id = sale.Id }, sale);
        }
        // DELETE: api/Sales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return NotFound();
            }
            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private bool SaleExists(int id)
        {
            return _context.Sales.Any(e => e.Id == id);
        }
    }
}

