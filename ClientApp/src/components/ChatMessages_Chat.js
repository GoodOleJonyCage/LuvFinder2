import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { GetChat  } from '../Services/Services'
import { LoadingDiv } from './LoadingDiv'
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom';

export const ChatMessages_Chat = forwardRef((props, ref) => {


    const [scrolledToBottom, setscrolledToBottom] = useState(false);
    //reload chat once new message is sent
    useImperativeHandle(ref, () => ({
        reloadData() {
            loadData();
            setTimeout(() => { scrollToBottom() }, 200)
            //console.log('reloadData called');
        }
    }));

    const [chat, setchat] = useState([]);
    const [count, setcount] = useState(0);
    //const divRef = useRef(null);

    const loadData = async () => {
        var vmchat = await GetChat(props.chatuserA.userName, props.chatuserB.userName);
        setchat(vmchat);
        //console.log(vmchat);
        props.loadChatCount();//refresh the chat count at the top
        if (!scrolledToBottom) {
            setTimeout(() => { scrollToBottom() }, 200)
            setscrolledToBottom(true);
        }
    }

    const scrollToBottom = () => {
        //divRef?.current?.scrollIntoView({  behavior: 'smooth' });
        var objDiv = document.getElementById("chat-div");
        objDiv.scrollTop = objDiv.scrollHeight;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            loadData();
            setcount(count + 1);
        }, 3000); //reload every 3 secs to pick up new chat messages from the db
        //Clearing the interval
        return () => clearInterval(interval);
    }, [count]); 

    const ChatMessage = (props) => {

        return <>
            <div className={props.message.displayOnLeft ? "comment " : "comment comment-right"} id="li-comment-2">
                <div className="com-image">
                    <img alt="" src={
                                    props.message.displayOnLeft ? props.chatuserA.profilePic : props.chatuserB.profilePic  
                                    }
                        className="avatar avatar-90 photo" height="90" width="90" />
                </div>
                <div className="com-content">
                    <div className="com-title">
                        <div className="com-title-meta">
                            <h4><a href="/#" rel="external nofollow" className="url">
                                {
                                    props.message.displayOnLeft ? props.chatuserA.firstName + " " + props.chatuserA.lastName :
                                                                  props.chatuserB.firstName + " " + props.chatuserB.lastName
                                }
                                </a></h4>
                            <span> <Moment format="DD MMM YYYY hh:mm:ss:A">{props.message.date}</Moment></span>
                        </div>
                        {/*<span className="reply">*/}
                        {/*    <a rel="nofollow" className="comment-reply-link" href="/#"><i className="icofont-reply-all"></i>  Reply</a>*/}
                        {/*</span>*/}
                    </div>
                    <p>{props.message.text}</p>
                </div>
            </div>
        </>
    }

    return <>
        {chat.length === 0 ? <LoadingDiv></LoadingDiv> :
            <div id="comments" className="comments">
                <div className="widget-title chat-header">
                    <h3>{chat.length} Messages</h3>
                    <div className="go-back-container">
                        <i className='fas fa-arrow-left'></i><NavLink to="/editprofile">Go Back</NavLink>
                    </div>
                </div>
                <div>
                    <div className="comment-list chat-container" id="chat-div" >
                        {
                            chat.map((message, index) => {
                                return <ChatMessage chatuserA={props.chatuserA} chatuserB={props.chatuserB} index={index} key={index} message={message} ></ChatMessage>
                            })
                        }
                        {/*<div ref={divRef}></div>    */}
                    </div>
                </div>
            </div>
        }
    </>

});