using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IExam.Models;

namespace IExam.Controllers
{
    public class HomeController : Controller
    {
        private IExamDBContext db = new IExamDBContext();
        public ActionResult Index()
        {

            return View();
        }

        public ActionResult ReturnPartialView(string pageName)
        {
            return PartialView(pageName);
        }
	}
}