using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IExam.Models;
using IExam.Helpers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;


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
            IEnumerable<Question> testsQuestions;
            try
            {
                testsQuestions = questions.ToArray();
            }
            catch (ArgumentNullException)
            {
                testsQuestions = new List<Question>() { new Question() { QuestionID = -1, TestID = id } };
            }

            return PartialView("_Questions", testsQuestions);
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
            var usersTestsAnswersDB = new UsersTestAnswersDBContext();
            var questions = testDB.Questions.Where(q => q.TestID == testId);
            IEnumerable<Question> testQuestions;
            if (questions.Count() > 0)
            { 
                testQuestions = questions.ToArray();
            }
            else
            {
                testQuestions = null;
            }
            var userID = User.Identity.GetUserId();
            ViewBag.NumberOfTimesDone = "You have done this test: " + usersTestsAnswersDB.UsersTestAnswers.Where(t => t.TestID == testId && t.UserID == userID).Count() + " times";
            ViewBag.TestName = testDB.Tests.Where(t => t.TestID == testId).First().TestName;
            return View(testQuestions);
        }

        public JsonResult CheckAnswers(IEnumerable<TestAnswers> AllAnswers)
        {
            var usersTestsAnswersDB = new UsersTestAnswersDBContext();
            var userId = User.Identity.GetUserId();
            var testId = AllAnswers.First().TestID;

            int rightQuestions = 0;
            var questions = testDB.Questions.Where(q => q.TestID == testId);
            foreach (var answer in AllAnswers)
            {
                int currentQuestionId = answer.QuestionID;
                if (answer.SelectedAnswer == questions.Where(q => q.QuestionID == currentQuestionId).First().Answer)
                {
                    rightQuestions++;
                }
            }
                var newAnswer = new UsersTestAnswers();

                newAnswer.TestID = testId;
                newAnswer.UserID = userId;
                newAnswer.TestQuestionNumber = testDB.Questions.Where(t => t.TestID == testId).Count();
                newAnswer.TestRightQuestionsNumber = rightQuestions;
                usersTestsAnswersDB.UsersTestAnswers.Add(newAnswer);
                usersTestsAnswersDB.SaveChanges();


            return Json(newAnswer);
        }

	}

    public class TestAnswers
    {
        public int TestID { set; get; }
        public int QuestionID { set; get; }
        public string SelectedAnswer { set; get; }

    }
}