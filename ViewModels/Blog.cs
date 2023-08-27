namespace LuvFinder.ViewModels
{
    public class Blog
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public DateTime? CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public UserInfo user { get; set; } = new UserInfo();
        public List<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }
}
