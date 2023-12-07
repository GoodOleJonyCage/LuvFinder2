﻿using LuvFinder.Models;
using LuvFinder.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json;
using NuGet.Packaging.Signing;
using System.Collections.Generic;
using System.Diagnostics;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace LuvFinder.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ChatController : ControllerBase
    {

        private readonly LuvFinderContext db;
        private readonly IConfiguration _config;
        IWebHostEnvironment _webHostEnvironment;
        public ChatController(LuvFinderContext _db, IConfiguration config, IWebHostEnvironment webHostEnvironment)
        {
            db = _db;
            _config = config;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        [Route("addchatmessage")]
        public ActionResult AddChatMessage([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var usernameFrom = userParams.GetProperty("usernamefrom").ToString();
            var usernameTo = userParams.GetProperty("usernameto").ToString();
            var message = userParams.GetProperty("message").ToString();

            var userIDFrom = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameFrom);
            var userIDTo = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameTo);

            if (string.IsNullOrEmpty(message))
            {
                return BadRequest("Please enter a comment");
            }

            try
            {
                db.UserMessages
                           .Add(new UserMessage()
                           {
                               FromId = userIDFrom,
                               ToId = userIDTo,
                               Message = message,
                           });
                
                db.SaveChanges();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }

            return Ok(true);
        }

        [HttpPost]
        [Route("chatinvitationstatus")]
        public ActionResult GetChatInvitationStatus([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var usernameFrom = userParams.GetProperty("usernamefrom").ToString();
            var usernameTo = userParams.GetProperty("usernameto").ToString();

            var userIDFrom = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameFrom);
            var userIDTo = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameTo);

            var hasMessages =false;
            
            try
            {
                hasMessages = db.UserMessages.Any(m =>
                                    m.FromId == userIDFrom && m.ToId == userIDTo ||
                                    m.ToId == userIDFrom && m.FromId == userIDTo);
                           
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }

            return Ok(hasMessages);
        }

        [HttpPost]
        [Route("arefriends")]
        public ActionResult AreFriends([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var usernameFrom = userParams.GetProperty("usernamefrom").ToString();
            var usernameTo = userParams.GetProperty("usernameto").ToString();

            var userIDFrom = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameFrom);
            var userIDTo = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameTo);

            var areFriends = false;

            try
            {
                areFriends = db.UserLikes.Any(m =>
                                    ((m.FromId == userIDFrom && m.ToId == userIDTo)
                                    && m.LikeAccepted == true) ||
                                    ((m.FromId == userIDTo && m.ToId == userIDFrom)
                                    && m.LikeAccepted == true)
                                    );

            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }

            return Ok(areFriends);
        }

        [HttpPost]
        [Route("chat")]
        public ActionResult GetChat([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var usernameFrom = userParams.GetProperty("usernamefrom").ToString();
            var usernameTo = userParams.GetProperty("usernameto").ToString();

            var userIDFrom = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameFrom);
            var userIDTo = (new UserController(new LuvFinderContext(), _config)).UserIDByName(usernameTo);

            var messages = new List<ViewModels.Message>();

            try
            {
                 messages = db.UserMessages
                            .Where(m =>
                                    m.FromId == userIDFrom && m.ToId == userIDTo ||
                                    m.ToId == userIDFrom && m.FromId == userIDTo)
                            .OrderBy( m => m.Date)
                            .Select(m => new ViewModels.Message()
                            {
                                ID = m.Id,
                                FromID = m.FromId,
                                ToID = m.ToId,
                                Text = m.Message,
                                Date = m.Date,
                                MessageRead = m.MessageRead ?? false,
                                MessageReadDate = m.MessageReadDate.HasValue? m.MessageReadDate.Value : null,
                                DisplayOnLeft = m.FromId == userIDFrom
                            }).ToList();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }

            return Ok(messages);
        }

        [HttpPost]
        [Route("chatcount")]
        //[Authorize]
        public ActionResult GetChatMessagesCount([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var username = userParams.GetProperty("username").ToString();
            var userID = (new UserController(new LuvFinderContext(), _config)).UserIDByName(username);

            var count = 0;

            try
            {
                count = db.UserMessages
                           .Count(m => m.FromId == userID || m.ToId == userID);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }

            return Ok(count);
        }

        [HttpPost]
        [Route("chatsummary")]
        public ActionResult GetChatSummary([Microsoft.AspNetCore.Mvc.FromBody] System.Text.Json.JsonElement userParams)
        {
            var username = userParams.GetProperty("username").ToString();
            var userID = (new UserController(new LuvFinderContext(), _config)).UserIDByName(username);

            var lst = new List<ChatSummary>();

            try
            {
                db.Users.ToList().ForEach(u =>
                {
                    var messagecount = db.UserMessages
                                           .Count(m => (m.FromId == userID && m.ToId == u.Id) ||
                                                        (m.FromId == u.Id && m.ToId == userID));
                    if (messagecount > 0)
                    {
                        lst.Add(new ChatSummary()
                        {
                           UserInfoB = new ProfileController(db,_config, _webHostEnvironment).GetUserInfo(u.Id),
                           Count = messagecount
                        });
                    }
                });
                 
                           
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }

            return Ok(lst);
        }

    }
}
