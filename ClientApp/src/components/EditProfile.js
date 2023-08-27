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
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';

export const EditProfile = () => {

    const ref_pendingFriendRequests = useRef(null);
    const ref_chatCount = useRef(null);
    //profile questions
    const [questions, setquestions] = useState([]);
    //basic info
    const [info, setinfo] = useState({});
    const [errors, seterrors] = useState([]);
    const [error, seterror] = useState('');
    //basic info

    //values for dropdowns
    const [maritalstatuses, setmaritalstatuses] = useState([]);
    const [genders, setgenders] = useState([]);
    //values for dropdowns

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
            
            let statuses = await LoadMaritalStatuses();
            setmaritalstatuses(statuses);

            let genderlist = await LoadGenders();
            setgenders(genderlist);
            
            let vm = await LoadUserProfile(getUsername());
            //console.log(vm);
            setquestions(vm);

        } catch (e) {

        }
    }
    useEffect(() => {
        loadData();
    }, []);

    //components
    const BasicInfo = () => {
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
    //components
    
    return <section className="profile-section padding-tb">
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
                                <img src={info.profilePic } alt="DP" />
                                <div className="custom-upload">
                                    <div className="file-btn">
                                        <span className="d-none d-lg-inline-block"
                                            onClick={(e) => {
                                                navigate('/editupload',
                                                    {
                                                        state:
                                                        {
                                                            username: getUsername(),
                                                            profilePic : info.profilePic
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
                                <ul className="profile-contact">
                                    <li>
                                        <a href="/#">
                                            <div className="icon"><i className="icofont-user"></i></div>
                                            <div className="text">
                                                <p>Add Friends</p>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/#">
                                            <div className="icon"><i className="icofont-envelope"></i></div>
                                            <div className="text">
                                                <p>Publice Message</p>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/#">
                                            <div className="icon"><i className="icofont-envelope"></i></div>
                                            <div className="text">
                                                <p>Private Message</p>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="profile-details">
                        <nav className="profile-nav">
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <button className="nav-link active" id="nav-ativity-tab" data-bs-toggle="tab"
                                    data-bs-target="#activity" type="button" role="tab" aria-controls="activity"
                                    aria-selected="true">Activity</button>
                                <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab"
                                    data-bs-target="#profile" type="button" role="tab" aria-controls="profile"
                                    aria-selected="false">Profile</button>
                                <FriendCount></FriendCount>
                                <ChatCount ref={ref_chatCount}></ChatCount>
                                {/*<button className="nav-link" id="nav-photos-tab" data-bs-toggle="tab"*/}
                                {/*    data-bs-target="#photos" type="button" role="tab" aria-controls="photos"*/}
                                {/*    aria-selected="false">Photos</button>*/}
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
                                        <div className="col-xl-8">
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                    {info.firstName} {info.lastName }
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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
                                                                                <h6><a href="#">{info.firstName} {info.lastName }</a></h6>
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

                                        {/* Aside Part */}
                                        <div className="col-xl-4">
                                            <aside className="mt-5 mt-xl-0">
                                                <div className="widget search-widget">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>Filter Search Member</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <p>Serious Dating With TuruLav Your Perfect
                                                                Match is Just a Click Away.</p>
                                                            <form action="/" className="banner-form">
                                                                <div className="gender">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">I am a </option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="person">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Looking for</option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="age">
                                                                    <div
                                                                        className="right d-flex justify-content-between w-100">
                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">18</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>

                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">36</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="city">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Choose Your Country
                                                                            </option>
                                                                            <option value="1">USA</option>
                                                                            <option value="2">UK</option>
                                                                            <option value="3">Spain</option>
                                                                            <option value="4">Brazil</option>
                                                                            <option value="5">France</option>
                                                                            <option value="6">Newzeland</option>
                                                                            <option value="7">Australia</option>
                                                                            <option value="8">Bangladesh</option>
                                                                            <option value="9">Turki</option>
                                                                            <option value="10">Chine</option>
                                                                            <option value="11">India</option>
                                                                            <option value="12">Canada</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="interest">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Your Interests
                                                                            </option>
                                                                            <option value="1">Gaming</option>
                                                                            <option value="2">Fishing</option>
                                                                            <option value="3">Skydriving</option>
                                                                            <option value="4">Swimming</option>
                                                                            <option value="5">Racing</option>
                                                                            <option value="6">Hangout</option>
                                                                            <option value="7">Tranvelling</option>
                                                                            <option value="8">Camping</option>
                                                                            <option value="9">Touring</option>
                                                                            <option value="10">Acting</option>
                                                                            <option value="11">Dancing</option>
                                                                            <option value="12">Singing</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <button className="">Find Your Partner</button>

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget like-member">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>you may like</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="row row-cols-3 row-cols-sm-auto g-3">
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/01.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/02.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/03.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/04.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/05.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/06.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/07.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/08.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/09.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget active-group">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>join the group</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A1</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">12+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn"><i
                                                                                className="icofont-users-alt-5"></i>View
                                                                            Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A2</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">16+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn"><i
                                                                                className="icofont-users-alt-5"></i>View
                                                                            Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </aside>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/*Profile tab */}
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                <div>
                                    <div className="row">
                                        <div className="col-xl-8">
                                            <article>
                                                <BasicInfo></BasicInfo>
                                                <ProfileQuestions></ProfileQuestions>
                                            </article>
                                            <div className="container">
                                                <SaveButton></SaveButton>
                                            </div>
                                        </div>

                                        {/* Aside Part */}
                                        <div className="col-xl-4">
                                            <aside className="mt-5 mt-xl-0">
                                                <div className="widget search-widget">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>Filter Search Member</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <p>Serious Dating With TuruLav Your Perfect
                                                                Match is Just a Click Away.</p>
                                                            <form action="/" className="banner-form">
                                                                <div className="gender">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">I am a </option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="person">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Looking for</option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="age">
                                                                    <div
                                                                        className="right d-flex justify-content-between w-100">
                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">18</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>

                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">36</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="city">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Choose Your Country
                                                                            </option>
                                                                            <option value="1">USA</option>
                                                                            <option value="2">UK</option>
                                                                            <option value="3">Spain</option>
                                                                            <option value="4">Brazil</option>
                                                                            <option value="5">France</option>
                                                                            <option value="6">Newzeland</option>
                                                                            <option value="7">Australia</option>
                                                                            <option value="8">Bangladesh</option>
                                                                            <option value="9">Turki</option>
                                                                            <option value="10">Chine</option>
                                                                            <option value="11">India</option>
                                                                            <option value="12">Canada</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="interest">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Your Interests
                                                                            </option>
                                                                            <option value="1">Gaming</option>
                                                                            <option value="2">Fishing</option>
                                                                            <option value="3">Skydriving</option>
                                                                            <option value="4">Swimming</option>
                                                                            <option value="5">Racing</option>
                                                                            <option value="6">Hangout</option>
                                                                            <option value="7">Tranvelling</option>
                                                                            <option value="8">Camping</option>
                                                                            <option value="9">Touring</option>
                                                                            <option value="10">Acting</option>
                                                                            <option value="11">Dancing</option>
                                                                            <option value="12">Singing</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <button className="">Find Your Partner</button>

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget like-member">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>you may like</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="row row-cols-3 row-cols-sm-auto g-3">
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/01.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/02.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/03.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/04.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/05.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/06.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/07.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/08.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/09.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget active-group">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>join the group</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A1</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">12+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn">
                                                                            <i className="icofont-users-alt-5"></i>
                                                                            View Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A2</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">16+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn">
                                                                            <i className="icofont-users-alt-5"></i>
                                                                            View Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </aside>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Frinds Tab */}
                            <div className="tab-pane fade" id="friends" role="tabpanel" aria-labelledby="nav-friends-tab">
                                <div>
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <article>
                                                <FriendProfileList></FriendProfileList>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Group Tab */}
                            <div className="tab-pane fade" id="messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                                <div>
                                    <div className="row">
                                        <div className="col-xl-8">
                                            <article>
                                                <div className="row gy-3">
                                                    <div className="col-12">
                                                        <div className="group-item lab-item style-1">
                                                            <div className="lab-inner align-items-center p-4">
                                                                    <nav>
                                                                    <NavLink to="/editprofile/chatsummary"></NavLink>
                                                                        <NavLink to="/editprofile/chatmessages"></NavLink>
                                                                    </nav>
                                                                    <Routes>
                                                                    <Route path="/" element={<ChatSummary />} />
                                                                    <Route path="/chatsummary" element={<ChatSummary />} />
                                                                    <Route path="/chatmessages" element={<ChatMessages loadChatCount={ref_chatCount?.current?.reloadData} />} />
                                                                    </Routes>
                                                            </div>
                                                        </div>
                                                    </div>
                                                   
                                                </div>
                                            </article>
                                        </div>

                                        {/* Aside Part */}
                                        <div className="col-xl-4">
                                            <aside className="mt-5 mt-xl-0">
                                                <div className="widget search-widget">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>Filter Search Member</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <p>Serious Dating With TuruLav Your Perfect
                                                                Match is Just a Click Away.</p>
                                                            <form action="/" className="banner-form">
                                                                <div className="gender">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">I am a </option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="person">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Looking for</option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="age">
                                                                    <div
                                                                        className="right d-flex justify-content-between w-100">
                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">18</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>

                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">36</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="city">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Choose Your Country
                                                                            </option>
                                                                            <option value="1">USA</option>
                                                                            <option value="2">UK</option>
                                                                            <option value="3">Spain</option>
                                                                            <option value="4">Brazil</option>
                                                                            <option value="5">France</option>
                                                                            <option value="6">Newzeland</option>
                                                                            <option value="7">Australia</option>
                                                                            <option value="8">Bangladesh</option>
                                                                            <option value="9">Turki</option>
                                                                            <option value="10">Chine</option>
                                                                            <option value="11">India</option>
                                                                            <option value="12">Canada</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="interest">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Your Interests
                                                                            </option>
                                                                            <option value="1">Gaming</option>
                                                                            <option value="2">Fishing</option>
                                                                            <option value="3">Skydriving</option>
                                                                            <option value="4">Swimming</option>
                                                                            <option value="5">Racing</option>
                                                                            <option value="6">Hangout</option>
                                                                            <option value="7">Tranvelling</option>
                                                                            <option value="8">Camping</option>
                                                                            <option value="9">Touring</option>
                                                                            <option value="10">Acting</option>
                                                                            <option value="11">Dancing</option>
                                                                            <option value="12">Singing</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <button className="">Find Your Partner</button>

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget like-member">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>you may like</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="row row-cols-3 row-cols-sm-auto g-3">
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/01.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/02.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/03.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/04.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/05.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/06.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/07.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/08.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/09.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget active-group">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>join the group</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A1</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">12+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn">
                                                                            <i className="icofont-users-alt-5"></i>
                                                                            View Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A2</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">16+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn">
                                                                            <i className="icofont-users-alt-5"></i>
                                                                            View Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </aside>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Photos Tab */}
                            <div className="tab-pane fade" id="photos" role="tabpanel" aria-labelledby="nav-photos-tab">
                                <div className="photo-title text-center border-radius-2 bg-theme p-1 mb-4">
                                    <h3 className="mb-0">All Uploaded Pictures</h3>
                                </div>
                                <div
                                    className="row g-3 g-lg-4 justify-content-center row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/03.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/02.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/01.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/04.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/05.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/06.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/07.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/08.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/09.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/10.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/11.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/12.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/13.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/14.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/15.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/16.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/17.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/18.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/19.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="gallery-img">
                                            <img src="assets/images/member/20.jpg" alt="image" className="rounded" />

                                        </div>
                                    </div>
                                </div>
                                <div className="load-btn">
                                    <a href="#" className="lab-btn">Load More<i className="icofont-spinner"></i></a>
                                </div>
                            </div>
                            {/* Media Tab */}
                            <div className="tab-pane fade" id="media" role="tabpanel" aria-labelledby="nav-media-tab">
                                <div>
                                    <div className="row">
                                        <div className="col-xl-8">
                                            <article>
                                                <div className="media-wrapper">
                                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link active" id="all-media-tab"
                                                                data-bs-toggle="tab" data-bs-target="#all-media"
                                                                type="button" role="tab" aria-controls="all-media"
                                                                aria-selected="true"><i className="icofont-star"></i> All
                                                                Media</button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link" id="album-tab" data-bs-toggle="tab"
                                                                data-bs-target="#album" type="button" role="tab"
                                                                aria-controls="album" aria-selected="false"><i
                                                                    className="icofont-layout"></i> Albums
                                                                <span>04</span></button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link" id="photos-media-tab"
                                                                data-bs-toggle="tab" data-bs-target="#photos-media"
                                                                type="button" role="tab" aria-controls="photos-media"
                                                                aria-selected="false"><i className="icofont-image"></i>
                                                                Photos <span>12</span></button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link" id="video-tab" data-bs-toggle="tab"
                                                                data-bs-target="#video" type="button" role="tab"
                                                                aria-controls="video" aria-selected="false"><i
                                                                    className="icofont-video-alt"></i> Videos
                                                                <span>0</span></button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link" id="music-tab" data-bs-toggle="tab"
                                                                data-bs-target="#music" type="button" role="tab"
                                                                aria-controls="music" aria-selected="false"><i
                                                                    className="icofont-music-disk"></i> Music
                                                                <span>0</span></button>
                                                        </li>
                                                    </ul>
                                                    <div className="tab-content" id="myTabContent">
                                                        {/* All Media Tab */}
                                                        <div className="tab-pane fade show active" id="all-media"
                                                            role="tabpanel" aria-labelledby="all-media-tab">
                                                            <div className="media-title">
                                                                <h3>Media Gallery</h3>
                                                            </div>
                                                            <div className="media-content">
                                                                <ul className="media-upload">
                                                                    <li className="upload-now">
                                                                        <div className="custom-upload">
                                                                            <div className="file-btn"><i
                                                                                className="icofont-upload-alt"></i>
                                                                                Upload</div>
                                                                            <input type="file" />
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                                <div
                                                                    className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-4 g-3">
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/01.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/02.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/03.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/04.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/05.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/06.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/07.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/08.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/09.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/10.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/11.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/12.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/03.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/02.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="load-btn">
                                                                    <a href="#" className="lab-btn">Load More<i
                                                                        className="icofont-spinner"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Albums */}
                                                        <div className="tab-pane fade" id="album" role="tabpanel"
                                                            aria-labelledby="album-tab">
                                                            <div className="media-title">
                                                                <h3>Album Lists</h3>
                                                            </div>
                                                            <div className="media-content">
                                                                <ul className="media-upload">
                                                                    <li className="upload-now">
                                                                        <div className="custom-upload">
                                                                            <div className="file-btn"><i
                                                                                className="icofont-upload-alt"></i>
                                                                                Upload</div>
                                                                            <input type="file" />
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                                <div className="row g-4">
                                                                    <div className="col-lg-4 col-sm-6">
                                                                        <div className="album text-center">
                                                                            <div className="album-thumb">
                                                                                <a href="#">
                                                                                    <img src="assets/images/member/02.jpg"
                                                                                        alt="album" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="album-content">
                                                                                <h6>Private</h6>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4 col-sm-6">
                                                                        <div className="album text-center">
                                                                            <div className="album-thumb">
                                                                                <a href="#">
                                                                                    <img src="assets/images/member/03.jpg"
                                                                                        alt="album" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="album-content">
                                                                                <h6>Crush</h6>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4 col-sm-6">
                                                                        <div className="album text-center">
                                                                            <div className="album-thumb">
                                                                                <a href="#">
                                                                                    <img src="assets/images/member/06.jpg"
                                                                                        alt="album" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="album-content">
                                                                                <h6>Public</h6>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4 col-sm-6">
                                                                        <div className="album text-center">
                                                                            <div className="album-thumb">
                                                                                <a href="#">
                                                                                    <img src="assets/images/member/08.jpg"
                                                                                        alt="album" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="album-content">
                                                                                <h6>Favorite</h6>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="load-btn">
                                                                    <a href="#" className="lab-btn">Load More<i
                                                                        className="icofont-spinner"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Photos */}
                                                        <div className="tab-pane fade" id="photos-media" role="tabpanel"
                                                            aria-labelledby="photos-media-tab">
                                                            <div className="media-title">
                                                                <h2>All Photos</h2>
                                                            </div>
                                                            <div className="media-content">
                                                                <ul className="media-upload">
                                                                    <li className="upload-now">
                                                                        <div className="custom-upload">
                                                                            <div className="file-btn"><i
                                                                                className="icofont-upload-alt"></i>
                                                                                Upload</div>
                                                                            <input type="file" />
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                                <div
                                                                    className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-4 g-3">
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/01.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/02.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/03.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/04.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/05.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/06.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/07.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/08.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/09.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/10.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/11.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/12.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/03.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="media-thumb">
                                                                            <img src="assets/images/member/02.jpg"
                                                                                alt="img" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="load-btn">
                                                                    <a href="#" className="lab-btn">Load More<i
                                                                        className="icofont-spinner"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Videos */}
                                                        <div className="tab-pane fade" id="video" role="tabpanel"
                                                            aria-labelledby="video-tab">
                                                            <div className="media-title">
                                                                <h3>All Videos</h3>
                                                            </div>
                                                            <div className="media-content">
                                                                <ul className="media-upload">
                                                                    <li className="upload-now">
                                                                        <div className="custom-upload">
                                                                            <div className="file-btn"><i
                                                                                className="icofont-upload-alt"></i>
                                                                                Upload</div>
                                                                            <input type="file" />
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                                <div className="row">
                                                                    <div className="col">
                                                                        <p><i className="icofont-worried"></i> Sorry !!
                                                                            There's no media found for the
                                                                            request !! </p>
                                                                    </div>
                                                                </div>
                                                                <div className="load-btn">
                                                                    <a href="#" className="lab-btn">Load More<i
                                                                        className="icofont-spinner"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Music */}
                                                        <div className="tab-pane fade" id="music" role="tabpanel"
                                                            aria-labelledby="music-tab">
                                                            <div className="media-title">
                                                                <h3>All Music</h3>
                                                            </div>
                                                            <div className="media-content">
                                                                <ul className="media-upload">
                                                                    <li className="upload-now">
                                                                        <div className="custom-upload">
                                                                            <div className="file-btn"><i
                                                                                className="icofont-upload-alt"></i>
                                                                                Upload</div>
                                                                            <input type="file" />
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                                <div className="row">
                                                                    <div className="col">
                                                                        <p><i className="icofont-worried"></i> Sorry !!
                                                                            There's no media found for the
                                                                            request !! </p>
                                                                    </div>
                                                                </div>
                                                                <div className="load-btn">
                                                                    <a href="#" className="lab-btn">Load More<i
                                                                        className="icofont-spinner"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </article>
                                        </div>
                                        {/* Aside Part */}
                                        <div className="col-xl-4">
                                            <aside className="mt-5 mt-xl-0">
                                                <div className="widget search-widget">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>Filter Search Member</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <p>Serious Dating With TuruLav Your Perfect
                                                                Match is Just a Click Away.</p>
                                                            <form action="/" className="banner-form">
                                                                <div className="gender">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">I am a </option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="person">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Looking for</option>
                                                                            <option value="1">Male</option>
                                                                            <option value="2">Female</option>
                                                                            <option value="3">Others</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="age">
                                                                    <div
                                                                        className="right d-flex justify-content-between w-100">
                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">18</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>

                                                                        <div className="custom-select">
                                                                            <select>
                                                                                <option value="1">36</option>
                                                                                <option value="2">19</option>
                                                                                <option value="3">20</option>
                                                                                <option value="4">21</option>
                                                                                <option value="5">22</option>
                                                                                <option value="6">23</option>
                                                                                <option value="7">24</option>
                                                                                <option value="8">25</option>
                                                                                <option value="9">26</option>
                                                                                <option value="10">27</option>
                                                                                <option value="11">28</option>
                                                                                <option value="13">29</option>
                                                                                <option value="14">30</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="city">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Choose Your Country
                                                                            </option>
                                                                            <option value="1">USA</option>
                                                                            <option value="2">UK</option>
                                                                            <option value="3">Spain</option>
                                                                            <option value="4">Brazil</option>
                                                                            <option value="5">France</option>
                                                                            <option value="6">Newzeland</option>
                                                                            <option value="7">Australia</option>
                                                                            <option value="8">Bangladesh</option>
                                                                            <option value="9">Turki</option>
                                                                            <option value="10">Chine</option>
                                                                            <option value="11">India</option>
                                                                            <option value="12">Canada</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="interest">
                                                                    <div className="custom-select right w-100">
                                                                        <select className="">
                                                                            <option value="0">Your Interests
                                                                            </option>
                                                                            <option value="1">Gaming</option>
                                                                            <option value="2">Fishing</option>
                                                                            <option value="3">Skydriving</option>
                                                                            <option value="4">Swimming</option>
                                                                            <option value="5">Racing</option>
                                                                            <option value="6">Hangout</option>
                                                                            <option value="7">Tranvelling</option>
                                                                            <option value="8">Camping</option>
                                                                            <option value="9">Touring</option>
                                                                            <option value="10">Acting</option>
                                                                            <option value="11">Dancing</option>
                                                                            <option value="12">Singing</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <button className="">Find Your Partner</button>

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget like-member">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>you may like</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="row row-cols-3 row-cols-sm-auto g-3">
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/01.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/02.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/03.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/04.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/05.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/06.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/07.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/08.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="image-thumb">
                                                                        <a href="#">
                                                                            <img src="assets/images/widget/09.jpg"
                                                                                alt="img" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="widget active-group">
                                                    <div className="widget-inner">
                                                        <div className="widget-title">
                                                            <h5>join the group</h5>
                                                        </div>
                                                        <div className="widget-content">
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A1</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">12+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn">
                                                                            <i className="icofont-users-alt-5"></i>
                                                                            View Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="group-item lab-item">
                                                                <div
                                                                    className="lab-inner d-flex flex-wrap align-items-center">
                                                                    <div className="lab-content w-100">
                                                                        <h6>Active Group A2</h6>
                                                                        <p>Colabors atively fabcate best breed and
                                                                            apcations through visionary</p>
                                                                        <ul className="img-stack d-flex">
                                                                            <li><img src="assets/images/group/group-mem/01.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/02.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/03.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/04.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/05.png"
                                                                                alt="member-img" /></li>
                                                                            <li><img src="assets/images/group/group-mem/06.png"
                                                                                alt="member-img" /></li>
                                                                            <li className="bg-theme">16+</li>
                                                                        </ul>
                                                                        <div className="test"> <a href="profile.html"
                                                                            className="lab-btn">
                                                                            <i className="icofont-users-alt-5"></i>
                                                                            View Group</a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </aside>
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



}