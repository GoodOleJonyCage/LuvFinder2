import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { GetChatCount } from '../Services/Services'
import { UserStore } from './UserStore'

export const ChatCount = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        reloadData() {
            loadData();
            //console.log('reloadData called');
        }
    }));

    const [count, setcount] = useState(0);
    const {getUsername, redirectLoginOnUnAuthorized } = UserStore();

    const loadData = async () => {
        try {
            let cnt = await GetChatCount(getUsername()/*, getToken()*/);
            setcount(cnt);
        } catch (e) {
            redirectLoginOnUnAuthorized(e);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return <>
        <button className="nav-link" id="nav-messages-tab" data-bs-toggle="tab"
            data-bs-target="#messages" type="button" role="tab" aria-controls="messages"
            aria-selected="false">Messages <span className="item-number">{count}</span></button>
    </>
});