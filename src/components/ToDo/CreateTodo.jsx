import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import storage from "../../utils/storage";
import { ref as storageref, uploadBytes } from "firebase/storage";
import database from '../../utils/database';
import { set, ref, get, child, update } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from '../../utils/auth'
import { useTodo } from '../../hooks/useTodo';

const MAX_FILES_COUNT = 5;

export default function CreateTodo() {
    const [data, setData] = useState({ title: "", description: "", date: "" });
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nextItemIndex, setNextItemIndex] = useState('');
    const navigate = useNavigate();
    const [user, userLoading] = useAuthState(auth);
    const { getTodoList } = useTodo();
    useEffect(() => {
        if (userLoading) {
            setLoading(true);
        }
        else
            setLoading(false);
    }, [userLoading]);
    useEffect(() => {
        setLoading(true);
        get(child(ref(database), `todo/${user.uid}/counter`)).then((spanshot) => {
            if (!spanshot.val()) {
                set(child(ref(database), `todo/${user.uid}/counter`), 1);
                setNextItemIndex(1);
            }
            else {
                setNextItemIndex(Number(spanshot.val()))
            }
        }).finally(setLoading(false));
    }, []);



    const handleUploadedFiles = files => {
        const uploaded = [...uploadedFiles];
        let limit = false;
        // eslint-disable-next-line array-callback-return
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name === -1)) {
                uploaded.push(file);
                if (uploaded.length === MAX_FILES_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_FILES_COUNT) {
                    alert(`You can add up to 5 files. Your files will not be uploaded!!`);
                    setFileLimit(false);
                    limit = true;
                    return true;
                }
            }
        })
        if (!limit) setUploadedFiles(uploaded);
    }

    const handleFileEvent = (event) => {
        const chosenFiles = Array.prototype.slice.call(event.target.files);
        handleUploadedFiles(chosenFiles);
    }


    const onChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    }


    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const dateValueInEpoch = new Date(data.date).getTime();
        set(ref(database, "todo/" + user.uid + '/' + nextItemIndex), {
            title: data.title,
            description: data.description,
            date: dateValueInEpoch,
            done: false,
            files: uploadedFiles ? uploadedFiles.map(elem => elem.name) : ""
        }).then(() => {
            update(ref(database, `todo/${user.uid}`), {
                counter: nextItemIndex + 1
            });
        });
        for (let file of uploadedFiles) {
            const filePath = storageref(
                storage,
                "files/" + user.uid + '/' + nextItemIndex + '/' + file.name
            );
            uploadBytes(filePath, file).then((snapshot) => {
                console.log("Uploaded!");
            });
        }
        getTodoList();
        navigate('/');
    };


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
                <button type="submit" className="btn btn-primary">Submit</button >
            </form>
        </div >
    )
}