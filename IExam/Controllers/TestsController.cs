using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IExam.Models;

namespace IExam.Controllers
{
    [Authorize]
    public class TestsController : Controller
    {
        private TestsDBContext testDB = new TestsDBContext();
        //
        // GET: /Tests/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTestData()
        {
            return Json(testDB.Tests.ToArray(), JsonRequestBehavior.AllowGet);
        }

        public void DeleteTest(int id)
        {
            Test test = testDB.Tests.Find(id);
            var TestQuestions = testDB.Questions.Where(q => q.TestID == id);
            foreach(var question in TestQuestions)
            {
                testDB.Questions.Remove(question);
            }
            testDB.Tests.Remove(test);
            testDB.SaveChanges();
        }

        public void CreateTest(string name) {
            Test newTest = new Test();
            int index = 0;
            try
            {
                index = (int)(testDB.Tests.Max(t => t.TestID) + 1);
            }
            catch (InvalidOperationException)
            { 
                
            }
            newTest.TestName = name;
            newTest.TestID = index;
            testDB.Tests.Add(newTest);
            testDB.SaveChanges();
        }
	}
}