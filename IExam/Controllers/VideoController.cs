using IExam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IExam.Controllers
{
    public class VideoController : Controller
    {
        private VideosDBEntities db = new VideosDBEntities();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string CreateVideo(Video newVideo)
        {
            try
            {
                int countOfDublicateVideo = db.Videos.Where(v => v.link == newVideo.link).Count();
                if (countOfDublicateVideo == 0)
                {
                    int id;
                    try
                    {
                        id = (int)(db.Videos.Max(v => v.ID) + 1);
                    }
                    catch (System.InvalidOperationException)
                    {
                        id = 0;
                    }
                    newVideo.ID = id;
                    db.Videos.Add(newVideo);
                    db.SaveChanges();
                    return "videoAddedSuccessfully";
                }
                else
                {
                    return "videoExists";
                }
            }
            catch (System.Exception)
            {
                return "unknownExeption";
            }
        }

        public ActionResult GetVideoElements()
        {
            return PartialView("_AllVideosElements", db.Videos.ToArray());
        }

        public ActionResult GetVideoPlayer(int id)
        {
            try
            {
                Video wantedVideo = db.Videos.Where(v => v.ID == id).ToArray()[0];
                return PartialView("_VideoPlayer", wantedVideo);
            }
            catch (System.IndexOutOfRangeException)
            {
                return PartialView("_VideoPlayer", null);
            }
        }

        public void DeleteVideo(int id)
        {
            Video video = db.Videos.Find(id);
            VideoCommentsEntities commentsDB = new VideoCommentsEntities();
            var commentsOfVideo = commentsDB.Comments.Where(c => c.link == video.link);
            foreach (var item in commentsOfVideo)
            {
                commentsDB.Comments.Remove(item);
            }

            db.Videos.Remove(video);
            commentsDB.SaveChanges();
            db.SaveChanges();
        }

        public ActionResult GetVideoComments(Video video)
        {
            VideoCommentsEntities commentsDB = new VideoCommentsEntities();
            var currentComments = commentsDB.Comments.Where(c => c.link == video.link).ToArray();
            return PartialView("_VideoComments", currentComments);
        }

        public string CreateVideoComment(Comment newComment)
        {
            try
            {
                VideoCommentsEntities commentsDB = new VideoCommentsEntities();
                try
                {
                    newComment.ID = (int)(commentsDB.Comments.Max(c => c.ID) + 1);
                }
                catch (System.InvalidOperationException)
                {
                    newComment.ID = 0;
                }
                commentsDB.Comments.Add(newComment);
                commentsDB.SaveChanges();
                return "CommentAddedSuccessfully";
            }
            catch (Exception)
            {
                return "UnspecifiedException";
            }
        }
	}
}