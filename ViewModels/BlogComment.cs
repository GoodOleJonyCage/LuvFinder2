using LuvFinder.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace LuvFinder.ViewModels
{
    public class BlogComment
    {
        public int ID { get; set; }
        public int BlogID { get; set; }
        public int UserID { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime? Date { get; set; }
        public int ReplyTo { get; set; }
        public UserInfo PostedBy { get; set; } = new UserInfo();
        public BlogComment Reply { get; set; } 
    }
}
