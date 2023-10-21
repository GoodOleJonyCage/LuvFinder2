
export const fetcher = async (url, _method,asJson, data) => {

    var jsonheaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Authorization': "Bearer " + getJwtToken()
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

    throw response;
    //return Promise.reject(response);
}
 