using System;
using System.Collections.Generic;

namespace LuvFinder.Models;

public partial class UserProfilePicsDb
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public byte[]? ImageData { get; set; }

    public virtual User? User { get; set; }
}
