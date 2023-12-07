import { Fetcher } from '../Services/Fetcher'

export const BlogEdit = async (data) => {
    

    return Fetcher(`blog/editblog`, 'POST', false, data);
}

export const UploadBlog = async (data) => {

    return Fetcher(`blog/createblog`, 'POST', false, data);
}

export const AddBlogComment = async (username, blogid, comment, replyto) => {

    return Fetcher(`blog/addblogcomment`, 'POST', true, JSON.stringify({
        username: username,
        blogid: blogid,
        comment: comment,
        replyto: replyto
    }));
}

export const GetBlogCount = async (username) => {

    return Fetcher(`blog/blogcount`, 'POST', true, JSON.stringify({ username: username }));

}

export const GetBlog = async (username, blogid) => {

    return Fetcher(`blog/blog`, 'POST', true, JSON.stringify({ username: username, blogid: blogid }));

}

export const LoadBlogs = async (username) => {

    return Fetcher(`blog/blogs`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadFriendProfiles = async (username) => {

    return Fetcher(`profile/friends`, 'POST', true, JSON.stringify({ username: username }));

}

export const UploadFile = async (data) => {

    return Fetcher(`userpic/upload`, 'POST', false, data);
}


export const ExecuteSearch = async (searchcriteria) => {

    return Fetcher(`search/search`, 'POST', true, JSON.stringify({
        vm: searchcriteria,
    }));
}

export const GetSearchCritera = async () => {

   
    return Fetcher(`search/getsearchcriteria`, 'GET', true, null);
}

export const AreFriendsStatus = async (fromusername, tousername) => {

    return Fetcher(`chat/arefriends`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername,
    }));
}

export const GetChatInvitationStatus = async (fromusername, tousername) => {

    return Fetcher(`chat/chatinvitationstatus`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername,
    }));
}

export const AddChatMessage = async (fromusername, tousername, message) => {

    return Fetcher(`chat/addchatmessage`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername,
        message: message
    }));
}

export const GetFriendCount = async (username/*,token*/) => {

    return Fetcher(`profile/friendcount`, 'POST', true, JSON.stringify({
        username: username
    }));
}

export const GetChatCount = async (username/*,token*/) => {

    return Fetcher(`chat/chatcount`, 'POST', true, JSON.stringify({
        username: username
    }));
}

export const GetChat = async (fromusername, tousername) => {

    return Fetcher(`chat/chat`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const GetChatSummary = async (username) => {

    return Fetcher(`chat/chatsummary`, 'POST', true, JSON.stringify({
        username: username
    }));
}

export const FriendRequestCount = async (tousername) => {

    return Fetcher(`profile/friendrequestcount`, 'POST', true, JSON.stringify({
        usernameto: tousername
    }));
}

export const StartFriendShip = async (fromusername, tousername) => {

    return Fetcher(`profile/startfriendship`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const GetActivityFriends = async (tousername) => {

    return Fetcher(`profile/activityfriends`, 'POST', true, JSON.stringify({
        usernameto: tousername
    }));
}

export const GetLikeUserStatus = async (fromusername, tousername) => {

    return Fetcher(`profile/likeuserstatus`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const LikeUser = async (fromusername, tousername) => {

    return Fetcher(`profile/likeuser`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const LoadGenders = async () => {

    return Fetcher(`profile/genders`, 'GET', true, null);
}

export const LoadMaritalStatuses = async () => {

    return Fetcher(`profile/maritalstatuses`, 'GET', true, null);
}

export const LoadCountries = async () => {

    return Fetcher(`profile/countries`, 'GET', true, null);
}

export const LoadRegions = async (countryid) => {

    return Fetcher(`profile/regions`, 'POST', true, JSON.stringify({ countryid: countryid }));
}

export const LoadCitiesByName = async (regionid, cityname) => {

    return Fetcher(`profile/citiesbyname`, 'POST', true, JSON.stringify({
        regionid: regionid,
        cityname: cityname
    }));
}

export const LoadCities = async (regionid) => {

    return Fetcher(`profile/cities`, 'POST', true, JSON.stringify({ regionid: regionid }));
}

export const LoadProfiles = async (username) => {

    return Fetcher(`profile/profiles`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadProfile = async (userID) => {

    return Fetcher(`profile/profilequestionnaire`, 'GET', true, null);
}

export const LoadUserProfile = async (username) => {

    return Fetcher(`profile/userprofile`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadUserInfo = async (username) => {

    return Fetcher(`profile/userinfo`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadInitializedUserInfo = async () => {

    return Fetcher(`profile/initializeduserinfo`, 'GET', true, null);

}

export const SaveProfile = async (username, vm, info) => {

    return Fetcher(`profile/saveprofile`, 'POST', true, JSON.stringify({
        username: username,
        info: info,
        vm: vm
    }));
}

export const RegisterUser = async (username, password) => {

    return Fetcher(`user/register`, 'POST', true, JSON.stringify({
        username: username,
        password: password
    }));
}


export const LoginUser = async (username, password) => {

    return Fetcher(`user/login`, 'POST', true, JSON.stringify({
        username: username,
        password: password
    }));
}