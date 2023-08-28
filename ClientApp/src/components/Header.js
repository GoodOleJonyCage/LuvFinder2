import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { PageHeader } from "./PageHeader"
import { UserStore } from './UserStore'

export const Header = () => {
    const navigate = useNavigate();
    const { getUsername, clearToken } = UserStore();
    const username = getUsername();
    //console.log(getUsername());
    return <>
            <header className="header-section">
            <div className="header-top">
                <div className="container">
                    <div className="header-top-area">
                        <ul className="left">
                            <li>
                                <i className="icofont-ui-call"></i> <span>+800-123-4567 6587</span>
                            </li>
                            <li>
                                <i className="icofont-location-pin"></i> Beverley, New York 224 USA
                            </li>
                        </ul>
                        <ul className="social-icons d-flex align-items-center">
                            <li>
                                <p>
                                    Find us on :
                                </p>
                            </li>
                            <li>
                                <a href="/#" className="fb"><i className="icofont-facebook-messenger"></i></a>
                            </li>
                            <li>
                                <a href="/#" className="twitter"><i className="icofont-twitter"></i></a>
                            </li>
                            <li>
                                <a href="/#" className="vimeo"><i className="icofont-vimeo"></i></a>
                            </li>
                            <li>
                                <a href="/#" className="skype"><i className="icofont-skype"></i></a>
                            </li>
                            <li>
                                <a href="/#" className="rss"><i className="icofont-rss-feed"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header-bottom">
                <div className="container">
                    <div className="header-wrapper">
                        <div className="logo">
                            <a href="/">
                                <img src="assets/images/logo/logo.png" alt="logo" />
                            </a>
                        </div>
                        <div className="menu-area">
                            <ul className="menu">
                                <li>
                                    <a onClick={(e) => { navigate('/home'); }}>Home</a>
                                </li>
                                {/*<li>*/}
                                {/*    <a href="#0">Features</a>*/}
                                {/*    <ul className="submenu">*/}
                                {/*        <li><a href="members.html">All Members</a></li>*/}
                                {/*        <li><a href="profile.html">Member Profile</a></li>*/}
                                {/*        <li><a href="login.html" className="active">Login</a></li>*/}
                                {/*        <li><a href="signup.html">Sign Up</a></li>*/}
                                {/*        <li><a href="pricing-plan.html">Pricing Plan</a></li>*/}
                                {/*        <li><a href="404.html">404 Page</a></li>*/}

                                {/*    </ul>*/}
                                {/*</li>*/}
                                <li>
                                    <a onClick={(e) => { navigate('/search') }} >Search</a>
                                </li>
                                {/*<li>*/}
                                {/*    <a href="#0">Blog</a>*/}
                                {/*    <ul className="submenu">*/}
                                {/*        <li><a href="blog.html">Blog</a></li>*/}
                                {/*        <li><a href="blog-single.html">Blog Single</a></li>*/}
                                {/*    </ul>*/}
                                {/*</li>*/}
                                <li><a href="contact.html">Contact</a></li>
                            </ul>
                            <div className="login-signout-container">
                                <button
                                    onClick={(e) => {
                                        if (username === null)
                                            navigate('login');
                                        else {
                                            navigate('/editprofile');
                                        }
                                    }}
                                    className="username">
                                    <i className="icofont-user"></i> <span>{username === null ? "LOG IN" : username}</span> </button>
                                <button
                                    onClick={(e) => {
                                        if (username === null) {
                                            navigate('/register');
                                        }
                                        else {
                                            clearToken();
                                            navigate('/home');
                                        }
                                    }}
                                    className="logout"><i className="icofont-users"></i> <span>{username === null ? "SIGN UP" : "LOG OUT"}</span> </button>
                            </div>
                            {/* toggle icons */}
                            <div className="header-bar d-lg-none">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            <div className="ellepsis-bar d-lg-none">
                                    <i className="icofont-info-square"></i>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
            <PageHeader ></PageHeader>
           </>
}