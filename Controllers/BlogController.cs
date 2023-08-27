using LuvFinder.Models;
using LuvFinder.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace LuvFinder.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly LuvFinderContext db;
        private readonly IConfiguration _config;
        IWebHostEnvironment _webHostEnvironment;
        public BlogController(LuvFinderContext _db, IConfiguration config, IWebHostEnvironment webHostEnvironment)
        {
            db = _db;
            _config = config;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        [Route("blogs")]
        public ActionResult Blogs([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var username = userParams.GetProperty("username").ToString();
            var userID = (new UserController(new LuvFinderContext(), _config)).UserIDByName(username);
            var lst = new List<Blog>();
            try
            {
                lst = GetUserBlogs(userID);
            }
            catch (Exception exc)
            {

                return BadRequest(exc.Message);
            }
             
            return Ok(lst);
        }

        [HttpPost]
        [Route("blog")]
        public ActionResult Blog([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var username = userParams.GetProperty("username").ToString();
            var blogid = Int32.Parse(userParams.GetProperty("blogid").ToString());
            
            var userID = (new UserController(new LuvFinderContext(), _config)).UserIDByName(username);
            
            ViewModels.Blog blog = new ViewModels.Blog();
            try
            {
                var lst = GetUserBlogs(userID);
                blog = lst.Where(b => b.ID == blogid).SingleOrDefault();
            }
            catch (Exception exc)
            {

                return BadRequest(exc.Message);
            }

            return Ok(blog);
        }

        private List<ViewModels.Blog> GetUserBlogs(int userID)
        {
            var lst = new List<ViewModels.Blog>();
            lst = db.UserBlogs
                .Where(b => b.UserId == userID)
                .Select(b => new ViewModels.Blog()
                {
                    ID = b.Id,
                    UserID = b.UserId ?? 0,
                    Title = b.Title ?? string.Empty,
                    Body = b.Body ?? string.Empty,
                    Image = Helpers.Helpers.GetProfilePicDB(b.Image),
                    CreateDate = b.CreateDate ?? null,
                    UpdateDate = b.UpdateDate ?? null
                }).ToList();

            ViewModels.UserInfo user = new ProfileController(db, _config, _webHostEnvironment)
                .GetUserInfo(userID);

            lst.ForEach(blog =>
            {
                blog.user = user;
                blog.Comments = db.UserBlogComments
                    .Where(b =>
                            b.BlogId == blog.ID &&
                            b.UserId == userID)
                    .Select(b => new ViewModels.BlogComment()
                    {
                        Date = b.Date,
                        UserID = b.UserId ?? 0,
                        Comment = b.Comment ?? string.Empty

                    }).ToList();

            });

            lst.ForEach(blog =>
            {
                blog.Comments.ForEach(c =>
                {
                    c.PostedBy = new ProfileController(db, _config, _webHostEnvironment)
                                   .GetUserInfo(c.UserID);

                });
            });
            return lst;
        }

        [HttpPost]
        [Route("blogcount")]
        public ActionResult BlogCount([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var username = userParams.GetProperty("username").ToString();
            var userID = (new UserController(new LuvFinderContext(), _config)).UserIDByName(username);

            var count = 0;

            try
            {
                count = db.UserBlogs.Count(b => b.UserId == userID);

            }
            catch (Exception exc)
            {

                return BadRequest(exc.Message);
            }

            return Ok(count);
        }

        [HttpPost]
        [Route("addblogcomment")]
        public ActionResult AddBlogComment([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var username = userParams.GetProperty("username").ToString();
            var blogid = Int32.Parse(userParams.GetProperty("blogid").ToString());
            var comment = userParams.GetProperty("comment").ToString();

            var userID = (new UserController(new LuvFinderContext(), _config)).UserIDByName(username);

            try
            {
                db.UserBlogComments
                        .Add(new UserBlogComment()
                        {
                            BlogId = blogid,
                            Comment =comment,
                            UserId=userID
                        });
               
                db.SaveChanges();
            }
            catch (Exception exc)
            {

                return BadRequest(exc.Message);
            }

            return Ok(true);
        }
    }
}
