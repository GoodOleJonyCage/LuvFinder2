/*import { UserStore } from '../components/UserStore'*/
export const BlogEdit = async (data) => {

    let response = await fetch(`blog/editblog`, {
        //headers: {
        //    "Content-Type": "multipart/form-data"
        //},
        method: 'POST',
        body: data
    });
    if (response.ok) {
        const result = await response.text();
        return result;
    }
    throw response;
}

export const UploadBlog = async (data) => {

    let response = await fetch(`blog/createblog`, {
        //headers: {
        //    "Content-Type": "multipart/form-data"
        //},
        method: 'POST',
        body: data
    });
    if (response.ok) {
        const result = await response.text();
        return result;
    }
    throw response;
}

export const AddBlogComment = async (username, blogid, comment,replyto) => {

    let response = await fetch(`blog/addblogcomment`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            blogid: blogid,
            comment: comment,
            replyto: replyto
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetBlogCount = async (username) => {

    let response = await fetch(`blog/blogcount`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({ username: username }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetBlog = async (username,blogid) => {

    let response = await fetch(`blog/blog`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({ username: username, blogid: blogid }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const LoadBlogs = async (username) => {

    let response = await fetch(`blog/blogs`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({ username: username }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const LoadFriendProfiles = async (username) => {

    let response = await fetch(`profile/friends`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({ username: username }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const UploadFile = async (data) => {
    
    let response = await fetch(`userpic/upload`, {
        //headers: {
        //    "Content-Type": "multipart/form-data"
        //},
        method: 'POST',
        body:   data 
    });
    if (response.ok) {
        return true;
    }
    throw response;
}


export const ExecuteSearch = async (searchcriteria) => {

    let response = await fetch(`search/search`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            vm: searchcriteria,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetSearchCritera = async () => {

    let response = await fetch(`search/getsearchcriteria`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        //method: 'POST',
        //body: JSON.stringify({
        //    usernamefrom: fromusername,
        //    usernameto: tousername,
        //}),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const AreFriendsStatus = async (fromusername, tousername) => {

    let response = await fetch(`chat/arefriends`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernamefrom: fromusername,
            usernameto: tousername,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetChatInvitationStatus = async (fromusername, tousername) => {

    let response = await fetch(`chat/chatinvitationstatus`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernamefrom: fromusername,
            usernameto: tousername,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const AddChatMessage = async (fromusername, tousername, message) => {

    let response = await fetch(`chat/addchatmessage`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernamefrom: fromusername,
            usernameto: tousername,
            message: message
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetFriendCount = async (username/*,token*/) => {

    //console.log(getToken());
    let response = await fetch(`profile/friendcount`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + token
        },
        method: 'POST',
        body: JSON.stringify({
            username: username
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetChatCount = async (username/*,token*/) => {
    
    //console.log(getToken());
    let response = await fetch(`chat/chatcount`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
             //'Authorization': "Bearer " + token
        },
        method: 'POST',
        body: JSON.stringify({
            username: username
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }
    
    throw response;
}

export const GetChat = async (fromusername, tousername) => {

    let response = await fetch(`chat/chat`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernamefrom: fromusername,
            usernameto: tousername
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetChatSummary = async (username) => {

    let response = await fetch(`chat/chatsummary`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            username: username
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const FriendRequestCount = async (tousername) => {

    let response = await fetch(`profile/friendrequestcount`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernameto: tousername
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const StartFriendShip = async (fromusername, tousername) => {

    let response = await fetch(`profile/startfriendship`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernamefrom: fromusername,
            usernameto: tousername
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetActivityFriends = async (tousername) => {

    let response = await fetch(`profile/activityfriends`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernameto: tousername
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const GetLikeUserStatus = async (fromusername, tousername) => {

    let response = await fetch(`profile/likeuserstatus`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernamefrom: fromusername,
            usernameto: tousername
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LikeUser = async (fromusername, tousername) => {

    let response = await fetch(`profile/likeuser`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            usernamefrom : fromusername  ,
            usernameto   :tousername 
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LoadGenders = async () => {

    let response = await fetch(`profile/genders`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LoadMaritalStatuses = async () => {

    let response = await fetch(`profile/maritalstatuses`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LoadCountries = async () => {

    let response = await fetch(`profile/countries`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        //method: 'POST',
        //body: JSON.stringify({ quizid: quizid }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LoadRegions = async (countryid) => {

    let response = await fetch(`profile/regions`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({ countryid: countryid }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LoadCitiesByName = async (regionid,cityname) => {

    let response = await fetch(`profile/citiesbyname`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            regionid: regionid,
            cityname: cityname
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LoadCities = async (regionid) => {

    let response = await fetch(`profile/cities`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({regionid: regionid }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;
}

export const LoadProfiles = async (username) => {

    let response = await fetch(`profile/profiles`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
         method: 'POST',
        body: JSON.stringify({ username: username }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const LoadProfile = async (userID) => {

    let response = await fetch(`profile/profilequestionnaire`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        //method: 'POST',
        //body: JSON.stringify({ quizid: quizid }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const LoadUserProfile = async (username) => {

    let response = await fetch(`profile/userprofile`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({ username: username }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const LoadUserInfo = async (username) => {

    let response = await fetch(`profile/userinfo`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({ username: username }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const LoadInitializedUserInfo = async () => {

    let response = await fetch(`profile/initializeduserinfo`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        //method: 'POST',
        //body: JSON.stringify({ username: username }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    throw response;

}

export const SaveProfile = async (username, vm, info) => {

    let response = await fetch(`profile/saveprofile`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            info: info,
            vm: vm
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    return Promise.reject(response);

}

export const RegisterUser = async (username, password) => {

    let response = await fetch(`user/register`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password : password
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    return Promise.reject(response);

}

export const LoginUser = async (username, password) => {

    let response = await fetch(`user/login`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Authorization': "Bearer " + getJwtToken()
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    return Promise.reject(response);

}