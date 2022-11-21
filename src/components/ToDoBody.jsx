import React, { useState, useEffect } from 'react'
import { get, child, ref, remove, update } from 'firebase/database'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { Link } from 'react-router-dom'
import database from '../utils/database'
import storage from '../utils/storage'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'



export default function ToDoBody() {
    const [loading, setLoading] = useState(true);
    const [todo, setTodo] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        get(child(ref(database), 'todo'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setTodo(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            }).finally(setLoading(false));
    }, []);

    /**
     * Handling updateing of a small text about days left. 
     * @param {Object} tod 
     * @returns String about how much days left or passed.
     */
    const updateDateText = (tod) => {
        if (todo[tod]['done']) return "";
        const dateToCompare = dayjs(todo[tod]['date']);
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
     * Returns the color of the todoList item.
     * @param {Number | Date} date 
     * @param {Boolean} done 
     * @returns 
     */
    const getColor = (date, done) => {
        if (done === true) return 'RGBA(67,220,80,0.57)';
        const dateToCompare = dayjs(date);
        const diff = dateToCompare.diff(dayjs(), 'days');
        if (diff < 0) {
            return `RGBA(255,101,80,0.7)`;
        } else if (diff === 0) {
            return `RGBA(255,159,80,0.7)`;
        } else {
            return `RGBA(255,206,80,0.7)`;
        }
    }

    /**
     * Handling deleting of todoList item.
     * @param {Event} e 
     * @param {Object} tod 
     */
    const handleDelete = (e, tod) => {
        e.preventDefault();
        const ok = window.confirm("Are you sure want to delete a todo?");
        if (!ok) return;
        let newTodo = { ...todo };
        delete (newTodo[tod]);
        setTodo(newTodo);
        remove(ref(database, `todo/${tod}`)).then(() => {
            deleteObject(storageRef(storage, `files/${tod}`))
        });
    }
    /**
     * Handling marking of todoItem as completed.
     * @param {Event} e 
     * @param {Object} tod 
     */
    const handleComplete = (e, tod) => {
        e.preventDefault();
        if (todo[tod]['done']) {
            alert('Todo is already done');
            return;
        }
        const ok = window.confirm("Are you sure want to mark a todo as completed?");
        if (!ok) return;
        let newTodo = { ...todo };
        newTodo[tod]['done'] = true;
        setTodo(newTodo);
        update(ref(database, `todo/${tod}`), {
            done: true
        });
    }


    if (loading) return (<div>Loading...</div>);
    return (
        <div className="list-group d-flex justify-center align-items-center">
            {Object.keys(todo).map(tod =>
                <Link key={tod} to={tod} className="list-group-item list-group-item-action" style={{ backgroundColor: getColor(todo[tod]['date'], todo[tod]['done']), }}>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1 w-75">{todo[tod]['title']}</h5>
                        <small className="text-muted">{updateDateText(tod)}</small>
                    </div>
                    <div className="d-flex w-100 justify-content-between" >
                        <p className="mb-1 w-75">{todo[tod]['description']}</p>
                        <div className="d-inline">
                            <button title="Delete todo" className='btn btn-danger ms-2' onClick={e => handleDelete(e, tod)}><i className="bi bi-trash3"></i></button>
                            <button title="Mark as completed" className='btn btn-success mx-2' onClick={e => handleComplete(e, tod)}><i className="bi bi-check"></i></button>
                            <button title="Edit" className='btn btn-light mx-2' onClick={e => {
                                e.preventDefault();
                                navigate(`/todo/edit/${tod}`);
                            }}>
                                <i className="bi bi-pencil-square"></i>
                            </button>
                        </div>
                    </div>
                    <small className="text-muted">{todo[tod]['files'] ? todo[tod]['files'].length : 0} files here</small>
                </Link>
            )}
        </div>
    )
}