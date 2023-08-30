import { useState, useEffect } from 'react'
import { BlogEdit } from '../Services/Services'
import { UserStore } from './UserStore'
import { useLocation, useNavigate } from "react-router-dom"

export const EditBlog = (props) => {

    let location = useLocation();
    const navigate = useNavigate();

    const [blog, setblog] = useState(location.state.blog);
    const [image, setImage] = useState(null);
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
        
        //console.log(blog);
    }, []);

    return <>
        <div className="post-item blog-item  ">
            <div className="post-item-inner">
                {result.length === 0 ?
                    <div className="post-content createblog-container ">
                        <div className="title-container">
                            <h3>Title</h3>
                            <input
                                defaultValue={blog.title}   
                                onChange={(e) => { blog.title = e.target.value }}
                                type="text"></input>
                        </div>
                        <div className="image-container">
                            <img src={image == null ? blog.image : image} alt="blog" />
                            <input type="file" id="files" name="files"
                                onChange={onImageChange}
                                className="filetype file-uploader" />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setImage(null);
                                    document.getElementById("files").value = blog.image;
                                }}
                                className="lab-btn d-block  btn-sm " >Revert Image <i className="icofont-paper-plane"></i></button>
                        </div>
                        <div>
                            <div className="text-center">Body</div>
                            <textarea
                                defaultValue={blog.body}
                                onChange={(e) => { blog.body = e.target.value }}
                                name="blog" id="blog" className="textarea" />
                        </div>
                        <div className="highlight-error text-center">{error}</div>
                        <button
                            onClick={async (e) => {
                                
                                const dataArray = new FormData();
                                const filedata = document.getElementById("files").files[0];
                                dataArray.append("blogid", blog.id);
                                dataArray.append("files", filedata);
                                dataArray.append('title', blog.title);
                                dataArray.append('body', blog.body);
                                dataArray.append('username', getUsername());
                                try {
                                    seterror('');
                                    var response = await BlogEdit(dataArray);
                                    setresult(response);
                                    
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
                            onClick={async (e) => {navigate('/editprofile')}}
                            className="lab-btn"><i className='fas fa-arrow-left'></i>Go Back</button>
                    </div>
                }
            </div>
        </div>
    </>
}