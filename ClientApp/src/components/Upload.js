import { useState, useEffect } from 'react'
import { UploadFile } from '../Services/Services'

export const Upload = (props) => {

    /*const [uploadFile, setUploadFile] = useState();*/
    const [image, setImage] = useState(null);
    const [error, seterror] = useState('');

    const submitForm = async (event) => {

        event.preventDefault();
        const dataArray = new FormData();
        const filedata = document.getElementById("files").files[0];
        dataArray.append("files", filedata);
        dataArray.append('username', props.username)

        try {
            seterror('');
            await UploadFile(dataArray);
            props.setfileuploaded(true);
        } catch (e) {
            
            e.text().then(error =>
            {
                //console.log(error);
                seterror(error);
            })
        }
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }
    useEffect(() => {
        if (props.profilePic && props.profilePic.length > 0)
            setImage(props.profilePic);
    }, []);
    

    return <>
        <form className="form-group upload-container" onSubmit={submitForm} encType="multipart/form-data">
            <div>
                <input type="file" id="files" name="files"
                    onChange={onImageChange} className="filetype file-uploader" />
            </div>
            <div>
                <img alt="" src={image} />
            </div>
            <div className="">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setImage(null);
                        document.getElementById("files").value = null
                    }}
                    className="lab-btn d-block  btn-sm " >Clear Image <i className="icofont-paper-plane"></i></button>
            </div>
            <div className="highlight-error">{error}</div>
            <div className="">
                <button className="lab-btn d-block upload-btn " type="submit" >Upload<i className="icofont-paper-plane"></i></button>
            </div>
        </form>
    </>


}