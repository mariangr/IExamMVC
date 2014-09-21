﻿using IExam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace IExam.Controllers
{
    public class VideoController : Controller
    {
        private VideoEntities db = new VideoEntities();

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
        public ActionResult Create([Bind(Include = "name,link")] Video newVideo)
        {
            int id;
            WebClient client = new WebClient();
            try
            {
                string downloadString = client.DownloadString("http://gdata.youtube.com/feeds/api/videos/" + newVideo.link);
                if (ModelState.IsValid)
                {

                    int countOfDublicateVideo = db.Videos.Where(v => v.link == newVideo.link).Count();
                    if (countOfDublicateVideo == 0)
                    {
                        id = (int)(db.Videos.Max(v => v.ID) + 1);
                        newVideo.ID = id;
                        db.Videos.Add(newVideo);
                        db.SaveChanges();
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        throw new DuplicateWaitObjectException();
                    }
                }
                return View(newVideo);
            }
            catch (WebException)
            {
                //When the video doesn't exist
                newVideo.ID = -3;
                return View(newVideo);
            }
            catch (DuplicateWaitObjectException)
            {
                //When the video is already in the db
                newVideo.ID = -1;
                return View(newVideo);
            }
            catch (InvalidOperationException)
            {
                //When there are no videos in the db (linq max exception)
                id = 0;
                newVideo.ID = id;
                db.Videos.Add(newVideo);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                //for unhandled exceptions
                newVideo.ID = -2;
                return View(newVideo);
            }
        }

        public JsonResult GetVideoElements()
        {
            return Json(db.Videos.ToArray(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetVideoPlayer(int id, string name)
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
            var commentsOfVideo = db.Comments.Where(c => c.link == video.link);
            foreach (var item in commentsOfVideo)
            {
                db.Comments.Remove(item);
            }

            db.Videos.Remove(video);
            db.SaveChanges();
            db.SaveChanges();
        }

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
                    if (newComment.message.Length == 0) {
                        break;
                    }
                }
                if (newComment.message == null || newComment.message == "")
                {
                    throw new ArgumentNullException();
                }
                newComment.ID = (int)(db.Comments.Max(c => c.ID) + 1);
                db.Comments.Add(newComment);
                db.SaveChanges();
                return "CommentAddedSuccessfully";
            }
            catch (ArgumentNullException)
            {
                return "EmptyComment";
            }
            catch (System.InvalidOperationException)
            {
                newComment.ID = 0;
                db.Comments.Add(newComment);
                db.SaveChanges();
                return "CommentAddedSuccessfully";
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
            catch (ArgumentNullException){ 
            
            }
        }
    }
}