import { useEffect, useState } from 'react'
import { LoadingDiv } from './LoadingDiv'
import { LoadUserProfile, LoadUserInfo } from '../Services/Services'
/*import { UserStore } from './UserStore'*/
import { useLocation } from 'react-router-dom';
import { CompleteProfileOption } from './CompleteProfileOption'
import { AsideSearch } from './AsideSearch'
import { Blogs } from './Blogs'
import { BlogCount } from './BlogCount'

export const Profile = () => {

    //basic info
    const [info, setinfo] = useState({});
    const [infoerror, setinfoerror] = useState('');
    const [infoloaded, setinfoloaded] = useState(false);
    //basic info

    //profile questions
    const [questions, setquestions] = useState([]);
    const [questionserror, setquestionserror] = useState('');
    const [questionsloaded, setquestionsloaded] = useState(false);
    //profile questions

    //get username from path
    const location = useLocation();
    let { username } = location.state;
    //get username from path

    const loadData = async () => {

        try {
            let vminfo = await LoadUserInfo(username)
            setinfo(vminfo);
            setinfoloaded(true);
            // console.log(vminfo);
        }
        catch (response) {
            response.json().then((e) => {
                setinfoerror(e);
            })
        }

        try {
            let vm = await LoadUserProfile(username);
            setquestions(vm);
            setquestionsloaded(true);
        } 
        catch (response) {
            response.json().then((e) => {
                setquestionserror(e);
            })
        }
    }
    useEffect(() => {
        loadData();
    }, []);

    //components
    const BasicInfo = () => {
        return <>
            {
                !infoloaded && infoerror.length === 0 ? <LoadingDiv></LoadingDiv> :
                    infoerror.length > 0 ?
                        <CompleteProfileOption infoerror={infoerror}></CompleteProfileOption> :
                        <div className="info-card mb-20">
                            <div className="info-card-title">
                                <h6>Base Info</h6>
                            </div>
                            <div className="info-card-content profile-form">
                                <ul className="info-list">
                                    <li>
                                        <p className="info-name">First Name</p>
                                        <p className="info-details">
                                            <label>{info.firstName}</label>
                                        </p>
                                    </li>
                                    <li>
                                        <p className="info-name">Last Name</p>
                                        <p className="info-details">
                                            <label>{info.lastName}</label>
                                        </p>
                                    </li>
                                    <li>
                                        <p className="info-name">I'm a</p>
                                        <p className="info-details">
                                            <label>{info.gender}</label>
                                        </p>
                                    </li>
                                    <li>
                                        <p className="info-name">Loking for a</p>
                                        <p className="info-details">
                                            <label>{info.seekingGender}</label>
                                        </p>
                                    </li>
                                    <li>
                                        <p className="info-name">Marital Status</p>
                                        <p className="info-details">
                                            <label>{info.maritalStatus}</label>
                                        </p>
                                    </li>
                                    <li>
                                        <p className="info-name">Age</p>
                                        <p className="info-details">
                                            <label>{info.age}</label>
                                        </p>
                                    </li>
                                    <li>
                                        <p className="info-name">Address</p>
                                        <div className="info-details">
                                            <div className="mb-3 region-container-viewmode">
                                                <div>Country</div>
                                                <label>{info.countryName}</label>
                                            </div>
                                            <div className="mb-3 region-container-viewmode">
                                                <div>Region</div>
                                                <label>{info.regionName}</label>
                                            </div>
                                            <div className="mb-3 region-container-viewmode">
                                                <div>City</div>
                                                <label>{info.cityName}</label>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
            }
        </>
    }
    const ProfileQuestions = () => {
        return <>
            {
                !questionsloaded && questionserror.length === 0 ? <LoadingDiv></LoadingDiv> :
                    questionserror.length > 0 ? <></> :
                        questions.map((q, index) => {
                            return <div className="info-card mb-20" key={index}>
                                <div className="info-card-title">
                                    <h6>{q.question.shortDesc}</h6>
                                </div>
                                <div className="info-card-content">
                                    {
                                        q.question.answers.length === 0 ?
                                            <>
                                                <div className="mb-3">{q.question.text}</div>
                                                <p className="question-para">{q.answerText}</p>
                                            </> :
                                            <ul className="info-list">
                                                <li>
                                                    <p className="info-name">{q.question.text}</p>
                                                    <div className="info-details">
                                                        {
                                                            q.question.answers.map((a, aindex) => {
                                                                return <ul key={aindex} className="questionnaire_Control_container">
                                                                    <li className={a.selected ? "checkmark" : "nocheckmark"}>{a.text}</li>
                                                                </ul>
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

    const NavTabs = (props) => {

        return <>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                {/*<button className="nav-link active" id="nav-ativity-tab" data-bs-toggle="tab"*/}
                {/*    data-bs-target="#activity" type="button" role="tab" aria-controls="activity"*/}
                {/*    aria-selected="true">Activity</button>*/}
                <button className="nav-link active" id="nav-profile-tab" data-bs-toggle="tab"
                    data-bs-target="#profile" type="button" role="tab" aria-controls="profile"
                    aria-selected="true">Profile</button>
                <BlogCount username={props.username}></BlogCount>
                {/*<button className="nav-link" id="nav-groups-tab" data-bs-toggle="tab"*/}
                {/*    data-bs-target="#groups" type="button" role="tab" aria-controls="groups"*/}
                {/*    aria-selected="false">Groups <span className="item-number">06</span></button>*/}
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
        </>

    }

    const BannerInfo = () => {


        return <>
            <div className="profile-item">
                <div className="profile-cover">
                    <img src="assets/images/profile/cover.jpg" alt="cover-pic" />
                    {/*<div className="edit-photo custom-upload">*/}
                    {/*    <div className="file-btn"><i className="icofont-camera"></i>*/}
                    {/*        Edit Photo</div>*/}
                    {/*    <input type="file"/>*/}
                    {/*</div>*/}
                </div>
                <div className="profile-information">
                    <div className="profile-pic">
                        <img src={info.profilePic} alt="DP" />
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
            {/*<div className="profile-item d-none">*/}
            {/*    <div className="lab-inner">*/}
            {/*        <div className="lab-thumb">*/}
            {/*            <a href="/#"><img src="assets/images/profile/Profile.jpg" alt="profile"/></a>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    }

    return !infoloaded ?  <LoadingDiv></LoadingDiv> :
    <section className="profile-section padding-tb">
        <div className="container">
            <div className="section-wrapper">
                <div className="member-profile">
                   <BannerInfo></BannerInfo>
                    <div className="profile-details">
                        <nav className="profile-nav">
                            <NavTabs username={username}></NavTabs>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            {/*Profile tab */}
                            <div className="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                    <div className="row">
                                        <div className="col-xl-8">
                                            <article>
                                                <BasicInfo></BasicInfo>
                                                <ProfileQuestions></ProfileQuestions>
                                            </article>
                                        </div>
                                        {/* Aside Part */}
                                        <div className="col-xl-4">
                                            <AsideSearch></AsideSearch>
                                        </div>
                                    </div>
                            </div>
                            {/*Blog tab*/}
                            <div className="tab-pane fade" id="blogs" role="tabpanel" aria-labelledby="nav-blogs-tab">
                                <div className="container blog-section">
                                    <div className="main-blog">
                                        <div className="row">
                                            <div className="col-lg-8 col-12">
                                                <Blogs username={username}></Blogs>
                                            </div>
                                            <div className="col-lg-4 col-12">
                                                <AsideSearch></AsideSearch>
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

}