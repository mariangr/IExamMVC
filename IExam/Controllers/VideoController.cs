using IExam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Microsoft.Owin;
using Microsoft.AspNet;
using Microsoft.AspNet.Identity;

namespace IExam.Controllers
{
    [Authorize]
    public class VideoController : Controller
    {
        private IExamDBContext db = new IExamDBContext();

        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin, Moderator")]
        public ActionResult Create([Bind(Include = "name,link,ApplicationUserID")] Video newVideo)
        {
            WebClient client = new WebClient();
            newVideo.ApplicationUserID = User.Identity.GetUserId();
            try
            {
                string downloadString = client.DownloadString("http://gdata.youtube.com/feeds/api/videos/" + newVideo.link);
                int countOfDublicateVideo = db.Videos.Where(v => v.link == newVideo.link).Count();
                if (countOfDublicateVideo == 0)
                {
                    db.Videos.Add(newVideo);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                else
                {
                    throw new DuplicateWaitObjectException();
                }
            }
            catch (WebException)
            {
                //When the video doesn't exist
                newVideo.VideoID = -3;
                return View(newVideo);
            }
            catch (DuplicateWaitObjectException)
            {
                //When the video is already in the db
                newVideo.VideoID = -1;
                return View(newVideo);
            }
            catch (Exception)
            {
                //for unhandled exceptions
                newVideo.VideoID = -2;
                return View(newVideo);
            }
        }

        [AllowAnonymous]
        public JsonResult GetVideoElements()
        {
            return Json(db.Videos.ToArray(), JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        public ActionResult GetVideoPlayer(int id, string name)
        {
            try
            {
                Video wantedVideo = db.Videos.Where(v => v.VideoID == id).ToArray()[0];

                return PartialView("_VideoPlayer", wantedVideo);
            }
            catch (System.IndexOutOfRangeException)
            {
                return PartialView("_VideoPlayer", null);
            }
        }

        [Authorize(Roles = "Admin, Moderator")]
        public void DeleteVideo(int id)
        {
            Video video = db.Videos.Find(id);
            var commentsOfVideo = db.Comments.Where(c => c.link == video.link);
            foreach (var item in commentsOfVideo)
            {
                db.Comments.Remove(item);
            }

            db.Videos.Remove(video);
            db.SaveChanges();
        }

        [AllowAnonymous]
        public ActionResult GetVideoComments(Video video)
        {
            var currentComments = db.Comments.Where(c => c.link == video.link).ToArray();
            return PartialView("_VideoComments", currentComments);
        }

        public string CreateVideoComment(Comment newComment)
        {
            try
            {
                while (newComment.message != null && newComment.message.Substring(0, 1) == "\n")
                {
                    newComment.message = newComment.message.Substring(1);
                    if (newComment.message.Length == 0)
                    {
                        break;
                    }
                }
                if (newComment.message == null || newComment.message == "")
                {
                    throw new ArgumentNullException();
                }
                newComment.ApplicationUserID = User.Identity.GetUserId();
                db.Comments.Add(newComment);
                db.SaveChanges();
                return "CommentAddedSuccessfully";
            }
            catch (ArgumentNullException)
            {
                return "EmptyComment";
            }
            catch (Exception)
            {
                return "UnspecifiedException";
            }
        }

        public void DeleteVideoComment(int id)
        {
            try
            {
                var commentToBeDeleted = db.Comments.Find(id);
                db.Comments.Remove(commentToBeDeleted);
                db.SaveChanges();
            }
            catch (ArgumentNullException)
            {

            }
        }
    }
}