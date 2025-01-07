using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class CustomerManagement
{
    private readonly YourDbContext db;

    public CustomerManagement(YourDbContext context)
    {
        db = context;
    }

    private List<Customer> CreateCustomerQuery(string field, string value)
    {
        var query =
            from customer in db.Customers
            where customer.GetType().GetProperty(field).GetValue(c, null).ToString().Contains(value)
            orderby customer.CustomerID ascending
            select customer;

        return query.ToList();
    }

    public List<Customer> SearchByCountry(string country)
    {
        return CreateCustomerQuery("Country", country);
    }

    public List<Customer> SearchByCompanyName(string company)
    {
        return CreateCustomerQuery("CompanyName", company);
    }

    public List<Customer> SearchByContact(string contact)
    {
        return CreateCustomerQuery("ContactName", contact);
    }

    private string GenerateCSV(List<Customer> customerData)
    {
        StringBuilder sb = new StringBuilder();

        foreach (var customer in customerData)
        {
            sb.AppendFormat("{0},{1},{2},{3}", customer.CustomerID, customer.CompanyName, customer.ContactName, customer.Country);
            sb.AppendLine();
        }

        return sb.ToString();
    }

    public string ExportToCSV(List<Customer> customerData)
    {
        return GenerateCSV(customerData);
    }
}