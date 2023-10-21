import { fetcher } from '../Services/fetcher'

export const BlogEdit = async (data) => {

    return fetcher(`blog/editblog`, 'POST', false, data);
}

export const UploadBlog = async (data) => {

    return fetcher(`blog/createblog`, 'POST', false, data);
}

export const AddBlogComment = async (username, blogid, comment, replyto) => {

    return fetcher(`blog/addblogcomment`, 'POST', true, JSON.stringify({
        username: username,
        blogid: blogid,
        comment: comment,
        replyto: replyto
    }));
}

export const GetBlogCount = async (username) => {

    return fetcher(`blog/blogcount`, 'POST', true, JSON.stringify({ username: username }));

}

export const GetBlog = async (username, blogid) => {

    return fetcher(`blog/blog`, 'POST', true, JSON.stringify({ username: username, blogid: blogid }));

}

export const LoadBlogs = async (username) => {

    return fetcher(`blog/blogs`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadFriendProfiles = async (username) => {

    return fetcher(`profile/friends`, 'POST', true, JSON.stringify({ username: username }));

}

export const UploadFile = async (data) => {

    return fetcher(`userpic/upload`, 'POST', false, data);
}


export const ExecuteSearch = async (searchcriteria) => {

    return fetcher(`search/search`, 'POST', true, JSON.stringify({
        vm: searchcriteria,
    }));
}

export const GetSearchCritera = async () => {

    return fetcher(`search/getsearchcriteria`, 'GET', true, null);

}

export const AreFriendsStatus = async (fromusername, tousername) => {

    return fetcher(`chat/arefriends`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername,
    }));
}

export const GetChatInvitationStatus = async (fromusername, tousername) => {

    return fetcher(`chat/chatinvitationstatus`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername,
    }));
}

export const AddChatMessage = async (fromusername, tousername, message) => {

    return fetcher(`chat/addchatmessage`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername,
        message: message
    }));
}

export const GetFriendCount = async (username/*,token*/) => {

    return fetcher(`profile/friendcount`, 'POST', true, JSON.stringify({
        username: username
    }));
}

export const GetChatCount = async (username/*,token*/) => {

    return fetcher(`chat/chatcount`, 'POST', true, JSON.stringify({
        username: username
    }));
}

export const GetChat = async (fromusername, tousername) => {

    return fetcher(`chat/chat`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const GetChatSummary = async (username) => {

    return fetcher(`chat/chatsummary`, 'POST', true, JSON.stringify({
        username: username
    }));
}

export const FriendRequestCount = async (tousername) => {

    return fetcher(`profile/friendrequestcount`, 'POST', true, JSON.stringify({
        usernameto: tousername
    }));
}

export const StartFriendShip = async (fromusername, tousername) => {

    return fetcher(`profile/startfriendship`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const GetActivityFriends = async (tousername) => {

    return fetcher(`profile/activityfriends`, 'POST', true, JSON.stringify({
        usernameto: tousername
    }));
}

export const GetLikeUserStatus = async (fromusername, tousername) => {

    return fetcher(`profile/likeuserstatus`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const LikeUser = async (fromusername, tousername) => {

    return fetcher(`profile/likeuser`, 'POST', true, JSON.stringify({
        usernamefrom: fromusername,
        usernameto: tousername
    }));
}

export const LoadGenders = async () => {

    return fetcher(`profile/genders`, 'GET', true, null);
}

export const LoadMaritalStatuses = async () => {

    return fetcher(`profile/maritalstatuses`, 'GET', true, null);
}

export const LoadCountries = async () => {

    return fetcher(`profile/countries`, 'GET', true, null);
}

export const LoadRegions = async (countryid) => {

    return fetcher(`profile/regions`, 'POST', true, JSON.stringify({ countryid: countryid }));
}

export const LoadCitiesByName = async (regionid, cityname) => {

    return fetcher(`profile/citiesbyname`, 'POST', true, JSON.stringify({
        regionid: regionid,
        cityname: cityname
    }));
}

export const LoadCities = async (regionid) => {

    return fetcher(`profile/cities`, 'POST', true, JSON.stringify({ regionid: regionid }));
}

export const LoadProfiles = async (username) => {

    return fetcher(`profile/profiles`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadProfile = async (userID) => {

    return fetcher(`profile/profilequestionnaire`, 'GET', true, null);
}

export const LoadUserProfile = async (username) => {

    return fetcher(`profile/userprofile`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadUserInfo = async (username) => {

    return fetcher(`profile/userinfo`, 'POST', true, JSON.stringify({ username: username }));

}

export const LoadInitializedUserInfo = async () => {

    return fetcher(`profile/initializeduserinfo`, 'GET', true, null);

}

export const SaveProfile = async (username, vm, info) => {

    return fetcher(`profile/saveprofile`, 'POST', true, JSON.stringify({
        username: username,
        info: info,
        vm: vm
    }));
}

export const RegisterUser = async (username, password) => {

    return fetcher(`user/register`, 'POST', true, JSON.stringify({
        username: username,
        password: password
    }));
}


export const LoginUser = async (username, password) => {

    return fetcher(`user/login`, 'POST', true, JSON.stringify({
        username: username,
        password: password
    }));
}