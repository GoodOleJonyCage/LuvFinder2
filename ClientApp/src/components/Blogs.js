import { useState } from "react"
import { useEffect } from 'react'
import { NavLink  } from 'react-router-dom';
import { LoadBlogs } from '../Services/Services'
import {LoadingDiv } from './LoadingDiv'
import Moment from 'react-moment';

export const Blogs = (props) => {

    const [blogs, setblogs] = useState([]);
    const [loaded, setloaded] = useState(false);

    const loadData = async () => {
        const vm = await LoadBlogs(props.username);
        //console.log(vm);
        setblogs(vm);
        setloaded(true);
    }

    useEffect(() => {
        loadData();
    }, []);


    const Blog = (props) => {

        return <>
            <div className="post-item blog-item">
                <div className="post-item-inner">
                    <div className="post-thumb">
                        <a href="blog-single.html"><img src={props.blog.image}/*"assets/images/blog/01.jpg"*/ alt="blog" /></a>
                    </div>
                    <div className="post-content fullblog-container">
                        <span className=" ">
                            By <NavLink className="post-by" to="/viewprofile" state={{ username: props.username }}>{props.blog.user.firstName} {props.blog.user.lastName} ({props.blog.user.age})</NavLink> at <span className="posted-on"><Moment format="DD MMM YYYY hh:mm:ss:A">{props.blog.createDate}</Moment></span></span>
                        <h3> {props.blog.title}</h3>
                        <p className="blog-body-eclipses">{props.blog.body} </p>
                    </div>
                    <div className="blog-footer">
                        <div className="read-link">
                            <NavLink className="viewall" to="/viewblog" state={{
                                blogid: props.blog.id,
                                username: props.username
                            }}>Read More</NavLink><i className="icofont-double-right"></i>
                        </div>
                        {/*<a onClick={(e) => navigate('/viewblog')} className="viewall">Read More <i className="icofont-double-right"></i></a>*/}
                        <div className="right">
                            {/*<a href="/#" className="blog-heart"><i className="icofont-heart-alt"></i> 12 <span className="d-none d-sm-inline-block">Like</span> </a>*/}
                            <div className="blog-comment-info">
                                <i className="icofont-comment"></i>
                                <span>{props.blog.comments.length}</span>
                                <span className="d-none d-sm-inline-block">Comments</span> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

    return <>
        <div className="blog-wrapper">
            {
                blogs.length === 0 && !loaded ? <LoadingDiv></LoadingDiv> :
                blogs.length === 0 && loaded ? <div className="highlight-error text-center">No Blogs to load</div>  :
                blogs.map((b, index) => {

                    return <Blog blog={b} username={props.username} key={index}></Blog>
                })
            }
        </div>
    </>
}