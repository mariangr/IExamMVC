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
            int index;
            try
            {
                index = (int)(testDB.Tests.Max(t => t.TestID) + 1);
            }
            catch (InvalidOperationException)
            {
                index = 0;
            }

            newTest.TestName = name;
            newTest.TestID = index;
            testDB.Tests.Add(newTest);
            testDB.SaveChanges();
        }

        public ActionResult GetTestQuestions(int id)
        {
            var questions = testDB.Questions.Where(t => t.TestID == id);
            IEnumerable<Question> tests;
            try
            {
                tests = questions.ToArray();
            }
            catch (ArgumentNullException)
            {
                tests = new List<Question>() { new Question() { QuestionID = -1, TestID = id } };
            }

                return PartialView("_Questions", tests);
        }

        public void DeleteTestQuestions(int id) {
            var questionToBeDeleted = testDB.Questions.Find(id);
            testDB.Questions.Remove(questionToBeDeleted);
            testDB.SaveChanges();
        }

        public void AddTestQuestions(Question newQuestion)
        {
            testDB.Questions.Add(newQuestion);
            testDB.SaveChanges();
        }

        public ActionResult Tests()
        {
            return View();
        }

        public ActionResult TestQuestions(int testId)
        {
            var testQuestions = testDB.Questions.Where(q => q.TestID == testId);
            ViewBag.TestName = testDB.Tests.Where(t => t.TestID == testId).First().TestName;
            return View(testQuestions.ToArray());
        }
	}
}