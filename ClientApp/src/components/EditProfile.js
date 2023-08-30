import { useEffect, useState, useRef } from 'react'
import { LoadingDiv } from './LoadingDiv'
import { ChatSummary } from './ChatSummary'
import { ChatMessages } from './ChatMessages'
import { ActivityFriends } from './ActivityFriends'
import { LoadUserProfile, SaveProfile, LoadUserInfo,  LoadMaritalStatuses, LoadGenders } from '../Services/Services'
import { PendingFriendRequests } from './PendingFriendRequests'
import { FriendProfileList } from './FriendProfileList'
import { ChatCount } from './ChatCount'
import { FriendCount } from './FriendCount'
import { UserStore } from './UserStore'
import { LocationLocator } from './LocationLocator'
import { Routes, Route,  useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { BlogCount } from './BlogCount'
import { Blogs } from './Blogs'
import { CreateBlog } from './CreateBlog'
import { EditBlog } from './EditBlog'

export const EditProfile = () => {

    const ref_pendingFriendRequests = useRef(null);
    const ref_chatCount = useRef(null);
    const ref_blogCount = useRef(null);
    const ref_blogs = useRef(null);
    //profile questions
    const [questions, setquestions] = useState([]);
    //basic info
    const [info, setinfo] = useState({});
    const [errors, seterrors] = useState([]);
    const [error, seterror] = useState('');
    //basic info
    const [profileloaded, setprofileloaded] = useState(false);
    //get username from store
    const [btnPressed, setbtnPressed] = useState(false);
    const navigate = useNavigate();
    const { getUsername } = UserStore();
    //get username from store

    //helper methods for events
    const update_On_Checkbox = (qindex, aindex, val) => {

        let updatedquestions = [...questions];
        updatedquestions[qindex].question.answers[aindex].selected = val;
        setquestions(updatedquestions);
    }
    const update_On_Radio = (qindex, aindex, val) => {

        let updatedquestions = [...questions];
        for (var i = 0; i < updatedquestions[qindex].question.answers.length; i++) {
            updatedquestions[qindex].question.answers[i].selected = false;
        }
        updatedquestions[qindex].question.answers[aindex].selected = val;
        setquestions(updatedquestions);
    }
    const submitProfile = async () => {

        seterrors([]);
        seterror('');
        setbtnPressed(true);

        try {

            const profileSaved = await SaveProfile(getUsername(), questions, info);
            if (profileSaved)
                navigate('/home');

        } catch (e) {

            e.json().then(error_vm => {

                if (error_vm instanceof Array) {
                    var errorList = [];
                    var vm_is_questionnaire = error_vm[0].question !== undefined;

                    for (var index = 0; index < error_vm.length; index++) {
                        if (vm_is_questionnaire) {
                            if (error_vm[index].question.error.length > 0) {
                                //console.log(error_vm[index].question.error);
                                errorList.push(error_vm[index].question.error);
                            }
                        }
                        else {
                            errorList.push(error_vm[index]);
                        }
                    }
                    seterrors(errorList);

                    if (vm_is_questionnaire)
                        setquestions(error_vm);
                }
                else
                    seterror(error_vm);

                setbtnPressed(false);

            })
        }
    }
    //helper methods for events



    const loadData = async () => {

        try {

            let vminfo = await LoadUserInfo(getUsername())
            setinfo(vminfo);

       

            let vm = await LoadUserProfile(getUsername());
            //console.log(vm);
            setquestions(vm);

            setprofileloaded(true);

        } catch (e) {

        }
    }
    useEffect(() => {
        loadData();
    }, []);

    //components
    const BasicInfo = () => {
        //values for dropdowns
        const [maritalstatuses, setmaritalstatuses] = useState([]);
        const [genders, setgenders] = useState([]);
        //values for dropdowns

        const loadData = async () => {

            try {

                let statuses = await LoadMaritalStatuses();
                setmaritalstatuses(statuses);

                let genderlist = await LoadGenders();
                setgenders(genderlist);

            } catch (e) {

            }
        }

        useEffect(() => {
            loadData();
        }, []);

        return <>
            <div className="info-card mb-20">
                <div className="info-card-title">
                    <h6>Base Info</h6>
                </div>
                <div className="info-card-content profile-form">
                    <ul className="info-list">
                        <li>
                            <p className="info-name">First Name</p>
                            <p className="info-details">
                                <input
                                    onChange={(e) => { info.firstName = e.target.value }}
                                    type="text" defaultValue={info.firstName}></input>
                            </p>
                        </li>
                        <li>
                            <p className="info-name">Last Name</p>
                            <p className="info-details">
                                <input
                                    onChange={(e) => { info.lastName = e.target.value }}
                                    type="text" defaultValue={info.lastName}></input>
                            </p>
                        </li>
                        <li>
                            <p className="info-name">I'm a</p>
                            <p className="info-details">
                                <select id="user-gender" defaultValue={info.genderID}
                                    onChange={(e) => { info.genderID = e.target.value; }}>
                                    {
                                        genders.map((gender, index) => {
                                            return <option key={index} value={gender.id}>{gender.name}</option>
                                        })
                                    }
                                </select>
                            </p>
                        </li>
                        <li>
                            <p className="info-name">Loking for a</p>
                            <p className="info-details">
                                <select id="user-gender" defaultValue={info.seekingGenderID}
                                    onChange={(e) => { info.seekingGenderID = e.target.value; }}>
                                    {
                                        genders.map((gender, index) => {
                                            return <option key={index} value={gender.id}>{gender.name}</option>
                                        })
                                    }
                                </select>
                            </p>
                        </li>
                        <li>
                            <p className="info-name">Marital Status</p>
                            <p className="info-details">
                                <select id="user-maritalstatus"
                                    defaultValue={info.maritalStatusID}
                                    onChange={(e) => { info.maritalStatusID = e.target.value; }} >
                                    {
                                        maritalstatuses.map((status, index) => {
                                            return <option key={index} value={status.id}>{status.name}</option>
                                        })
                                    }
                                </select>
                            </p>
                        </li>
                        <li>
                            <p className="info-name">Date of Birth</p>
                            <div className="info-details">
                                <Calendar onChange={(e) => { info.dob = e.toJSON().slice(0, 10).replace(/-/g, '/'); }} defaultValue={info.dob} />
                            </div>
                        </li>
                        <li>
                            <LocationLocator info={info}></LocationLocator>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    }
    const ProfileQuestions = () => {
        return <>
            {
                questions.length === 0 ? <LoadingDiv /> :
                    questions.map((q, index) => {
                        return <div className={q.question.invalidResponse ? "info-card mb-20 highlight-body" : "info-card mb-20"} key={index}>
                            <div className="info-card-title">
                                <h6>{q.question.shortDesc}</h6>
                            </div>
                            <div className="info-card-content">
                                {
                                    q.question.answers.length === 0 ?
                                        <>
                                            <div>{q.question.text}</div>
                                            <textarea id={"textarea" + index}
                                                onChange={(e) => { q.answerText = e.target.value }}
                                                className="profilequestionnaire-textarea" defaultValue={q.answerText} rows="5" cols="5"></textarea>
                                        </> :
                                        <ul className="info-list">
                                            <li>
                                                <p className="info-name">{q.question.text}</p>
                                                <div className="info-details">
                                                    {
                                                        q.question.answers.map((a, aindex) => {
                                                            return <div key={aindex} className="questionnaire_Control_container">
                                                                {
                                                                    q.question.questionType === 1 ?
                                                                        <label>
                                                                            <input
                                                                                checked={a.selected}
                                                                                onChange={(e) => { update_On_Checkbox(index, aindex, e.target.checked) }}
                                                                                type="checkbox" />{a.text}
                                                                        </label> :
                                                                        q.question.questionType === 2 ?
                                                                            <label>
                                                                                <input
                                                                                    checked={a.selected}
                                                                                    onChange={(e) => { update_On_Radio(index, aindex, e.target.checked) }}
                                                                                    name={q.question.text}
                                                                                    type="radio"
                                                                                    value={a.text} />{a.text}
                                                                            </label>
                                                                            : <></>
                                                                }
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </li>
                                        </ul>
                                }
                            </div>
                        </div>
                    })
            }
        </>
    }
    const SaveButton = () => {
        return <>
            <div className="m-auto">
                <div className=" text-center  ">
                    <ul>
                        {
                            errors.length > 0 ?
                                errors.map((error, i) => {

                                    return <li key={i} className="highlight-error">{error}</li>
                                }) : <></>
                        }
                        <li className="highlight-error">{error}</li>
                    </ul>
                </div>
                <div className="col-sm-3 m-auto banner-form">
                    {!btnPressed &&
                        <button onClick={(e) => submitProfile()}
                            className="smaller lab-btn" type="Submit" >Save Profile</button>
                    }
                </div>
            </div>
        </>
    }

    
    if (!profileloaded) {
        return <LoadingDiv></LoadingDiv>
    }
    else {
        return <>
                <section className="profile-section padding-tb">
                <div className="container">
                    <div className="section-wrapper">
                        <div className="member-profile">
                            <div className="profile-item">
                                <div className="profile-cover">
                                    <img src="assets/images/profile/cover.jpg" alt="cover-pic" />
                                    {/*<div className="edit-photo custom-upload">*/}
                                    {/*    <div className="file-btn"><i className="icofont-camera"></i>*/}
                                    {/*        Edit Photo</div>*/}
                                    {/*    <input type="file" />*/}
                                    {/*</div>*/}
                                </div>
                                <div className="profile-information">
                                    <div className="profile-pic">
                                        <img src={info.profilePic} alt="DP" />
                                        <div className="custom-upload">
                                            <div className="file-btn">
                                                <span className="d-none d-lg-inline-block"
                                                    onClick={(e) => {
                                                        navigate('/editupload',
                                                            {
                                                                state:
                                                                {
                                                                    username: getUsername(),
                                                                    profilePic: info.profilePic
                                                                }
                                                            })
                                                    }}>
                                                    <i className="icofont-camera"></i>Edit</span>
                                                <span className="d-lg-none mr-0"><i className="icofont-plus"></i></span></div>
                                            {/*<input type="file" />*/}
                                        </div>
                                    </div>
                                    <div className="profile-name">
                                        <h4>{info.firstName} {info.lastName} ({info.age}) {info.gender}</h4>
                                        <div className="profile-location">
                                            <div>{info.cityName}</div>
                                            <div> {info.regionName}</div>
                                            <div>{info.countryName}</div>
                                        </div>
                                    </div>
                                    {/*<ul className="profile-contact">*/}
                                    {/*    <li>*/}
                                    {/*        <a href="/#">*/}
                                    {/*            <div className="icon"><i className="icofont-user"></i></div>*/}
                                    {/*            <div className="text">*/}
                                    {/*                <p>Add Friends</p>*/}
                                    {/*            </div>*/}
                                    {/*        </a>*/}
                                    {/*    </li>*/}
                                    {/*    <li>*/}
                                    {/*        <a href="/#">*/}
                                    {/*            <div className="icon"><i className="icofont-envelope"></i></div>*/}
                                    {/*            <div className="text">*/}
                                    {/*                <p>Public Message</p>*/}
                                    {/*            </div>*/}
                                    {/*        </a>*/}
                                    {/*    </li>*/}
                                    {/*    <li>*/}
                                    {/*        <a href="/#">*/}
                                    {/*            <div className="icon"><i className="icofont-envelope"></i></div>*/}
                                    {/*            <div className="text">*/}
                                    {/*                <p>Private Message</p>*/}
                                    {/*            </div>*/}
                                    {/*        </a>*/}
                                    {/*    </li>*/}
                                    {/*</ul>*/}
                                </div>
                            </div>
                            <div className="profile-item d-none">
                                <div className="lab-inner">
                                    <div className="lab-thumb">
                                        <a href="/#"><img src="assets/images/profile/Profile.jpg" alt="profile" /></a>
                                    </div>
                                    <div className="lab-content">
                                        <div className="profile-name">
                                            <div className="p-name-content">
                                                <h4>{info.firstName} {info.lastName} ({info.age}) {info.gender}</h4>
                                                <div className="profile-location">
                                                    <div>{info.cityName}</div>
                                                    <div> {info.regionName}</div>
                                                    <div>{info.countryName}</div>
                                                </div>
                                            </div>
                                            <div className="contact-button">
                                                <button className="contact-btn">
                                                    <i className="icofont-info-circle"></i>
                                                </button>
                                            </div>
                                        </div>
                                        {/*<ul className="profile-contact">*/}
                                        {/*    <li>*/}
                                        {/*        <a href="/#">*/}
                                        {/*            <div className="icon"><i className="icofont-user"></i></div>*/}
                                        {/*            <div className="text">*/}
                                        {/*                <p>Add Friends</p>*/}
                                        {/*            </div>*/}
                                        {/*        </a>*/}
                                        {/*    </li>*/}
                                        {/*    <li>*/}
                                        {/*        <a href="/#">*/}
                                        {/*            <div className="icon"><i className="icofont-envelope"></i></div>*/}
                                        {/*            <div className="text">*/}
                                        {/*                <p>Publice Message</p>*/}
                                        {/*            </div>*/}
                                        {/*        </a>*/}
                                        {/*    </li>*/}
                                        {/*    <li>*/}
                                        {/*        <a href="/#">*/}
                                        {/*            <div className="icon"><i className="icofont-envelope"></i></div>*/}
                                        {/*            <div className="text">*/}
                                        {/*                <p>Private Message</p>*/}
                                        {/*            </div>*/}
                                        {/*        </a>*/}
                                        {/*    </li>*/}
                                        {/*</ul>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="profile-details">
                                <nav className="profile-nav">
                                    {/* <NavTabs username={getUsername()}></NavTabs>*/}
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-ativity-tab" data-bs-toggle="tab"
                                            data-bs-target="#activity" type="button" role="tab" aria-controls="activity"
                                            aria-selected="true">Activity</button>
                                        <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab"
                                            data-bs-target="#profile" type="button" role="tab" aria-controls="profile"
                                            aria-selected="false">Profile</button>
                                        <FriendCount></FriendCount>
                                        <ChatCount ref={ref_chatCount}></ChatCount>
                                        <BlogCount ref={ref_blogCount} username={getUsername()}></BlogCount>
                                        <button className="nav-link" id="nav-createblog-tab" data-bs-toggle="tab"
                                            data-bs-target="#createblog" type="button" role="tab" aria-controls="createblog"
                                            aria-selected="false">Create Blog</button>
                                        {/*<button className="nav-link" id="nav-media-tab" data-bs-toggle="tab" data-bs-target="#media"*/}
                                        {/*    type="button" role="tab" aria-controls="media" aria-selected="false">Media <span*/}
                                        {/*        className="item-number">35</span></button>*/}
                                        {/*<div className="dropdown">*/}
                                        {/*    <a className="btn dropdown-toggle" href="/#" role="button" id="dropdownMenuLink"*/}
                                        {/*        data-bs-toggle="dropdown" aria-expanded="false">*/}
                                        {/*        More*/}
                                        {/*    </a>*/}

                                        {/*    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">*/}
                                        {/*        <li><a className="dropdown-item" href="/#">Activity</a></li>*/}
                                        {/*        <li><a className="dropdown-item" href="/#">Privacy</a></li>*/}
                                        {/*        <li><a className="dropdown-item" href="/#">Block user</a></li>*/}
                                        {/*    </ul>*/}
                                        {/*</div>*/}
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    {/* Activity tab */}
                                    <div className="tab-pane activity-page fade show active" id="activity" role="tabpanel">
                                        <div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <article>
                                                        <div className="activity-tab">
                                                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                                {/*<li className="nav-item" role="presentation">*/}
                                                                {/*    <button className="nav-link" id="pills-personal-tab"*/}
                                                                {/*        data-bs-toggle="pill" data-bs-target="#pills-personal"*/}
                                                                {/*        type="button" role="tab" aria-controls="pills-personal"*/}
                                                                {/*        aria-selected="false"><i className="icofont-user"></i>*/}
                                                                {/*        Personal</button>*/}
                                                                {/*</li>*/}
                                                                {/*<li className="nav-item" role="presentation">*/}
                                                                {/*    <button className="nav-link " id="pills-mentions-tab"*/}
                                                                {/*        data-bs-toggle="pill" data-bs-target="#pills-mentions"*/}
                                                                {/*        type="button" role="tab" aria-controls="pills-mentions"*/}
                                                                {/*        aria-selected="false"><i className="icofont-edit"></i>*/}
                                                                {/*        Mentions</button>*/}
                                                                {/*</li>*/}
                                                                {/*<li className="nav-item" role="presentation">*/}
                                                                {/*    <button className="nav-link" id="pills-favorites-tab"*/}
                                                                {/*        data-bs-toggle="pill" data-bs-target="#pills-favorites"*/}
                                                                {/*        type="button" role="tab" aria-controls="pills-favorites"*/}
                                                                {/*        aria-selected="false"><i className="icofont-heart-alt"></i>*/}
                                                                {/*        Favorites</button>*/}
                                                                {/*</li>*/}
                                                                <li className="nav-item" role="presentation">
                                                                    <PendingFriendRequests ref={ref_pendingFriendRequests} ></PendingFriendRequests>
                                                                </li>
                                                                {/*<li className="nav-item" role="presentation">*/}
                                                                {/*    <button className="nav-link" id="pills-messages-tab"*/}
                                                                {/*        data-bs-toggle="pill" data-bs-target="#pills-messages"*/}
                                                                {/*        type="button" role="tab" aria-controls="pills-messages"*/}
                                                                {/*        aria-selected="false"><i className="icofont-users"></i>*/}
                                                                {/*        Messages</button>*/}
                                                                {/*</li>*/}
                                                            </ul>
                                                            <div className="tab-content activity-content" id="pills-tabContent">
                                                                <div className="tab-pane fade" id="pills-personal" role="tabpanel"
                                                                    aria-labelledby="pills-personal-tab">
                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/*post-description*/}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {/*post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/*post-content*/}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* post-description*/}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/*post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                                <div className="post-desc-img">
                                                                                    <div className="row g-3">
                                                                                        <div className="col-md-6">
                                                                                            <img src="assets/images/profile/post-image/02.jpg"
                                                                                                alt="img" />
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                            <img src="assets/images/profile/post-image/03.jpg"
                                                                                                alt="img" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="load-btn">
                                                                        <a href="#" className="lab-btn">Load More Post <i
                                                                            className="icofont-spinner"></i></a>
                                                                    </div>
                                                                </div>
                                                                <div className="tab-pane fade mentions-section "
                                                                    id="pills-mentions" role="tabpanel"
                                                                    aria-labelledby="pills-mentions-tab">

                                                                    {/*Create post */}
                                                                    <div className="create-post mb-20">
                                                                        <div className="lab-inner">
                                                                            <div className="lab-thumb">
                                                                                <div className="thumb-inner">
                                                                                    <div className="thumb-img">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="thumb-content">
                                                                                        <h6><a href="#">
                                                                                            {info.firstName} {info.lastName}
                                                                                        </a>
                                                                                        </h6>
                                                                                        <div className="custom-select">
                                                                                            <select>
                                                                                                <option value="1">&#xf02c;
                                                                                                    Public</option>
                                                                                                <option value="2">&#xec61;
                                                                                                    Private</option>
                                                                                                <option value="3">&#xed0d;
                                                                                                    Friends</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="lab-content">
                                                                                <form action="#" className="post-form">
                                                                                    <input type="text"
                                                                                        placeholder="Whats on your mind. William?" />
                                                                                    <div className="content-type">
                                                                                        <ul className="content-list">
                                                                                            <li className="text"><a href="#">
                                                                                                <i className="icofont-edit"></i>
                                                                                                Text
                                                                                            </a></li>
                                                                                            <li className="image-video">
                                                                                                <div className="file-btn"><i
                                                                                                    className="icofont-camera"></i>
                                                                                                    Photo/Videos</div>
                                                                                                <input type="file" />
                                                                                            </li>
                                                                                            <li className="attach-file">
                                                                                                <div className="file-btn"><i
                                                                                                    className="icofont-paper-clip"></i>
                                                                                                    Attach File</div>
                                                                                                <input type="file" />
                                                                                            </li>
                                                                                            <li className="post-submit">
                                                                                                <input type="submit"
                                                                                                    value="Post"
                                                                                                    className="lab-btn" />
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/*post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                                <div className="post-desc-img">
                                                                                    <img src="assets/images/profile/post-image/01.jpg"
                                                                                        alt="img" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/*post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                                <div className="post-desc-img">
                                                                                    <div className="row g-3">
                                                                                        <div className="col-md-6">
                                                                                            <img src="assets/images/profile/post-image/02.jpg"
                                                                                                alt="img" />
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                            <img src="assets/images/profile/post-image/03.jpg"
                                                                                                alt="img" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta*/}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="load-btn">
                                                                        <a href="#" className="lab-btn">Load More Post <i
                                                                            className="icofont-spinner"></i></a>
                                                                    </div>
                                                                </div>
                                                                <div className="tab-pane fade" id="pills-favorites" role="tabpanel"
                                                                    aria-labelledby="pills-favorites-tab">

                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                                <div className="post-desc-img">
                                                                                    <img src="assets/images/profile/post-image/01.jpg"
                                                                                        alt="img" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                                <div className="post-desc-img">
                                                                                    <div className="row g-3">
                                                                                        <div className="col-md-6">
                                                                                            <img src="assets/images/profile/post-image/02.jpg"
                                                                                                alt="img" />
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                            <img src="assets/images/profile/post-image/03.jpg"
                                                                                                alt="img" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="load-btn">
                                                                        <a href="#" className="lab-btn">Load More Post <i
                                                                            className="icofont-spinner"></i></a>
                                                                    </div>
                                                                </div>
                                                                <div className="tab-pane fade active show" id="pills-friends" role="tabpanel"
                                                                    aria-labelledby="pills-friends-tab">
                                                                    <ActivityFriends
                                                                        reloadData_pendingFriendRequests={() => {
                                                                            ref_pendingFriendRequests.current.reloadData();
                                                                        }}
                                                                        username={getUsername()}></ActivityFriends>
                                                                </div>
                                                                <div className="tab-pane fade" id="pills-messages" role="tabpanel"
                                                                    aria-labelledby="pills-messages-tab">
                                                                    {/* post item */}
                                                                    <div className="post-item mb-20">
                                                                        {/* post-content */}
                                                                        <div className="post-content">
                                                                            {/* post-author */}
                                                                            <div className="post-author">
                                                                                <div className="post-author-inner">
                                                                                    <div className="author-thumb">
                                                                                        <img src="assets/images/profile/dp.png"
                                                                                            alt="img" />
                                                                                    </div>
                                                                                    <div className="author-details">
                                                                                        <h6><a href="#">{info.firstName} {info.lastName}</a></h6>
                                                                                        <ul className="post-status">
                                                                                            <li className="post-privacy"><i
                                                                                                className="icofont-world"></i>
                                                                                                Public</li>
                                                                                            <li className="post-time">6 Mintues Ago
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* post-description */}
                                                                            <div className="post-description">
                                                                                <p>Quickly deliver going forward methods info
                                                                                    create empowerment before client-centered
                                                                                    bandwdth
                                                                                    Credibly pontficate interoperable leadership
                                                                                    skills ands B2B data awesome Continually
                                                                                    whiteboard
                                                                                    ands B2B data awesome Continually whiteboard

                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {/* post meta */}
                                                                        <div className="post-meta">
                                                                            <div className="post-meta-top">
                                                                                <p><a href="#"><i className="icofont-like"></i> <i
                                                                                    className="icofont-heart"></i> <i
                                                                                        className="icofont-laughing"></i>
                                                                                    <span>Julia,
                                                                                        Petrova and 306 like this</span></a>
                                                                                </p>
                                                                                <p>
                                                                                    <a href="#">136 Comments</a>
                                                                                </p>
                                                                            </div>
                                                                            <div className="post-meta-bottom">
                                                                                <ul className="react-list">
                                                                                    <li className="react"><a href="#"><i
                                                                                        className="icofont-like"></i>
                                                                                        Like</a> </li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i
                                                                                            className="icofont-speech-comments"></i>
                                                                                        Comment
                                                                                    </a></li>
                                                                                    <li className="react"><a href="#">
                                                                                        <i className="icofont-share"></i> Share
                                                                                    </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="load-btn">
                                                                        <a href="#" className="lab-btn">Load More Post <i
                                                                            className="icofont-spinner"></i></a>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </article>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Profile tab */}
                                    <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                        <div className="row">
                                            <div className="col-12">
                                                <article>
                                                    <BasicInfo></BasicInfo>
                                                    <ProfileQuestions></ProfileQuestions>
                                                </article>
                                                <div className="container">
                                                    <SaveButton></SaveButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Frinds Tab */}
                                    <div className="tab-pane fade" id="friends" role="tabpanel" aria-labelledby="nav-friends-tab">
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <article>
                                                    <FriendProfileList></FriendProfileList>
                                                </article>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Group Tab */}
                                    <div className="tab-pane fade" id="messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                                        <div className="row">
                                            <div className="col-12">
                                                <article>
                                                    <div className="row gy-3">
                                                        <div className="group-item lab-item style-1">
                                                            <div className="lab-inner align-items-center p-4">
                                                                <Routes>
                                                                    <Route path="/" element={<ChatSummary />} />
                                                                    <Route path="/chatsummary" element={<ChatSummary />} />
                                                                    <Route path="/editblog" element={<ChatSummary />} />
                                                                    <Route path="/chatmessages" element={<ChatMessages loadChatCount={ref_chatCount?.current?.reloadData} />} />
                                                                </Routes>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blog Tab */}
                                    <div className="tab-pane fade" id="blogs" role="tabpanel" aria-labelledby="nav-blogs-tab">
                                        <div className="container blog-section">
                                            <div className="main-blog">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <Routes>
                                                            <Route path="/" element={<Blogs ref={ref_blogs} editMode={true} username={getUsername()}></Blogs>} />
                                                            <Route path="/editprofile" element={<Blogs ref={ref_blogs} editMode={true} username={getUsername()}></Blogs>} />
                                                            <Route path="/chatsummary" element={<Blogs ref={ref_blogs} editMode={true} username={getUsername()}></Blogs>} />
                                                            <Route path="/chatmessages" element={<Blogs ref={ref_blogs} editMode={true} username={getUsername()}></Blogs>} />
                                                            <Route path="/editblog" element={<EditBlog />} />
                                                        </Routes>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Create Blog Tab */}
                                    <div className="tab-pane fade" id="createblog" role="tabpanel" aria-labelledby="nav-createblog-tab">
                                        <div className="container blog-section">
                                            <div className="main-blog">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <CreateBlog
                                                            loadBlogCount={ref_blogCount?.current?.reloadData}
                                                            loadBlogs={ref_blogs?.current?.reloadData}
                                                            username={getUsername()}></CreateBlog>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
             </>
    }

     
}