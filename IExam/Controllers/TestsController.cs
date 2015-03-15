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
        //private IExamDBContext IExamDB = new IExamDBContext();
        //
        // GET: /Tests/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTestData()
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                return Json(IExamDB.Tests.ToArray(), JsonRequestBehavior.AllowGet);
            }
        }

        public void DeleteTest(int id)
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                Test test = IExamDB.Tests.Find(id);
                var TestQuestions = IExamDB.Questions.Where(q => q.TestID == id);
                foreach (var question in TestQuestions)
                {
                    IExamDB.Questions.Remove(question);
                }
                IExamDB.Tests.Remove(test);
                IExamDB.SaveChanges();
            }
        }

        [Authorize(Roles = "Admin, Moderator")]
        public void CreateTest(string name) 
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                Test newTest = new Test();
                newTest.ApplicationUserID = User.Identity.GetUserId();
                newTest.TestName = name;
                IExamDB.Tests.Add(newTest);
                IExamDB.SaveChanges();
            }
        }

        public ActionResult GetTestQuestions(int id)
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                var questions = IExamDB.Questions.Where(t => t.TestID == id);
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
        }

        [Authorize(Roles = "Admin, Moderator")]
        public void DeleteTestQuestions(int id) 
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                var questionToBeDeleted = IExamDB.Questions.Find(id);
                IExamDB.Questions.Remove(questionToBeDeleted);
                IExamDB.SaveChanges();
            }
        }

        public void AddTestQuestions(Question newQuestion)
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                IExamDB.Questions.Add(newQuestion);
                IExamDB.SaveChanges();
            }
        }

        public ActionResult Tests()
        {
            return View();
        }

        public ActionResult TestQuestions(int testId)
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                var questions = IExamDB.Questions.Where(q => q.TestID == testId);
                IEnumerable<Question> testQuestions = new List<Question>();
                if (questions.Count() > 0)
                {
                    testQuestions = questions.ToArray();
                    ViewBag.TestID = testQuestions.First().TestID;
                }
                var userID = User.Identity.GetUserId();
                var testName = IExamDB.Tests.Find(testId).TestName;
                ViewBag.TestName = testName;
                return View(testQuestions);
            }
        }

        public JsonResult CheckAnswers(IEnumerable<TestAnswers> AllAnswers)
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                var userId = User.Identity.GetUserId();
                var testId = AllAnswers.First().TestID;

                int rightQuestions = 0;
                var questions = IExamDB.Questions.Where(q => q.TestID == testId);
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
                newAnswer.ApplicationUserID = userId;
                newAnswer.TestQuestionNumber = IExamDB.Questions.Where(t => t.TestID == testId).Count();
                newAnswer.TestRightQuestionsNumber = rightQuestions;
                IExamDB.UsersTestAnswers.Add(newAnswer);
                IExamDB.SaveChanges();


                return Json(newAnswer);
            }
        }

        public JsonResult GetNumberOfTimesTestDone(int testID)
        {
            using (IExamDBContext IExamDB = new IExamDBContext())
            {
                var userID = User.Identity.GetUserId();
                var NumberOfTimesDone = "You have done this test: " + IExamDB.UsersTestAnswers.Where(t => t.TestID == testID && t.ApplicationUserID == userID).Count() + " times";
                return Json(new { NumberOfTimesDone = NumberOfTimesDone }, JsonRequestBehavior.AllowGet);
            }
        }

	}

    public class TestAnswers
    {
        public int TestID { set; get; }
        public int QuestionID { set; get; }
        public string SelectedAnswer { set; get; }

    }
}