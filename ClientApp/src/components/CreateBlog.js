import { useState, useEffect } from 'react'
import { UploadBlog } from '../Services/Services'
import { UserStore } from './UserStore'
import { NavLink } from 'react-router-dom';

export const CreateBlog = (props) => {

    const [image, setImage] = useState(null);
    const [title, settitle] = useState('');
    const [body, setbody] = useState('');
    const [error, seterror] = useState('');
    const [result, setresult] = useState('');
    const { getUsername } = UserStore();

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    useEffect(() => {
        //if (props.image && props.image.length > 0)
        //    setImage(props.image);
    }, []);

    return <>
        <div className="go-back-container">
            <i className="fas fa-arrow-left" aria-hidden="true"></i>
            <NavLink to="/editprofile">Go Back</NavLink>
        </div>
        <div className="post-item blog-item  ">
            <div className="post-item-inner">
                {result.length === 0 ?
                    <div className="post-content createblog-container ">
                        <div className="title-container">
                            <h3>Title</h3>
                            <input
                                onChange={(e) => { settitle(e.target.value) }}
                                type="text"></input>
                        </div>
                        <div className="image-container">
                            <img src={image == null ? "assets/images/blog/no-image-available.jpg" : image} alt="blog" />
                            <input type="file" id="files" name="files"
                                onChange={onImageChange}
                                className="filetype file-uploader" />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setImage(null);
                                    document.getElementById("files").value = "assets/images/blog/no-image-available.jpg";
                                }}
                                className="lab-btn d-block  btn-sm " >Clear Image <i className="icofont-paper-plane"></i></button>
                        </div>
                        <div>
                            <div className="text-center">Body</div>
                            <textarea
                                onChange={(e) => { setbody(e.target.value) }}
                                name="blog" id="blog" className="textarea" />
                        </div>
                        <div className="highlight-error text-center">{error}</div>

                        <button
                            onClick={async (e) => {

                                const dataArray = new FormData();
                                const filedata = document.getElementById("files").files[0];
                                dataArray.append("files", filedata);
                                dataArray.append('title', title);
                                dataArray.append('body', body);
                                dataArray.append('username', getUsername());
                                try {
                                    seterror('');
                                    var response = await UploadBlog(dataArray);
                                    setresult(response);
                                    //reload blog count
                                    props.loadBlogCount();
                                    //reload blogs
                                    props.loadBlogs();
                                } catch (e) {

                                    e.text().then(error => {
                                        seterror(error);
                                    })
                                }

                            }}
                            className="lab-btn">Publish Blog</button>
                    </div>
                    :
                    <div className="text-center createblog-result-container padding-tb">
                        <div className="text-success result-label">{result}</div>
                        <button
                            onClick={async (e) => {
                                setresult('');
                                setImage(null);
                                settitle('');
                                setbody('');
                            }}
                            className="lab-btn">Create Another</button>
                    </div>
                }
            </div>
        </div>
    </>
}