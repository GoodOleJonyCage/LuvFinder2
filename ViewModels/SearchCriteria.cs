namespace LuvFinder.ViewModels
{
    public class SearchCriteria
    {

        public int SelectedGender { get; set; }
        public List<Gender> Genders { get; set; }

        public int SelectedSeekingGender { get; set; }
        public List<Gender> SeekingGenders { get; set; }

        public int SelectedMinAge { get; set; }
        public int SelectedMaxAge { get; set; }

        public List<int> MinAge { get; set; } = new List<int>();
        public List<int> MaxAge { get; set; } = new List<int>();

        public int CountryID { get; set; }
        public string CountryName { get; set; } = string.Empty;

        public int RegionID { get; set; }
        public string RegionName { get; set; } = string.Empty;

        public int CityID { get; set; }
        public string CityName{ get; set; } = string.Empty;

        public List<ViewModels.UserInfo> Results { get; set; } = new List<UserInfo>();
    }
}
