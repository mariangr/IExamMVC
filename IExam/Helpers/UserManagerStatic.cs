using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using IExam.Models;

namespace IExam.Helpers
{
    public static class UserManagerStatic
    {
        public static UserManager<ApplicationUser> UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));

        public static string GetFullName(string userName)
        {
            UserManager<ApplicationUser> UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            var currentUser = UserManager.FindByName(userName);
            var fullName = currentUser.FirstName + " " + currentUser.LastName;
            if (fullName.Length > 1)
            {
                return fullName;
            }
            else
            {
                return currentUser.UserName;
            }
        }
    }
}