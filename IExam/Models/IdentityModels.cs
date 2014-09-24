using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IExam.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(20)]
        public string FirstName { set; get; }

        [MaxLength(20)]
        public string LastName { set; get; }

        [MaxLength(10)]
        public string FN { get; set; }

        [MaxLength(20)]
        public string IdentityNumber { set; get; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("IExamProjectDataBase")
        {
        }
    }
}