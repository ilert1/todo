import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import storage from "../../utils/storage";
import { ref as storageRef, uploadBytes, deleteObject } from "firebase/storage";
import database from '../../utils/database';
import { ref, get, child, update } from "firebase/database";
import dayjs from 'dayjs';

export default function CreateTodo() {
    const [data, setData] = useState({ title: "", description: "", date: "" });
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);
    const [loading, setLoading] = useState(true);
    const { todoID } = useParams();
    const navigate = useNavigate();
    let MAX_COUNT = 5;
    MAX_COUNT = 5 - (data.files ? data.files.length : 0);


    useEffect(() => {
        setLoading(true);
        get(child(ref(database), `/todo/${todoID}`)).then((snapshot) => {
            const newDate = dayjs(snapshot.val().date).format("YYYY-MM-DD");
            let newData = { ...snapshot.val() }
            newData.date = newDate;
            setData(newData);
        }).finally(setLoading(false));
    }, [todoID]);

    /**
     * The function is used to get a list of uploaded files.
     * @param {Array<String>} files The list of files 
     */
    const handleUploadedFiles = files => {
        const uploaded = [...uploadedFiles];
        let limit = false;
        // eslint-disable-next-line array-callback-return
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name === -1)) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    alert(`You can add up to 5 files. Your files will not be uploaded!!`);
                    setFileLimit(false);
                    limit = true;
                    return true;
                }
            }
        })
        if (!limit) setUploadedFiles(uploaded);
    }
    /**
     * Handling file chossing event
     * @param {Event} event 
     */
    const handleFileEvent = (event) => {
        const chosenFiles = Array.prototype.slice.call(event.target.files);
        handleUploadedFiles(chosenFiles);
    }
    /**
     * Util for changing data state.
     */
    const onChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    }
    /**
    * Util for changing data state.
    */
    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value })
    }

    /**
     * Handling submit event of form.
     * Updating data in db. Path is "todo/:todoID"
     * Updating files in storage. Path is "files/:todoID"
     * @param {Event} e 
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const dateValueInEpoch = new Date(data.date).getTime();
        update(ref(database, "todo/" + todoID), {
            title: data.title,
            description: data.description,
            date: dateValueInEpoch,
            done: false,
            files: uploadedFiles ? uploadedFiles.map(elem => elem.name).concat(data.files) : data.files ? data.files : ""
        });
        for (let file of uploadedFiles) {
            const filePath = storageRef(
                storage,
                "files/" + todoID + '/' + file.name
            );
            uploadBytes(filePath, file).then((snapshot) => {
                console.log("Uploaded!");
            });
        }
    };
    /**
     * Function to delete a file from the database.
     * @param {Event} e 
     * @param {String} fileName 
     * @returns 
     */
    const handleFileDelete = (e, fileName) => {
        e.preventDefault();
        const ok = window.confirm("Are you sure want to delete a file?");
        if (!ok) return;
        const currentState = { ...data }
        currentState.files.splice(currentState.files.indexOf(fileName), 1);
        setData(currentState);
        const fileRef = storageRef(storage, `files/${todoID}/${fileName}`);

        update(ref(database, `/todo/${todoID}`), {
            files: currentState.files
        })
        deleteObject(fileRef);
        navigate('/');
    }
    if (loading) return (<div>Loading...</div>)
    return (
        <div className='row d-flex justify-content-center align-items-center'>
            <form className='w-50 py-5' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="todoTitle" className="form-label">Title</label>
                    <input value={data.title} type="text" className="form-control" id="todoTitle" required onChange={handleChange} name='title' />
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <textarea value={data.description} className='form-control' id='desc' cols="40" rows="5" required onChange={handleChange} name='description'></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input value={data.date} id="date" type="date" className="form-control" required onChange={handleChange} name='date' />
                </div>
                <div className="mb-3">
                    <label htmlFor="formFileMultiple" className="form-label">Files(Up to 5 files)</label>
                    <input className="form-control" type="file" id="formFileMultiple" multiple onChange={handleFileEvent} name='files' disabled={fileLimit} />
                </div>
                <div className="mb-3">
                    <ul className="list-group">
                        {data.files ?
                            data.files.map(file =>
                                <li key={file} className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <div>{file}</div>
                                        <button title="Delete file" className='btn btn-danger ms-2' onClick={e => handleFileDelete(e, file)}><i className="bi bi-trash3"></i></button>
                                    </div>
                                </li>) : <div>None</div>}
                    </ul>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button >
            </form>
        </div >
    )
}