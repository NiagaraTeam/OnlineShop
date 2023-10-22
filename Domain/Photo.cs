namespace Domain
{
    public class Photo
    {
        public string Id { get; set; }
        public string UrlSmall { get; set; } // url to small image in cloudinary
        public string UrlLarge { get; set; } // url to large image in cloudinary
    }
}