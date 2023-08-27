﻿import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useLocation } from "react-router-dom"
import Moment from 'react-moment';
import { AsideSearch } from './AsideSearch'
import { UserStore } from './UserStore'
import { AddBlogComment, GetBlog } from '../Services/Services'
import { LoadingDiv } from './LoadingDiv'

export const FullBlog = () => {

    const [blog, setblog] = useState({});
    const [loaded, setloaded] = useState(false);

    const { isLoggedIn } = UserStore();
    let location = useLocation();
    const username = location.state.username;
    
    const loadData = async () => {

        const vm = await GetBlog(username, location.state.blogid);
        setblog(vm);
        setloaded(true);
        //console.log(username);
        //console.log(vm);
    }

    useEffect(() => {
        loadData();
    }, []);

    const Comment = (props) => {

        return <>
                <li className="comment" id="li-comment-2">
                    <div className="com-image">
                    <img alt="" src={props.comment.postedBy.profilePic} className="avatar avatar-90 photo" />
                    </div>
                    <div className="com-content">
                        <div className="com-title">
                            <div className="com-title-meta">
                                <h6><NavLink to="/viewprofile" state={{ username: props.comment.postedBy.userName }}>{props.comment.postedBy.firstName} {props.comment.postedBy.lastName} ({props.comment.postedBy.age}) {props.comment.postedBy.gender}</NavLink></h6>
                                <span className="posted-On"><Moment format="DD MMM YYYY hh:mm:ss:A">{props.comment.date}</Moment></span>
                            </div>
                            <span className="reply">
                                <a rel="nofollow" className="comment-reply-link" href="#"><i className="icofont-reply-all"></i>
                                    Reply</a>
                            </span>
                        </div>
                        <p>{props.comment.comment}</p>
                    </div>
                </li>
        </>
    }

    const LeaveComment = () => {

        const [comment, setcomment] = useState('');

        return <>
            <div className="comment-respond mb-5">
                <div className="add-comment">
                    <div className="widget-title">
                        <h3>Leave a Comment</h3>
                    </div>
                    <div   className="comment-form"  >
                        <textarea
                            onChange={(e) =>{ setcomment (e.target.value)} }
                            className="comment-input" id="comment-reply" name="comment" cols="45" rows="5" placeholder="Type Here Message" aria-required="true"></textarea>
                        <button
                            onClick={async (e) => {
                                var result = await AddBlogComment(username, blog.id, comment);
                                if (result)
                                    loadData();
                            }}
                            className="lab-btn" type="submit"><span>Leave Comment</span></button>
                    </div>
                </div>
            </div>
        </>
    }

    return <>
        {!loaded ? <LoadingDiv></LoadingDiv> :
        <div className="container blog-section padding-tb">
            <div className="main-blog">
                <div className="row">
                    <div className="col-lg-8 col-12">
                        <div className="blog-wrapper">
                            <div className="post-item blog-item">
                                <div className="post-item-inner">
                                    <div className="post-thumb">
                                        <a href="blog-single.html"><img src={blog.image}/*"assets/images/blog/01.jpg"*/ alt="blog" /></a>
                                    </div>
                                    <div className="post-content fullblog-container">
                                        <span className=" ">
                                            By <NavLink className="post-by" to="/viewprofile" state={{ username: username }}>{blog.user.firstName} {blog.user.lastName} ({blog.user.age})</NavLink> at <span className="posted-on"><Moment format="DD MMM YYYY hh:mm:ss:A">{blog.createDate}</Moment></span></span>
                                        <h1>{blog.title}</h1>
                                        <p>{blog.body}</p>
                                    </div>
                                    <div className="blog-footer">
                                        {/*<a onClick={(e) => navigate('/viewblog')} className="viewall">Read More <i className="icofont-double-right"></i></a>*/}
                                        <div className="right">
                                            <div className="go-back-container">
                                                <i className='fas fa-arrow-left'></i><NavLink to="/viewprofile" state={{ username: username }}>Go Back</NavLink>  
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            blog.comments.length === 0 ? <></> :
                            <div id="comments" className="comments">
                                <div className="widget-title">
                                    <h3>{blog.comments.length} Comments</h3>
                                </div>
                                <ul className="comment-list">
                                    {
                                        blog.comments.map((comment, index) => {
                                            return <Comment comment={comment} key={index} ></Comment>
                                        })
                                    }
                                </ul>
                            </div>
                        }
                        {isLoggedIn() ? <LeaveComment  ></LeaveComment> : <></>}
                    </div>
                    <div className="col-lg-4 col-12">
                        <AsideSearch></AsideSearch>
                    </div>
                </div>
            </div>
            </div>
        }
    </>
}