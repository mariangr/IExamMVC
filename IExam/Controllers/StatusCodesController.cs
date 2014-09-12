using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IExam.Controllers
{
    public class StatusCodesController : Controller
    {
        public ActionResult PageNotFound()
        {
            return View();
        }

        public ActionResult InternalServerError()
        {
            return View();
        }

        public ActionResult OK()
        {
            return View();
        }


	}
}