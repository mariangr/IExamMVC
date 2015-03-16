using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using IExam.Models;
using System.IO;
using IExam.Helpers;

namespace IExam.Controllers
{
    

    [Authorize]
    public class AccountController : Controller
    {
        public AccountController()
            : this(new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext())))
        {
        }

        public AccountController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        public UserManager<ApplicationUser> UserManager { get; private set; }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl = "")
        {
            if (User.Identity.IsAuthenticated)
            {
                
                return View();
            }
            else
            {
                ViewBag.ReturnUrl = returnUrl;
                return View();
            }
        }
        #region Login and Register
        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindAsync(model.UserName, model.Password);
                if (user != null)
                {
                    await SignInAsync(user, model.RememberMe);
                    return RedirectToLocal(returnUrl);
                }
                else
                {
                    ModelState.AddModelError("", "Invalid username or password.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                if (db.Roles.Count() == 0)
                {
                    db.Roles.Add(new IdentityRole() { Id = "Admin", Name = "Admin" });
                    db.Roles.Add(new IdentityRole() { Id = "Moderator", Name = "Moderator" });
                    db.Roles.Add(new IdentityRole() { Id = "User", Name = "User" });
                    db.SaveChanges();
                }
            }
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser() { 
                    UserName = model.UserName, 
                    FirstName = model.FirstName, 
                    LastName = model.LastName, 
                    FN = model.FN, 
                    IdentityNumber = model.IdentityNumber,
                    ProfilePicture = "~/Content/images/DefaultProfilePicture.png"
                };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    
                    var registeredUser = UserManager.FindByName(model.UserName);
                    UserManager.AddToRole(registeredUser.Id, "Admin");
                    await SignInAsync(user, isPersistent: false);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    AddErrors(result);
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }
        #endregion

        //
        // POST: /Account/Disassociate
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Disassociate(string loginProvider, string providerKey)
        {
            ManageMessageId? message = null;
            IdentityResult result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(), new UserLoginInfo(loginProvider, providerKey));
            if (result.Succeeded)
            {
                message = ManageMessageId.RemoveLoginSuccess;
            }
            else
            {
                message = ManageMessageId.Error;
            }
            return RedirectToAction("Manage", new { Message = message });
        }

        //
        // GET: /Account/Manage
        public ActionResult Manage(ManageMessageId? message)
        {
            ViewBag.StatusMessage =
                message == ManageMessageId.ChangePasswordSuccess ? "Your password has been changed."
                : message == ManageMessageId.SetPasswordSuccess ? "Your password has been set."
                : message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : message == ManageMessageId.Error ? "An error has occurred."
                : "";
            ViewBag.HasLocalPassword = HasPassword();
            ViewBag.ReturnUrl = Url.Action("Manage");

            var user = UserManager.FindById(User.Identity.GetUserId());

            ManageUserViewModel model = new ManageUserViewModel();
            model.FN = user.FN;
            model.FirstName = user.FirstName;
            model.LastName = user.LastName;
            model.IdentityNumber = user.IdentityNumber;

            return View(model);
        }

        //
        // POST: /Account/Manage
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Manage(ManageUserViewModel model)
        {
            bool hasPassword = HasPassword();
            ViewBag.HasLocalPassword = hasPassword;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasPassword)
            {
                if (ModelState.IsValid)
                {
                    var id = User.Identity.GetUserId();
                    var user = UserManager.Users.First(u => u.Id == id);
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.IdentityNumber = model.IdentityNumber;
                    user.FN = model.FN;


                    IdentityResult resultUpdate = await UserManager.UpdateAsync(user);

                    IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
                    if (result.Succeeded && resultUpdate.Succeeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
                    }
                    else
                    {
                        if (result.Succeeded)
                        {
                            AddErrors(resultUpdate);
                        }
                        else
                        {
                            AddErrors(result);
                        }
                        
                    }
                }
            }
            else
            {
                // User does not have a password so remove any validation errors caused by a missing OldPassword field
                ModelState state = ModelState["OldPassword"];
                if (state != null)
                {
                    state.Errors.Clear();
                }

                if (ModelState.IsValid)
                {
                    IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Index", "Home");
        }

        #region ExternalLogin
        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var user = await UserManager.FindAsync(loginInfo.Login);
            if (user != null)
            {
                await SignInAsync(user, isPersistent: false);
                return RedirectToLocal(returnUrl);
            }
            else
            {
                // If the user does not have an account, then prompt the user to create an account
                ViewBag.ReturnUrl = returnUrl;
                ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { UserName = loginInfo.DefaultUserName });
            }
        }

        //
        // POST: /Account/LinkLogin
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LinkLogin(string provider)
        {
            // Request a redirect to the external login provider to link a login for the current user
            return new ChallengeResult(provider, Url.Action("LinkLoginCallback", "Account"), User.Identity.GetUserId());
        }

        //
        // GET: /Account/LinkLoginCallback
        public async Task<ActionResult> LinkLoginCallback()
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync(XsrfKey, User.Identity.GetUserId());
            if (loginInfo == null)
            {
                return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
            }
            var result = await UserManager.AddLoginAsync(User.Identity.GetUserId(), loginInfo.Login);
            if (result.Succeeded)
            {
                return RedirectToAction("Manage");
            }
            return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser() { UserName = model.UserName };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInAsync(user, isPersistent: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        
        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult RemoveAccountList()
        {
            var linkedAccounts = UserManager.GetLogins(User.Identity.GetUserId());
            ViewBag.ShowRemoveButton = HasPassword() || linkedAccounts.Count > 1;
            return (ActionResult)PartialView("_RemoveAccountPartial", linkedAccounts);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && UserManager != null)
            {
                UserManager.Dispose();
                UserManager = null;
            }
            base.Dispose(disposing);
        }
        #endregion

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private async Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            Error
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        private class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri) : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties() { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion

        #region UsersPageLogic
        [Authorize(Roles = "Admin, Moderator")]
        public ActionResult Users()
        {
            return View();
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Moderator")]
        public JsonResult AllUsersData()
        {
            var id = User.Identity.GetUserId();
            var allUsers = UserManager.Users.Where(u => u.Id != id).ToArray();
            return Json(allUsers, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public void ChangeUserRole(string userId, string newRole)
        {
            var currentUser = UserManager.FindById(userId);
            var currentUserRoles = UserManager.GetRoles(userId);
            foreach (var role in currentUserRoles)
            {
                UserManager.RemoveFromRole(userId, role);
            }
            UserManager.AddToRole(userId,newRole);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public void DeleteUser(string userId)
        {
            var userToBeDeleted = UserManager.FindById(userId);
            var userRoles = UserManager.GetRoles(userId);
            UserManager.RemoveFromRoles(userId,userRoles.ToArray());
            UserManager.Delete(userToBeDeleted);
        }

        [Authorize(Roles = "Admin, Moderator")]
        public JsonResult GetUserStatistics()
        {
            int users = 0;
            int admins = 0;
            int moderators = 0;
            var DbUsers = UserManager.Users.ToArray();
            foreach (var user in DbUsers)
            {
                if (UserManager.IsInRole(user.Id, "Admin"))
                {
                    admins++;
                }
                else if (UserManager.IsInRole(user.Id, "Moderator"))
                {
                    moderators++;
                }
                else if (UserManager.IsInRole(user.Id, "User"))
                {
                    users++;
                }
            }

            var allUsers = UserManager.Users.Count();

            return Json(new {users = users, admins = admins, moderators = moderators, allUsers = allUsers}, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Admin, Moderator")]
        public void UpdateUser(ApplicationUser appUser)
        {
            var user = UserManager.FindById(appUser.Id);
            user.FirstName = appUser.FirstName;
            user.LastName = appUser.LastName;
            user.FN = appUser.FN;
            user.IdentityNumber = appUser.IdentityNumber;

            var result = UserManager.Update(user);
        }

        public ActionResult Profile()
        {
            var userID = User.Identity.GetUserId();
            var user = UserManager.Users.First(u => u.Id == userID);
            return View(user);
        }
        #endregion

        [HttpPost]
        public ActionResult UploadProfilePicture(HttpPostedFileBase file)
        {
            if (file != null && file.ContentLength > 0 && FileChecker.IsImage(file))
            {
                var UserID = User.Identity.GetUserId();

                var extention = Path.GetExtension(file.FileName);
                var path = Path.Combine(Server.MapPath("~/Content/Uploads/" + UserID + "/"), "ProfilePicture" + extention);

                bool directoryExists = System.IO.Directory.Exists(Server.MapPath("~/Content/Uploads/" + UserID + "/"));
                if (!directoryExists)
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/Uploads/" + UserID + "/"));
                }

                file.SaveAs(path);

                var pathToProfilePicture = "~/Content/Uploads/" + UserID + "/" + "ProfilePicture" + extention;
                var user = UserManager.FindById(UserID);
                user.ProfilePicture = pathToProfilePicture;
                UserManager.Update(user);
            }

            return RedirectToAction("Profile");
        }
    }
}