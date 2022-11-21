import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get, ref, child, update } from 'firebase/database'
import { ref as storageRef, deleteObject } from "firebase/storage";
import database from '../utils/database'
import storage from '../utils/storage'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

export default function ToDoListItem() {
    const navigate = useNavigate();
    const { todoID } = useParams();
    const [loading, setLoading] = useState(true);
    const [todo, setTodo] = useState({});

    useEffect(() => {
        setLoading(true);
        get(child(ref(database, 'todo'), todoID)).then((snapshot) => {
            console.log(snapshot.val());
            if (snapshot.exists()) {
                setTodo(snapshot.val());
            } else {
                throw new Error("error");
            }
        }).catch(err => {
            navigate('/');
            alert("Todo with this id is not exists. You will be redirected to the main page.");
        }).finally(setLoading(false));
    }, [navigate, todoID])

    /**
     * Handling updateing of a small text about days left. 
     * @param {Object} tod 
     * @returns String about how much days left or passed.
     */
    const updateDateText = (tod) => {
        if (tod['done']) return "Task is already done.";
        const dateToCompare = dayjs(todo['date']);
        const diff = dateToCompare.diff(dayjs(), 'days');
        if (diff < 0) {
            if (diff === -1) return `${-diff} day ago`;
            return `${-diff} days ago`;
        } else if (diff === 0) {
            return `Last day!`;
        } else {
            if (diff === 1) return `${diff} day left`;
            return `${diff} days left`;
        }
    }

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
        const currentState = { ...todo }
        currentState.files.splice(currentState.files.indexOf(fileName), 1);
        setTodo(currentState);
        const fileRef = storageRef(storage, `files/${todoID}/${fileName}`);

        update(ref(database, `/todo/${todoID}`), {
            files: currentState.files
        })
        deleteObject(fileRef);
    }
    if (loading) return <div>Loading...</div>
    return (
        <div className='d-flex justify-content-center align-items-center mt-5'>
            <ul className="list-group">
                <li className="list-group-item">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Title</div>
                        {todo['title']}
                    </div>
                </li>
                <li className="list-group-item mw-50">
                    <div className="ms-2 me-auto ">
                        <div className="fw-bold">Description</div>
                        <div style={{ maxWidth: 300 + 'px' }}>
                            {todo['description']}
                        </div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Done</div>
                        {todo['done'] ? "yes" : "no"}
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Date</div>
                        {updateDateText(todo)}
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Files</div>
                        <ul className="list-group">

                            {todo.files ?
                                todo.files.map(file =>
                                    <li key={file} className="list-group-item">
                                        <div className="d-flex justify-content-between">
                                            <div>{file}</div>
                                            <button title="Delete file" className='btn btn-danger ms-2' onClick={e => handleFileDelete(e, file)}><i className="bi bi-trash3"></i></button>
                                        </div>
                                    </li>) : <div>None</div>
                            }
                        </ul>
                    </div>
                </li>
            </ul>
        </div >
    )
}
