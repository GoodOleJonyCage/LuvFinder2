/*import { UserStore } from '../components/UserStore'*/
//Cannot call userStore methods (hook error ensues), hence have to duplicate code here regarding tokens and redirection 

//gets bearer token 
const GetToken = () => {

    const tokenStr = localStorage.getItem('token');
    if (tokenStr) {
        const token = JSON.parse(tokenStr);
        return token;
    }
    return null;
}

//clears any tokens saved in memory
const ClearToken = () => {
    //const navigate = useNavigate();
    localStorage.setItem("token", null);
    localStorage.setItem("username", null);
    //navigate('/login');
}

export const Fetcher = async (url, _method, asJson, data) => {

   //const { getToken } = UserStore();
    var jsonheaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': GetToken() == null ? '' : 'Bearer ' + GetToken()
    };

    let response = await fetch(url, {
        headers: asJson ? jsonheaders : {},
        method: _method,
        body: data
    });

    if (response.ok) {
        const data = asJson ? await response.json() : await response.text();
        return data;
    }

    //if (response.status === 401) {
    //    ClearToken();
    //    window.location.href = '/login';
    //}

     throw response;
   //return Promise.reject(response);
}

 