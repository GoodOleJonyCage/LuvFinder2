import { useEffect, useState} from 'react'
import { GetBlogCount } from '../Services/Services'


export const BlogCount = (props)  => {

    const [count, setcount] = useState(0);

    const loadData = async () => {
        try {
            let cnt = await GetBlogCount(props.username);
            setcount(cnt);
        } catch (e) {
            //redirectLoginOnUnAuthorized(e);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return <>
        <button className="nav-link" id="nav-blogs-tab" data-bs-toggle="tab"
            data-bs-target="#blogs" type="button" role="tab" aria-controls="blogs"
            aria-selected="false">Blogs <span className="item-number">{count}</span></button>
    </>
    //});
}