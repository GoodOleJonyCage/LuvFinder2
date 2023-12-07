import { useState } from 'react';
import { LoginUser } from '../Services/Services'
import { UserStore } from './UserStore'
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [result, setresult] = useState('');
    const [submitted, setsubmitted] = useState(false);
    const [btnPressed, setbtnPressed] = useState(false);
    const { saveToken, saveUsername } = UserStore();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        setresult('');
        setsubmitted(true);
        setbtnPressed(true);

        if (username.length > 0 && password.length > 0) {

            try {

                const token = await LoginUser(username, password);
                //console.log(token);
                if (token) {
                    saveToken(token);
                    saveUsername(username);
                    navigate('/home');//?username=' + username;
                }

            } catch (response) {
                response.json().then(error => {
                    console.log(error);
                    setresult(error);
                    setbtnPressed(false);
                })
            }
        }
        else {
            setbtnPressed(false);
        }
    }

    return <div className="login-section padding-tb">
                <div className=" container">
                    <div className="account-wrapper">
                        <h3 className="title">Login</h3>
                        <div className="account-form">
                            <div className="form-group">
                            <input
                            onChange={(e) => { setusername(e.target.value) }}
                            className={submitted && !username ? "highlight-field" : ""}
                            type="text" placeholder="User Name" name="username" />
                            </div>
                            <div className="form-group">
                            <input
                            onChange={(e) => { setpassword(e.target.value) }}
                            className={submitted && !password ? "highlight-field" : ""}
                            type="password" placeholder="Password" name="password" />
                            </div>
                            <div className="form-group">
                                <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                                    <div className="checkgroup">
                                        <input type="checkbox" name="remember" id="remember" />
                                <label htmlFor="remember">Remember Me</label>
                                    </div>
                                    <a href="/#">Forget Password?</a>
                                </div>
                            </div>
                            <div className="form-group highlight-error">
                                {result}
                            </div>
                            <div className="form-group">
                            {   
                               !btnPressed &&
                                    <button onClick={handleSubmit} type="Submit"
                                        className="d-block lab-btn">Submit Now</button>
                            }
                            </div>
                        </div>
                        <div className="account-bottom">
                            <span className="d-block cate pt-10">Don’t Have any Account? <a href="/register"> Sign
                                Up</a></span>
                            <span className="or"><span>or</span></span>
                            <h5 className="subtitle">Login With Social Media</h5>
                            <ul className="social-media social-color lab-ul d-flex justify-content-center">
                                <li>
                                    <a href="/#" className="facebook"><i className="icofont-facebook"></i></a>
                                </li>
                                <li>
                                    <a href="/#" className="twitter"><i className="icofont-twitter"></i></a>
                                </li>
                                <li>
                                    <a href="/#" className="linkedin"><i className="icofont-linkedin"></i></a>
                                </li>
                                <li>
                                    <a href="/#" className="instagram"><i className="icofont-instagram"></i></a>
                                </li>
                                <li>
                                    <a href="/#" className="pinterest"><i className="icofont-pinterest"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
}
 
