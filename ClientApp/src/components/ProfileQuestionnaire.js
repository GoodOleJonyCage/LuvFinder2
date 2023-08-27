import { useEffect, useState } from 'react'
import { LoadingDiv } from './LoadingDiv'
import { LoadProfile, SaveProfile, LoadInitializedUserInfo,   LoadMaritalStatuses,LoadGenders } from '../Services/Services'
import { useNavigate, useLocation } from "react-router-dom";
import { LocationLocator } from './LocationLocator';
import Calendar from 'react-calendar';

export const ProfileQuestionnaire = () => {

      //get username from path
    const location = useLocation();
    let { username } = location.state;
      //get username from path

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

    const [btnPressed, setbtnPressed] = useState(false);
    const navigate = useNavigate();

    //helper methods for events
    const submitProfile = async () => {

        seterrors([]);
        seterror('');
        setbtnPressed(true);

        try {

            const profileSaved = await SaveProfile(username, questions, info);
            if (profileSaved)
                navigate('/upload', { state: { username: username }});

        } catch (e) {

            e.json().then(error_vm => {

                if (error_vm instanceof Array)
                {
                    var errorList = [];
                    var vm_is_questionnaire = error_vm[0].question  !== undefined;

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
   

    const loadData = async () => {

        try {

            let vminfo = await LoadInitializedUserInfo();
            setinfo(vminfo);
            //console.log(vminfo);

            let statuses = await LoadMaritalStatuses();
            setmaritalstatuses(statuses);

            let genderlist = await LoadGenders();
            setgenders(genderlist);
            
            const vm = await LoadProfile();
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
                                <select id="user-gender"
                                    defaultValue={info.genderID}
                                    onChange={(e) => {   info.genderID = e.target.value; }}>
                                    <option value="0">---</option>
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
                                <select id="user-gender"
                                    defaultValue={info.seekingGenderID}
                                    onChange={(e) => { info.seekingGenderID = e.target.value; }}>
                                    <option value="0">---</option>
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
                                    <option value="0">---</option>
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
                                <Calendar onChange={(e) => { info.dob = e.toJSON().slice(0, 10).replace(/-/g, '/'); }}
                                    defaultValue={info.dob} />
                            </div>
                        </li>
                        <li>
                            <p className="info-name">Address</p>
                            <div className="info-details">
                                <LocationLocator info={info}></LocationLocator>
                            </div>
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
                        return <div className={q.question.invalidResponse ? "info-card mb-20 highlight-body" :"info-card mb-20"} key={index}>
                            <div className="info-card-title">
                                <h6>{q.question.shortDesc} </h6>
                            </div>
                            <div className="info-card-content">
                                {
                                    q.question.answers.length === 0 ?
                                        <>
                                            <div>{q.question.text}</div>
                                            <textarea defaultValue={q.answerText}
                                                onChange={(e) => { q.answerText = e.target.value }}
                                                className="profilequestionnaire-textarea"   rows="5" cols="5"></textarea>
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
                                                                                defaultChecked={a.selected}
                                                                                onChange={(e) => { a.selected = e.target.checked }}
                                                                                type="checkbox" value={a.text} />{a.text}
                                                                        </label> :
                                                                        q.question.questionType === 2 ?
                                                                            <label>
                                                                                <input
                                                                                    defaultChecked={a.selected}
                                                                                    onChange={(e) => { a.selected = e.target.checked }}
                                                                                    name={q.question.text} type="radio" value={a.text} />{a.text}
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

    return <div className="profilequestionnaire-container profile-details">
        <div className="col-sm-10 m-auto ">
            <article>
                <BasicInfo></BasicInfo>
                <ProfileQuestions></ProfileQuestions>
            </article>
        </div>
        <div className="container">
            <SaveButton></SaveButton>
        </div>
    </div>

}